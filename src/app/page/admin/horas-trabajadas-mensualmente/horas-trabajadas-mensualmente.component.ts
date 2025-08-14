import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
//import { HorarioService } from 'src/app/services/horario.service';
//import { Horario } from 'src/app/models/horario';
import baseUrl from '../../../services/helper';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { HorarioService } from '../../../services/horario.service';
import { Horario } from '../../../models/horario';


@Component({
  selector: 'app-horas-trabajadas-mensualmente',
  templateUrl: './horas-trabajadas-mensualmente.component.html',
  styleUrls: ['./horas-trabajadas-mensualmente.component.css']
})
export class HorasTrabajadasMensualmenteComponent implements OnInit, AfterViewInit {
  columnasResumen: string[] = ['usuario', 'dni', 'puesto', 'mes', 'horasAcumuladas'];
  dataSourceResumen = new MatTableDataSource<any>([]);
  datosOriginales: any[] = [];
  horariosAsignados: Horario[] = [];
  centrosDisponibles: string[] = [];

  filtroNombre: string = '';
  filtroCentro: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private horarioService: HorarioService) {}

  ngOnInit(): void {
    this.cargarTodas();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSourceResumen.paginator = this.paginator;
      this.dataSourceResumen.sort = this.sort;
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

    const registrosPorDia = new Map<string, any>();

    data.forEach(registro => {
      const fechaObj = new Date(registro.fechaHora);
      const fechaTexto = fechaObj.toISOString().split('T')[0];
      const nombreCompleto = `${registro.usuario?.nombre || ''} ${registro.usuario?.apellido || ''}`.toLowerCase();
      const dniUsuario = registro.usuario?.dni?.toLowerCase() || '';
      const tipo = registro.tipo?.trim().toLowerCase();

      if (textoFiltro && !nombreCompleto.includes(textoFiltro) && !dniUsuario.includes(textoFiltro)) return;
      if (centro && registro.usuario?.ctlc !== centro) return;
      if (desde && fechaObj.getTime() < desde) return;
      if (hasta && fechaObj.getTime() > hasta) return;

      const clave = `${registro.usuario?.id}_${fechaTexto}`;
      if (!registrosPorDia.has(clave)) {
        registrosPorDia.set(clave, {
          usuario: registro.usuario,
          dni: registro.usuario?.dni || '—',
          puesto: registro.usuario?.puesto || '—',
          fecha: fechaTexto,
          asistencias: []
        });
      }

      const item = registrosPorDia.get(clave);
      item.asistencias.push({ tipo, hora: fechaObj });
    });

    const resumenDiario = Array.from(registrosPorDia.values());

    const acumuladoPorUsuarioMes: {
      [clave: string]: {
        usuario: any;
        dni: string;
        puesto: string;
        mes: string;
        horas: number;
      };
    } = {};

    resumenDiario.forEach(item => {
      let totalHoras = 0;
      const entradas: Date[] = [];
      const salidas: Date[] = [];

      item.asistencias.forEach(a => {
        if (a.tipo === 'entrada') entradas.push(a.hora);
        else if (a.tipo === 'salida') salidas.push(a.hora);
      });

      const pares = Math.min(entradas.length, salidas.length);
      for (let i = 0; i < pares; i++) {
        const entrada = entradas[i];
        const salida = salidas[i];

        if (salida < entrada) salida.setDate(salida.getDate() + 1);
        const diff = salida.getTime() - entrada.getTime();
        const horas = diff / (1000 * 60 * 60);
        if (horas >= 0.5) totalHoras += horas;
      }

      const mes = new Date(item.fecha).toLocaleString('default', { month: 'long', year: 'numeric' });
      const clave = `${item.usuario?.id}_${mes}`;

      if (!acumuladoPorUsuarioMes[clave]) {
        acumuladoPorUsuarioMes[clave] = {
          usuario: item.usuario,
          dni: item.dni,
          puesto: item.puesto,
          mes,
          horas: 0
        };
      }

      acumuladoPorUsuarioMes[clave].horas += totalHoras;
    });

    const resultadoFinal = Object.values(acumuladoPorUsuarioMes).map(item => ({
      usuario: item.usuario,
      dni: item.dni,
      puesto: item.puesto,
      mes: item.mes,
      horasAcumuladas: `${Math.floor(item.horas)}h ${Math.round((item.horas % 1) * 60)}min`
    }));

    this.dataSourceResumen.data = resultadoFinal;
    this.columnasResumen = ['usuario', 'dni', 'puesto', 'mes', 'horasAcumuladas'];
  }

  exportarExcel(): void {
    const exportData = this.dataSourceResumen.filteredData.map(row => ({
      Nombre: `${row.usuario?.nombre || ''} ${row.usuario?.apellido || ''}`,
      DNI: row.dni,
      Puesto: row.puesto,
      Mes: row.mes,
      Acumulado: row.horasAcumuladas
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Horas Mensuales');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `Horas_Mensuales_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  mostrarFiltrosConSwal(): void {
    Swal.fire({
      title: '<strong style="font-size: 18px;">Filtros: Horas trabajadas</strong>',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px; padding-top: 8px;">
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
}
