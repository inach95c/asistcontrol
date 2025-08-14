

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

//import { Horario } from '../../../models/horario';
import { HorarioService } from '../../../services/horario.service';
import { Horario } from '../../../models/horario';


import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';



@Component({
  selector: 'empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit, AfterViewInit {
  columnasResumen: string[] = [
    'usuario',
    'dni',
    'centro',
    'puesto',
    'fechaDeContrato',
    'horario',
    'acciones'
  ];
  dataSourceResumen = new MatTableDataSource<any>([]);
  datosOriginales: any[] = [];
  horariosAsignados: Horario[] = [];

  filtroNombre: string = '';
  filtroCentro: string = '';
  centrosDisponibles: string[] = [];

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient, 
    private dialog: MatDialog,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.cargarTodas();
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
            this.aplicarFiltro(); // Aplica filtro con solo asistencias si falla la carga de horarios
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

    data.forEach(registro => {
      const fechaObj = new Date(registro.fechaHora);
      const fecha = fechaObj.toISOString().split('T')[0];

      const nombreCompleto = `${registro.usuario?.nombre || ''} ${registro.usuario?.apellido || ''}`.toLowerCase();
      const dniUsuario = registro.usuario?.dni?.toLowerCase() || '';

      if (textoFiltro && !nombreCompleto.includes(textoFiltro) && !dniUsuario.includes(textoFiltro)) return;
      if (centro && registro.usuario?.ctlc !== centro) return;
      if (desde && fechaObj.getTime() < desde) return;
      if (hasta && fechaObj.getTime() > hasta) return;

      const clave = `${registro.usuario?.id}_${fecha}`;
      const dni = registro.usuario?.dni || '—';
      const centroValue = registro.usuario?.ctlc || '—';

      if (!resumenMap.has(clave)) {
        const horarioAsignado = this.horariosAsignados.find(h =>
          h.usuario?.id === registro.usuario?.id &&
          new Date(h.fechaInicio) <= fechaObj &&
          (!h.fechaFin || fechaObj <= new Date(h.fechaFin))
        );

        let horarioTexto = '—';
        if (horarioAsignado) {
          const entrada = horarioAsignado.horaEntrada;
          const salida = horarioAsignado.horaSalida;
          horarioTexto = entrada && salida ? `${entrada} - ${salida}` : '—';
        }

       
        resumenMap.set(clave, {
          usuario: registro.usuario,
          fecha,
          dni,
          centro: centroValue,
          puesto: registro.usuario?.puesto || '—',
          fechaDeContrato: registro.usuario?.fechaDeContrato || '—',
          horario: horarioTexto
        });
      }
    });

    this.dataSourceResumen.data = Array.from(resumenMap.values());
  }

  editarAsistencia(asistencia: any): void {
    const fechaLocal = this.normalizarFechaLocal(asistencia.fecha);

    const dialogRef = this.dialog.open(DialogoAsistenciaComponent, {
      width: '400px',
      data: {
        usuario: asistencia.usuario,
        fecha: fechaLocal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarTodas();
    });
  }

  eliminarAsistencia(id: number): void {
    Swal.fire({
      title: '¿Eliminar horario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const url = `${baseUrl}/asistencia/${id}`;
        const headers = this.obtenerHeaders();

        this.http.delete(url, { headers }).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El horario ha sido eliminado correctamente.', 'success');
            this.cargarTodas();
          },
          error: () => {
            Swal.fire('Error', 'Hubo un problema al eliminar el horario.', 'error');
          }
        });
      }
    });
  }

  accionSeleccionada(opcion: string, fila: any): void {
    if (opcion === 'editar') {
      this.editarAsistencia(fila);
    }
  }

  eliminarUsuario(idUsuario: number): void {
  Swal.fire({
    title: '¿Eliminar usuario?',
    text: 'Se eliminará completamente este usuario y sus registros asociados.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      const url = `${baseUrl}/usuarios/${idUsuario}`; // 🔄 Asegúrate de que esta URL exista en tu API
      const headers = this.obtenerHeaders();

      this.http.delete(url, { headers }).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente.', 'success');
          this.cargarTodas();
        },
        error: () => {
          Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
        }
      });
    }
  });
}

exportarExcel(): void {
  const exportData = this.dataSourceResumen.filteredData.map(row => ({
    Nombre: `${row.usuario?.nombre || ''} ${row.usuario?.apellido || ''}`,
    DNI: row.dni,
    Centro: row.centro,
    Puesto: row.puesto,
    'Fecha de Contrato': row.fechaDeContrato,
    Horario: row.horario
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, `Empleados_${new Date().toISOString().slice(0,10)}.xlsx`);
}

  private normalizarFechaLocal(fecha: string): Date {
    const [y, m, d] = fecha.split('-').map(Number);
    return new Date(y, m - 1, d);
  }


 mostrarFiltrosConSwal(): void {
  Swal.fire({
    title: '<strong style="font-size: 18px;">Filtros de búsqueda</strong>',
    html: `
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px; max-width: 100%; padding-top: 5px;">
        <input id="nombreInput" class="swal2-input" placeholder="Nombre o DNI" value="${this.filtroNombre}" style="height: 32px; font-size: 13px;">

        <select id="centroSelect" class="swal2-select" style="height: 32px; font-size: 13px;">
          <option value="">Todos los centros</option>
          ${this.centrosDisponibles.map(c => 
            `<option value="${c}" ${this.filtroCentro === c ? 'selected' : ''}>${c}</option>`
          ).join('')}
        </select>

        <input id="fechaInicioInput" type="date" class="swal2-input" value="${this.fechaInicio ? this.fechaInicio.toISOString().slice(0,10) : ''}" style="height: 32px; font-size: 13px;">
        <input id="fechaFinInput" type="date" class="swal2-input" value="${this.fechaFin ? this.fechaFin.toISOString().slice(0,10) : ''}" style="height: 32px; font-size: 13px;">
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: 'Limpiar',
    confirmButtonText: 'Aplicar',
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
