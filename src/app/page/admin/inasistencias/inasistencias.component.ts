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
import { HorarioService } from '../../../services/horario.service';
import { Horario } from '../../../models/horario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inasistencias',
  templateUrl: './inasistencias.component.html',
  styleUrls: ['./inasistencias.component.css']
})
export class InasistenciasComponent implements OnInit, AfterViewInit {
  dataSourceResumen = new MatTableDataSource<any>([]);
  columnasResumen: string[] = ['nombre', 'dni', 'centro', 'fecha'];
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
            this.generarInasistencias();
          },
          error: err => console.error('Error al cargar asistencias', err)
        });
      },
      error: err => console.error('Error al cargar horarios asignados', err)
    });
  }

  generarInasistencias(): void {
  const textoFiltro = this.filtroNombre.trim().toLowerCase();
  const desdeFiltro = this.fechaInicio ? new Date(this.fechaInicio).setHours(0, 0, 0, 0) : null;
  const hastaFiltro = this.fechaFin ? new Date(this.fechaFin).setHours(23, 59, 59, 999) : null;
  const hoy = new Date();

  const ausentes: any[] = [];

  this.horariosAsignados.forEach(horario => {
    const fechaInicio = new Date(horario.fechaInicio);
    const fechaFin = horario.fechaFin ? new Date(horario.fechaFin) : fechaInicio;
    const usuario = horario.usuario;

    const nombreCompleto = `${usuario?.nombre || ''} ${usuario?.apellido || ''}`.toLowerCase();
    const dniUsuario = usuario?.dni?.toLowerCase() || '';

    if (textoFiltro && !nombreCompleto.includes(textoFiltro) && !dniUsuario.includes(textoFiltro)) return;

    const fechaDesde = desdeFiltro || fechaInicio;
    const fechaHasta = hastaFiltro || fechaFin;

    for (
      let f = new Date(fechaDesde);
      f <= fechaHasta;
      f.setDate(f.getDate() + 1)
    ) {
      const fechaTexto = f.toISOString().split('T')[0];

      if (f < fechaInicio || f > fechaFin) continue;
      if (f > hoy) continue; // 🚫 evita considerar días futuros

      const huboAsistencia = this.datosOriginales.some(r =>
        r.usuario?.id === usuario?.id && r.fechaHora.startsWith(fechaTexto)
      );

      if (!huboAsistencia) {
        ausentes.push({
          nombre: `${usuario?.nombre || ''} ${usuario?.apellido || ''}`,
          dni: usuario?.dni || '—',
          centro: usuario?.ctlc || '—',
          fecha: fechaTexto
        });
      }
    }
  });

  this.dataSourceResumen.data = ausentes;
}


  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.generarInasistencias();
  }

  exportarExcel(): void {
  const exportData = this.dataSourceResumen.filteredData.map(row => ({
    Nombre: row.nombre,
    DNI: row.dni,
    Área: row.centro,
    Fecha: row.fecha
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inasistencias');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  FileSaver.saveAs(blob, `Inasistencias_${new Date().toISOString().slice(0,10)}.xlsx`);
}

mostrarFiltrosConSwal(): void {
  Swal.fire({
    title: '<strong style="font-size: 18px;">Filtros de inasistencia</strong>',
    html: `
      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px; padding-top: 8px;">
        <input id="nombreInput" class="swal2-input" placeholder="Nombre o DNI" value="${this.filtroNombre}" style="height: 32px; font-size: 13px;">

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

      const fechaInicioStr = (document.getElementById('fechaInicioInput') as HTMLInputElement).value;
      const fechaFinStr = (document.getElementById('fechaFinInput') as HTMLInputElement).value;

      this.fechaInicio = fechaInicioStr ? new Date(fechaInicioStr) : null;
      this.fechaFin = fechaFinStr ? new Date(fechaFinStr) : null;

      this.generarInasistencias(); // Lógica personalizada del componente
    }
  }).then(result => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      this.limpiarFiltros();
    }
  });
}


  
}
