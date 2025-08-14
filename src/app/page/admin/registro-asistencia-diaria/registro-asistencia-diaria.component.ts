import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import baseUrl from '../../../services/helper';
import { DialogoAsistenciaComponent } from '../dialogo-asistencia/dialogo-asistencia.component';
//import { HorarioService } from 'src/app/services/horario.service';
//import { Horario } from 'src/app/models/horario';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { HorarioService } from '../../../services/horario.service';
import { Horario } from '../../../models/horario';
import { SalarioService } from '../../../services/salario.service';
import { HorasTrabajadas } from '../../../models/horas-trabajadas';

@Component({
  selector: 'app-registro-asistencia-diaria',
  templateUrl: './registro-asistencia-diaria.component.html',
  styleUrls: ['./registro-asistencia-diaria.component.css']
})
export class RegistroAsistenciaDiariaComponent implements OnInit, AfterViewInit {
  columnasResumen: string[] = [
    'usuario',
    'dni',
    'puesto',
    'horaEntrada',
    'horaSalida',
    'tiempoTrabajo',
    'estado'
  ];

  dataSourceResumen = new MatTableDataSource<any>([]);
  datosOriginales: any[] = [];
  horariosAsignados: Horario[] = [];

  filtroNombre: string = '';
  filtroCentro: string = '';
  centrosDisponibles: string[] = [];

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  toleranciaEntradaMinutos: number = 0;
  toleranciaSalidaMinutos: number = 0;

  horasNormalesPorDia: number = 8; // Puedes ajustar el valor por defecto si lo deseas


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private horarioService: HorarioService,
    private salarioService: SalarioService // 👈 para compartir resumen
  ) {}

 

ngOnInit(): void {
  this.horarioService.obtenerTolerancia().subscribe({
    next: config => {
      this.toleranciaEntradaMinutos = config.toleranciaEntrada;

      this.horarioService.obtenerHorasNormalesPorDia().subscribe({
        next: config => {
          this.horasNormalesPorDia = config.horasNormalesPorDia;
          this.cargarTodas(); // 👈 solo después de tener todo
        },
        error: err => {
          console.error('Error cargando horas normales por día:', err);
          this.cargarTodas();
        }
      });
    },
    error: err => {
      console.error('Error cargando tolerancia:', err);
      this.cargarTodas();
    }
  });
}



  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSourceResumen.paginator = this.paginator;
      this.dataSourceResumen.sort = this.sort;

      this.sort.active = 'fecha';
      this.sort.direction = 'asc';
      this.sort.sortChange.emit();

      this.dataSourceResumen.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'fecha':
            return new Date(item.fecha);
          default:
            return item[property];
        }
      };
    });
  }

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargarTodas(): void {
    const url = `${baseUrl}/asistencia/admin/todas`;
    const headers = this.obtenerHeaders();

    this.http.get<any[]>(url, { headers }).subscribe({
      next: data => {
        this.datosOriginales = data;
        this.centrosDisponibles = [...new Set(data.map(d => d.usuario?.ctlc).filter(c => !!c))];

        this.horarioService.obtenerTodosLosHorarios().subscribe({
          next: horarios => {
            this.horariosAsignados = horarios;
            this.aplicarFiltro();
          },
          error: err => {
            console.error('Error al cargar horarios asignados', err);
            this.aplicarFiltro();
          }
        });
      },
      error: err => console.error('Error al cargar asistencias', err)
    });
  }

  aplicarFiltro(): void {
    this.filtrarYCombinar(this.datosOriginales);
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroCentro = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.aplicarFiltro();
  }
filtrarYCombinar(data: any[]): void {
  const textoFiltro = this.filtroNombre.trim().toLowerCase();
  const centro = this.filtroCentro;
  const desde = this.fechaInicio ? new Date(this.fechaInicio).setHours(0, 0, 0, 0) : null;
  const hasta = this.fechaFin ? new Date(this.fechaFin).setHours(23, 59, 59, 999) : null;

  const resumenMap = new Map<string, any>();
  const resumenHoras: HorasTrabajadas[] = [];

  data.forEach(registro => {
    const fechaObj = new Date(registro.fechaHora);
    const fecha = fechaObj.toLocaleDateString('en-CA');
    const nombreCompleto = `${registro.usuario?.nombre || ''} ${registro.usuario?.apellido || ''}`.toLowerCase();
    const dniUsuario = registro.usuario?.dni?.toLowerCase() || '';

    if (textoFiltro && !nombreCompleto.includes(textoFiltro) && !dniUsuario.includes(textoFiltro)) return;
    if (centro && registro.usuario?.ctlc !== centro) return;
    if (desde && fechaObj.getTime() < desde) return;
    if (hasta && fechaObj.getTime() > hasta) return;

    const clave = `${registro.usuario?.id}_${fecha}`;
    if (!resumenMap.has(clave)) {
      const registrosDelDia = data.filter(r => {
        const rFecha = new Date(r.fechaHora).toLocaleDateString('en-CA');
        return r.usuario?.id === registro.usuario?.id && rFecha === fecha;
      });

      if (registrosDelDia.length === 0) return;

      const entradas = registrosDelDia.filter(r => r.tipo === 'entrada');
      const salidas = registrosDelDia.filter(r => r.tipo === 'salida');

      const horaEntrada = entradas.length
        ? entradas[0].fechaHora
        : registrosDelDia[0]?.fechaHora || null;

      const horaSalida = salidas.length
        ? salidas[salidas.length - 1].fechaHora
        : registrosDelDia[registrosDelDia.length - 1]?.fechaHora || null;

      let tiempoTrabajo = '—';
      let horasNormales = 0;
      let horasExtras = 0;

      if (horaEntrada && horaSalida) {
        const entradaDate = new Date(horaEntrada);
        const salidaDate = new Date(horaSalida);
        const ms = salidaDate.getTime() - entradaDate.getTime();

        if (ms > 0) {
          const horasTrabajadas = ms / (1000 * 60 * 60); // 👈 horas decimales
          const horas = Math.floor(horasTrabajadas);
          const minutos = Math.floor((horasTrabajadas % 1) * 60);
          tiempoTrabajo = `${horas}h ${minutos}min`;

          horasNormales = Math.min(horasTrabajadas, this.horasNormalesPorDia);
          horasExtras = Math.max(0, horasTrabajadas - this.horasNormalesPorDia);

          resumenHoras.push({
            usuarioId: registro.usuario.id,
            mes: fecha.slice(0, 7),
            horasNormales,
            horasExtras
          });
        } else {
          tiempoTrabajo = '0h 0min';
        }
      }

      let estado = '—';
      const horariosDelDia = this.horariosAsignados.filter(h =>
        h.usuario?.id === registro.usuario?.id &&
        this.fechaDentroDelRango(h.fechaInicio, h.fechaFin, fechaObj)
      );

      if (horaEntrada) {
        const entradaDate = new Date(horaEntrada);
        estado = this.evaluarEstadoConMultiplesHorarios(entradaDate, horariosDelDia, this.toleranciaEntradaMinutos);
      }

      resumenMap.set(clave, {
        usuario: registro.usuario,
        fecha,
        dni: registro.usuario?.dni || '—',
        puesto: registro.usuario?.puesto || '—',
        horaEntrada: horaEntrada ? new Date(horaEntrada).toLocaleTimeString() : '—',
        horaSalida: horaSalida ? new Date(horaSalida).toLocaleTimeString() : '—',
        tiempoTrabajo,
        estado
      });
    }
  });

  this.dataSourceResumen.data = Array.from(resumenMap.values());
  this.salarioService.setAsistenciasDiarias(resumenHoras);
}



