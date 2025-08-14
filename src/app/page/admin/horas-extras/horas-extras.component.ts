import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//import { HorarioService } from 'src/app/services/horario.service';
//import { Horario } from 'src/app/models/horario';
import baseUrl from '../../../services/helper';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { HorarioService } from '../../../services/horario.service';
import { Horario } from '../../../models/horario';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.css']
})
export class HorasExtrasComponent implements OnInit, AfterViewInit {
  dataSourceResumen = new MatTableDataSource<any>([]);
  columnasResumen: string[] = ['nombre', 'dni', 'centro', 'fecha', 'horasExtras'];
  horariosAsignados: Horario[] = [];
  datosOriginales: any[] = [];

  filtroNombre: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private horarioService: HorarioService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.dataSourceResumen.paginator = this.paginator;
    this.dataSourceResumen.sort = this.sort;
  }

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargarDatos(): void {
    this.horarioService.obtenerTodosLosHorarios().subscribe({
      next: horarios => {
        this.horariosAsignados = horarios;
        this.http.get<any[]>(`${baseUrl}/asistencia/admin/todas`, { headers: this.obtenerHeaders() }).subscribe({
          next: asistencias => {
            this.datosOriginales = asistencias;
            this.generarHorasExtras();
          },
          error: err => console.error('Error al cargar asistencias', err)
        });
      },
      error: err => console.error('Error al cargar horarios asignados', err)
    });
  }

  generarHorasExtras(): void {
  const textoFiltro = this.filtroNombre.trim().toLowerCase();
  const desdeFiltro = this.fechaInicio ? new Date(this.fechaInicio).setHours(0, 0, 0, 0) : null;
  const hastaFiltro = this.fechaFin ? new Date(this.fechaFin).setHours(23, 59, 59, 999) : null;
  const hoy = new Date();

  const extras: any[] = [];
  const registrosPorDia = new Map<string, any>();

  this.datosOriginales.forEach(registro => {
    const usuario = registro.usuario;
    const fechaTexto = registro.fechaHora.split('T')[0];
    const clave = `${usuario?.id}_${fechaTexto}`;

    if (!registrosPorDia.has(clave)) {
      registrosPorDia.set(clave, {
        usuario,
        fecha: fechaTexto,
        entrada: undefined,
        salida: undefined
      });
    }

    const item = registrosPorDia.get(clave);
    const hora = new Date(registro.fechaHora);
    const tipo = registro.tipo?.toLowerCase().trim();

    if (tipo === 'entrada') {
      if (!item.entrada || hora < item.entrada) item.entrada = hora;
    } else if (tipo === 'salida') {
      if (!item.salida || hora > item.salida) item.salida = hora;
    }
  });

  registrosPorDia.forEach(item => {
    const usuario = item.usuario;
    const fecha = item.fecha;
    const nombreCompleto = `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.toLowerCase();
    const dniUsuario = usuario?.dni?.toLowerCase() || '';
    const fechaObj = new Date(fecha);

    if (textoFiltro && !nombreCompleto.includes(textoFiltro) && !dniUsuario.includes(textoFiltro)) return;
    if (desdeFiltro && fechaObj.getTime() < desdeFiltro) return;
    if (hastaFiltro && fechaObj.getTime() > hastaFiltro) return;
    if (fechaObj > hoy) return;

    if (item.entrada && item.salida) {
      if (item.salida < item.entrada) item.salida.setDate(item.salida.getDate() + 1);

      const diff = item.salida.getTime() - item.entrada.getTime();
      const totalHoras = diff / (1000 * 60 * 60);

      // ✅ Cálculo dinámico de jornada asignada
      const horariosDelDia = this.horariosAsignados.filter(h =>
        h.usuario?.id === usuario?.id &&
        this.fechaDentroDelRango(h.fechaInicio, h.fechaFin, fechaObj)
      );

      let jornadaAsignada = 8;

      if (horariosDelDia.length > 0 && horariosDelDia[0].horaEntrada && horariosDelDia[0].horaSalida) {
        const [hInicio, mInicio] = horariosDelDia[0].horaEntrada.split(':').map(Number);
        const [hFin, mFin] = horariosDelDia[0].horaSalida.split(':').map(Number);

        const inicio = new Date(1970, 0, 1, hInicio, mInicio);
        const fin = new Date(1970, 0, 1, hFin, mFin);

        if (fin < inicio) fin.setDate(fin.getDate() + 1);

        jornadaAsignada = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
      }

      const extra = totalHoras > jornadaAsignada ? totalHoras - jornadaAsignada : 0;

      if (extra > 0.1) {
        const extraH = Math.floor(extra);
        const extraM = Math.round((extra - extraH) * 60);
        extras.push({
          nombre: `${usuario?.nombre || ''} ${usuario?.apellido || ''}`,
          dni: usuario?.dni || '—',
          centro: usuario?.ctlc || '—',
          fecha,
          horasExtras: `${extraH.toString().padStart(2, '0')}h ${extraM.toString().padStart(2, '0')}m`
        });
      }
    }
  });

  this.dataSourceResumen.data = extras;
  console.log('Horas extras generadas:', extras);
}


  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.generarHorasExtras();
  }

  exportarExcel(): void {
    const exportData = this.dataSourceResumen.filteredData.map(row => ({
      Nombre: row.nombre,
      DNI: row.dni,
      Área: row.centro,
      Fecha: row.fecha,
      Horas_Extras: row.horasExtras
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Horas_Extras');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `Horas_Extras_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  mostrarFiltrosConSwal(): void {
    Swal.fire({
      title: '<strong style="font-size: 18px;">Filtros: Horas Extras</strong>',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px; margin-top: 10px;">
          <input id="nombreInput" class="swal2-input" placeholder="Nombre o DNI" value="${this.filtroNombre || ''}" />
          <input id="fechaInicioInput" type="date" class="swal2-input"
            value="${this.fechaInicio ? this.fechaInicio.toISOString().split('T')[0] : ''}" />
          <input id="fechaFinInput" type="date" class="swal2-input"
            value="${this.fechaFin ? this.fechaFin.toISOString().split('T')[0] : ''}" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Aplicar filtros',
      cancelButtonText: 'Limpiar',
      focusConfirm: false,
      customClass: {
        popup: 'swal2-popup-filtros-mini'
      },
      preConfirm: () => {
        this.filtroNombre = (document.getElementById('nombreInput') as HTMLInputElement).value.trim();
        const fechaInicioStr = (document.getElementById('fechaInicioInput') as HTMLInputElement).value;
        const fechaFinStr = (document.getElementById('fechaFinInput') as HTMLInputElement).value;
        this.fechaInicio = fechaInicioStr ? new Date(fechaInicioStr) : null;
        this.fechaFin = fechaFinStr ? new Date(fechaFinStr) : null;
        this.generarHorasExtras();
      }
    }).then(result => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        this.limpiarFiltros();
      }
    });
  }

  getHorasExtrasInfo(horasExtras: string): {
    clase: string;
    icon?: string;
    tooltip?: string;
    iconColor?: string;
  } 
  {
    const match = horasExtras?.match(/(\d+)h\s*(\d+)?m?/);
    const h = match ? parseInt(match[1], 10) : 0;

    if (h >= 2) {
      return {
        clase: 'extra-alta',
        icon: 'error',
        tooltip: 'Horas extras altas. Puede indicar sobrecarga laboral.',
        iconColor: '#d32f2f'
      };
    }

    if (h >= 1) {
      return {
        clase: 'extra-media',
        icon: 'warning',
        tooltip: 'Horas extras moderadas. Requiere seguimiento.',
        iconColor: '#ff9800'
      };
    }

    return { clase: '' };
  }

private fechaDentroDelRango(inicio: string | Date, fin: string | Date | undefined, fecha: Date): boolean {
  const f = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const i = new Date(new Date(inicio).getFullYear(), new Date(inicio).getMonth(), new Date(inicio).getDate());
  const fFin = fin ? new Date(new Date(fin).getFullYear(), new Date(fin).getMonth(), new Date(fin).getDate()) : null;

  return i <= f && (!fFin || f <= fFin);
}


}