exportarExcel(): void {
  const exportData = this.dataSourceResumen.filteredData.map(row => ({
    Nombre: `${row.usuario?.nombre || ''} ${row.usuario?.apellido || ''}`,
    DNI: row.dni,
    Puesto: row.puesto,
    'Hora Entrada': row.horaEntrada,
    'Hora Salida': row.horaSalida,
    'Tiempo de Trabajo': row.tiempoTrabajo,
    Estado: row.estado
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencia');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, `Registro_Asistencia_Diaria_${new Date().toISOString().slice(0,10)}.xlsx`);
}

private normalizarFechaLocal(fecha: string): Date {
  const [y, m, d] = fecha.split('-').map(Number);
  return new Date(y, m - 1, d);
}


mostrarFiltrosConSwal(): void {
  Swal.fire({
    title: '<strong style="font-size: 18px;">Filtros de asistencia</strong>',
    html: `
      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px; max-width: 100%; padding-top: 8px;">
        <input id="nombreInput" class="swal2-input" placeholder="Nombre o DNI" value="${this.filtroNombre}" style="height: 32px; font-size: 13px;">

        <select id="centroSelect" class="swal2-select" style="height: 32px; font-size: 13px;">
          <option value="">Todas las áreas</option>
          ${this.centrosDisponibles.map(c =>
            `<option value="${c}" ${this.filtroCentro === c ? 'selected' : ''}>${c}</option>`
          ).join('')}
        </select>

        <input id="fechaInicioInput" type="date" class="swal2-input"
          value="${this.fechaInicio ? this.fechaInicio.toISOString().slice(0,10) : ''}"
          style="height: 32px; font-size: 13px;">

        <input id="fechaFinInput" type="date" class="swal2-input"
          value="${this.fechaFin ? this.fechaFin.toISOString().slice(0,10) : ''}"
          style="height: 32px; font-size: 13px;">
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
      this.filtroNombre = (document.getElementById('nombreInput') as HTMLInputElement).value;
      this.filtroCentro = (document.getElementById('centroSelect') as HTMLSelectElement).value;

      const fechaInicioStr = (document.getElementById('fechaInicioInput') as HTMLInputElement).value;
      const fechaFinStr = (document.getElementById('fechaFinInput') as HTMLInputElement).value;

      this.fechaInicio = fechaInicioStr ? new Date(fechaInicioStr) : null;
      this.fechaFin = fechaFinStr ? new Date(fechaFinStr) : null;

      this.aplicarFiltro();
    }
  }).then(result => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      this.limpiarFiltros();
    }
  });
}

private fechaDentroDelRango(inicio: string | Date, fin: string | Date | undefined, fecha: Date): boolean {
  const f = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const i = new Date(new Date(inicio).getFullYear(), new Date(inicio).getMonth(), new Date(inicio).getDate());
  const fFin = fin ? new Date(new Date(fin).getFullYear(), new Date(fin).getMonth(), new Date(fin).getDate()) : null;

  return i <= f && (!fFin || f <= fFin);
}

private evaluarEstadoConMultiplesHorarios(
  entrada: Date,
  horarios: Horario[],
  toleranciaMinutos: number
): string {
  for (const horario of horarios) {
    if (!horario.horaEntrada) continue;

    const [h, m] = horario.horaEntrada.split(':').map(Number);
    const horaProgramada = new Date(entrada);
    horaProgramada.setHours(h, m, 0, 0);

    const horaConTolerancia = new Date(horaProgramada);
    horaConTolerancia.setMinutes(horaConTolerancia.getMinutes() + toleranciaMinutos);

    if (entrada <= horaProgramada) return 'Puntual';
    if (entrada <= horaConTolerancia) return 'Puntual*';
  }

  return 'Tarde';
}



}
