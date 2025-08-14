/*import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import baseUrl from '../../../services/helper';



@Component({
  selector: 'app-asistencia-admin',
  templateUrl: './asistencia-admin.component.html',
  styleUrls: ['./asistencia-admin.component.css']
})
export class AsistenciaAdminComponent implements OnInit, AfterViewInit {
  columnasResumen: string[] = [
    'usuario',
    'dni',
    'telefono',
    'email',
    'centro',
    'fecha',
    'entrada',
    'salida',
    'horasTrabajadas',
    
  ];
  dataSourceResumen = new MatTableDataSource<any>([]);
  datosOriginales: any[] = [];

  filtroNombre: string = '';
  filtroTipo: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {}

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
        case 'entrada':
          return item.entrada ? new Date(item.entrada) : null;
        case 'salida':
          return item.salida ? new Date(item.salida) : null;
        case 'horasTrabajadas': {
          const match = item.horasTrabajadas?.match(/(\d+)h\s*(\d+)?m?/);
          const h = match ? parseInt(match[1], 10) : 0;
          const m = match && match[2] ? parseInt(match[2], 10) : 0;
          return h * 60 + m;
        }
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
        this.aplicarFiltro();
      },
      error: err => console.error('Error al cargar asistencias', err)
    });
  }

  aplicarFiltro(): void {
    this.filtrarYCombinar(this.datosOriginales);
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroTipo = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.aplicarFiltro();
  }

  filtrarYCombinar(data: any[]): void {
    const nombre = this.filtroNombre.trim().toLowerCase();
    const tipo = this.filtroTipo;
    const desde = this.fechaInicio ? new Date(this.fechaInicio).setHours(0, 0, 0, 0) : null;
    const hasta = this.fechaFin ? new Date(this.fechaFin).setHours(23, 59, 59, 999) : null;

    const filtrados = data.filter(registro => {
      const nombreCompleto = `${registro.usuario?.nombre || ''} ${registro.usuario?.apellido || ''}`.toLowerCase();
      const tipoDato = registro.tipo || '';
      const fechaMs = new Date(registro.fechaHora).getTime();

      return (
        nombreCompleto.includes(nombre) &&
        (!tipo || tipoDato === tipo) &&
        (!desde || fechaMs >= desde) &&
        (!hasta || fechaMs <= hasta)
      );
    });

    const resumenMap = new Map<string, any>();

    filtrados.forEach(registro => {
      const fechaObj = new Date(registro.fechaHora);
      const fecha = fechaObj.toISOString().split('T')[0];
      const usuario = `${registro.usuario?.nombre} ${registro.usuario?.apellido}`;
      const dni = registro.usuario?.dni || '—';
      const telefono = registro.usuario?.telefono || '—';
      const email = registro.usuario?.email || '—';
      const centro = registro.usuario?.ctlc || '—';
      const clave = `${usuario}_${fecha}`;

      if (!resumenMap.has(clave)) {
        resumenMap.set(clave, {
          usuario,
          dni,
          telefono,
          email,
          centro,
          fecha,
          entrada: undefined,
          salida: undefined,
          horasTrabajadas: undefined
        });
      }

      const item = resumenMap.get(clave);
      const hora = fechaObj;

      if (registro.tipo === 'ENTRADA') {
        if (!item.entrada || hora < item.entrada) item.entrada = hora;
      } else if (registro.tipo === 'SALIDA') {
        if (!item.salida || hora > item.salida) item.salida = hora;
      }

      if (item.entrada && item.salida) {
        const diff = item.salida.getTime() - item.entrada.getTime();
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff / (1000 * 60)) % 60);
        item.horasTrabajadas = `${horas}h ${minutos}m`;
      }
    });

    this.dataSourceResumen.data = Array.from(resumenMap.values());
  }
}
*/


/*

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import baseUrl from '../../../services/helper';

import { MatDialog } from '@angular/material/dialog';
import { DialogoAsistenciaComponent } from '../dialogo-asistencia/dialogo-asistencia.component';

@Component({
  selector: 'app-asistencia-admin',
  templateUrl: './asistencia-admin.component.html',
  styleUrls: ['./asistencia-admin.component.css']
})
export class AsistenciaAdminComponent implements OnInit, AfterViewInit {
  columnasResumen: string[] = [
    'usuario',
    'dni',
    'telefono',
    'email',
    'centro',
    'fecha',
    'entrada',
    'salida',
    'horasTrabajadas',
    'horasExtras',
    'acciones' 
  ];
  dataSourceResumen = new MatTableDataSource<any>([]);
  datosOriginales: any[] = [];

  filtroNombre: string = '';
  filtroTipo: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient,
    private dialog: MatDialog
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
          case 'entrada':
            return item.entrada ? new Date(item.entrada) : null;
          case 'salida':
            return item.salida ? new Date(item.salida) : null;
          case 'horasTrabajadas': {
            const match = item.horasTrabajadas?.match(/(\d+)h\s*(\d+)?m?/);
            const h = match ? parseInt(match[1], 10) : 0;
            const m = match && match[2] ? parseInt(match[2], 10) : 0;
            return h * 60 + m;
          }
          case 'horasExtras': {
            const match = item.horasExtras?.match(/(\d+)h\s*(\d+)?m?/);
            const h = match ? parseInt(match[1], 10) : 0;
            const m = match && match[2] ? parseInt(match[2], 10) : 0;
            return h * 60 + m;
          }
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
        this.aplicarFiltro();
      },
      error: err => console.error('Error al cargar asistencias', err)
    });
  }

  aplicarFiltro(): void {
    this.filtrarYCombinar(this.datosOriginales);
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroTipo = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.aplicarFiltro();
  }

  filtrarYCombinar(data: any[]): void {
    const nombre = this.filtroNombre.trim().toLowerCase();
    const tipo = this.filtroTipo;
    const desde = this.fechaInicio ? new Date(this.fechaInicio).setHours(0, 0, 0, 0) : null;
    const hasta = this.fechaFin ? new Date(this.fechaFin).setHours(23, 59, 59, 999) : null;

    const resumenMap = new Map<string, any>();

    data.forEach(registro => {
      const fechaObj = new Date(registro.fechaHora);
      const fecha = fechaObj.toISOString().split('T')[0];
      const usuario = `${registro.usuario?.nombre} ${registro.usuario?.apellido}`;
      const dni = registro.usuario?.dni || '—';
      const telefono = registro.usuario?.telefono || '—';
      const email = registro.usuario?.email || '—';
      const centro = registro.usuario?.ctlc || '—';
      const clave = `${usuario}_${fecha}`;

      if (!resumenMap.has(clave)) {
        resumenMap.set(clave, {
         usuario: registro.usuario,
          dni,
          telefono,
          email,
          centro,
          fecha,
          entrada: undefined,
          salida: undefined,
          horasTrabajadas: undefined,
          horasExtras: undefined
        });
      }

      const item = resumenMap.get(clave);
      const hora = fechaObj;

      if (registro.tipo === 'ENTRADA') {
        if (!item.entrada || hora < item.entrada) item.entrada = hora;
      } else if (registro.tipo === 'SALIDA') {
        if (!item.salida || hora > item.salida) item.salida = hora;
      }

      if (item.entrada && item.salida) {
        const diff = item.salida.getTime() - item.entrada.getTime();
        const horas = Math.floor(diff / (1000 * 60 * 60));
        const minutos = Math.floor((diff / (1000 * 60)) % 60);
        item.horasTrabajadas = `${horas}h ${minutos}m`;

        const totalHoras = diff / (1000 * 60 * 60);
        const extra = totalHoras > 8 ? totalHoras - 8 : 0;

        if (extra > 0) {
          const extraH = Math.floor(extra);
          const extraM = Math.round((extra - extraH) * 60);
          item.horasExtras = `${extraH}h ${extraM}m`;
        } else {
          item.horasExtras = '—';
        }
      }
    });

    this.dataSourceResumen.data = Array.from(resumenMap.values());
  }

 editarAsistencia(asistencia: any): void {
  const dialogRef = this.dialog.open(DialogoAsistenciaComponent, {
    width: '400px',
    data: { ...asistencia } // pasás los datos al diálogo
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Acá podés aplicar la lógica para actualizar los datos
      console.log('✅ Asistencia editada:', result);
      // Ejemplo: podés hacer un patch o recargar la tabla
      // this.cargarTodas(); o actualizar this.dataSourceResumen.data manualmente
    }
  });
}



}
*/

/*
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import baseUrl from '../../../services/helper';

import { MatDialog } from '@angular/material/dialog';
import { DialogoAsistenciaComponent } from '../dialogo-asistencia/dialogo-asistencia.component';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-asistencia-admin',
  templateUrl: './asistencia-admin.component.html',
  styleUrls: ['./asistencia-admin.component.css']
})
export class AsistenciaAdminComponent implements OnInit, AfterViewInit {
  columnasResumen: string[] = [
    'usuario',
    'dni',
    'telefono',
    'email',
    'centro',
    'fecha',
    'entrada',
    'salida',
    'horasTrabajadas',
    'horasExtras',
    'acciones'
  ];
  dataSourceResumen = new MatTableDataSource<any>([]);
  datosOriginales: any[] = [];

  filtroNombre: string = '';
  filtroTipo: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

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
          case 'entrada':
            return item.entrada ? new Date(item.entrada) : null;
          case 'salida':
            return item.salida ? new Date(item.salida) : null;
          case 'horasTrabajadas': {
            const match = item.horasTrabajadas?.match(/(\d+)h\s*(\d+)?m?/);
            const h = match ? parseInt(match[1], 10) : 0;
            const m = match && match[2] ? parseInt(match[2], 10) : 0;
            return h * 60 + m;
          }
          case 'horasExtras': {
            const match = item.horasExtras?.match(/(\d+)h\s*(\d+)?m?/);
            const h = match ? parseInt(match[1], 10) : 0;
            const m = match && match[2] ? parseInt(match[2], 10) : 0;
            return h * 60 + m;
          }
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
        this.aplicarFiltro();
      },
      error: err => console.error('Error al cargar asistencias', err)
    });
  }

  aplicarFiltro(): void {
    this.filtrarYCombinar(this.datosOriginales);
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroTipo = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.aplicarFiltro();
  }

  filtrarYCombinar(data: any[]): void {
  const textoFiltro = this.filtroNombre.trim().toLowerCase();
  const tipo = this.filtroTipo;
  const desde = this.fechaInicio ? new Date(this.fechaInicio).setHours(0, 0, 0, 0) : null;
  const hasta = this.fechaFin ? new Date(this.fechaFin).setHours(23, 59, 59, 999) : null;

  const resumenMap = new Map<string, any>();

  data.forEach(registro => {
    const fechaObj = new Date(registro.fechaHora);
    const fecha = fechaObj.toISOString().split('T')[0];

    const nombreCompleto = `${registro.usuario?.nombre || ''} ${registro.usuario?.apellido || ''}`.toLowerCase();
    const dniUsuario = registro.usuario?.dni?.toLowerCase() || '';

    if (
      textoFiltro &&
      !nombreCompleto.includes(textoFiltro) &&
      !dniUsuario.includes(textoFiltro)
    ) return;

    if (tipo && registro.tipo !== tipo) return;
    if (desde && fechaObj.getTime() < desde) return;
    if (hasta && fechaObj.getTime() > hasta) return;

    const clave = `${registro.usuario?.id}_${fecha}`;
    const dni = registro.usuario?.dni || '—';
    const telefono = registro.usuario?.telefono || '—';
    const email = registro.usuario?.email || '—';
    const centro = registro.usuario?.ctlc || '—';

    if (!resumenMap.has(clave)) {
      resumenMap.set(clave, {
        usuario: registro.usuario,
        fecha,
        dni,
        telefono,
        email,
        centro,
        entrada: undefined,
        salida: undefined,
        idEntrada: undefined,
        idSalida: undefined,
        horasTrabajadas: undefined,
        horasExtras: undefined
      });
    }

    const item = resumenMap.get(clave);
    const hora = fechaObj;

    if (registro.tipo === 'ENTRADA') {
      if (!item.entrada || hora < item.entrada) {
        item.entrada = hora;
        item.idEntrada = registro.id;
      }
    } else if (registro.tipo === 'SALIDA') {
      if (!item.salida || hora > item.salida) {
        item.salida = hora;
        item.idSalida = registro.id;
      }
    }

    if (item.entrada && item.salida) {
      const diff = item.salida.getTime() - item.entrada.getTime();
      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff / (1000 * 60)) % 60);
      item.horasTrabajadas = `${horas}h ${minutos}m`;

      const totalHoras = diff / (1000 * 60 * 60);
      const extra = totalHoras > 8 ? totalHoras - 8 : 0;

      if (extra > 0) {
        const extraH = Math.floor(extra);
        const extraM = Math.round((extra - extraH) * 60);
        item.horasExtras = `${extraH}h ${extraM}m`;
      } else {
        item.horasExtras = '—';
      }
    }
  });

  this.dataSourceResumen.data = Array.from(resumenMap.values());
  console.log('📋 Data para la tabla resumen:', Array.from(resumenMap.values()));

}

  editarAsistencia(asistencia: any): void {
  console.log('🧾 Editando:', asistencia); // 👈 acá

  const dialogRef = this.dialog.open(DialogoAsistenciaComponent, {
    width: '400px',
    data: {
      usuario: asistencia.usuario,
      fecha: asistencia.fecha,
      entrada: asistencia.entrada,
      salida: asistencia.salida,
      idEntrada: asistencia.idEntrada,
      idSalida: asistencia.idSalida
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
  switch (opcion) {
    case 'editar':
      this.editarAsistencia(fila);
      break;
    case 'eliminarEntrada':
      this.eliminarAsistencia(fila.idEntrada);
      break;
    case 'eliminarSalida':
      this.eliminarAsistencia(fila.idSalida);
      break;
  }
}


}
*/

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
import { HorarioAsignado } from '../../../models/HorarioAsignado';


@Component({
  selector: 'app-asistencia-admin',
  templateUrl: './asistencia-admin.component.html',
  styleUrls: ['./asistencia-admin.component.css']
})
export class AsistenciaAdminComponent implements OnInit, AfterViewInit {
  columnasResumen: string[] = [
    'usuario',
    'dni',
    'centro',
    'fecha',
    'entrada',
    'salida',
    'horasExtras',
    'estado',
    'acciones'
  ];
  dataSourceResumen = new MatTableDataSource<any>([]);
  datosOriginales: any[] = [];
  horariosAsignados: Horario[] = [];

  filtroNombre: string = '';
  filtroTipo: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  toleranciaEntradaMinutos: number = 0;
  toleranciaSalidaMinutos: number = 0;


  //columnas: string[] = ['fechaHora', 'tipo', 'estado'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    this.cargarTodas();
    this.horarioService.obtenerTolerancia().subscribe({
      next: config => {
        this.toleranciaEntradaMinutos = config.toleranciaEntrada;
        this.toleranciaSalidaMinutos = config.toleranciaSalida;
      },
      error: err => console.error('Error cargando tolerancia', err)
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
          case 'entrada':
            return item.entrada ? new Date(item.entrada) : null;
          case 'salida':
            return item.salida ? new Date(item.salida) : null;
          case 'horasExtras': {
            const match = item.horasExtras?.match(/(\d+)h\s*(\d+)?m?/);
            const h = match ? parseInt(match[1], 10) : 0;
            const m = match && match[2] ? parseInt(match[2], 10) : 0;
            return h * 60 + m;
          }
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
    this.filtroTipo = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.aplicarFiltro();
  }

  
  filtrarYCombinar(data: any[]): void {
  const textoFiltro = this.filtroNombre.trim().toLowerCase();
  const tipo = this.filtroTipo;
  const desde = this.fechaInicio ? new Date(this.fechaInicio).setHours(0, 0, 0, 0) : null;
  const hasta = this.fechaFin ? new Date(this.fechaFin).setHours(23, 59, 59, 999) : null;

  const resumenMap = new Map<string, any>();

  data.forEach(registro => {
    const fechaTexto = registro.fechaHora.split('T')[0];
    const fechaObj = this.normalizarFechaLocal(fechaTexto);

    const nombreCompleto = `${registro.usuario?.nombre || ''} ${registro.usuario?.apellido || ''}`.toLowerCase();
    const dniUsuario = registro.usuario?.dni?.toLowerCase() || '';

    if (textoFiltro && !nombreCompleto.includes(textoFiltro) && !dniUsuario.includes(textoFiltro)) return;
    if (tipo && registro.tipo !== tipo) return;
    if (desde && fechaObj.getTime() < desde) return;
    if (hasta && fechaObj.getTime() > hasta) return;

    const clave = `${registro.usuario?.id}_${fechaTexto}`;
    const dni = registro.usuario?.dni || '—';
    const centro = registro.usuario?.ctlc || '—';

    if (!resumenMap.has(clave)) {
      resumenMap.set(clave, {
        usuario: registro.usuario,
        fecha: fechaTexto,
        dni,
        centro,
        entrada: undefined,
        salida: undefined,
        idEntrada: undefined,
        idSalida: undefined,
        horasExtras: undefined,
        estado: '—',
        estadoSalida: '—'
      });
    }

    const item = resumenMap.get(clave);
    const hora = new Date(registro.fechaHora);

    if (registro.tipo === 'ENTRADA') {
      if (!item.entrada || hora < item.entrada) {
        item.entrada = hora;
        item.idEntrada = registro.id;
      }
    } else if (registro.tipo === 'SALIDA') {
      if (!item.salida || hora > item.salida) {
        item.salida = hora;
        item.idSalida = registro.id;
      }
    }

    if (item.entrada && item.salida) {
      if (item.salida < item.entrada) {
        item.salida.setDate(item.salida.getDate() + 1);
      }

      const diff = item.salida.getTime() - item.entrada.getTime();
      const totalHoras = diff / (1000 * 60 * 60);

      if (totalHoras >= 0.5) {
      const horariosDelDia = this.horariosAsignados.filter(h =>
  h.usuario?.id === registro.usuario?.id &&
  this.fechaDentroDelRango(h.fechaInicio, h.fechaFin, fechaObj)
);

let jornadaAsignada = 8; // valor por defecto

if (horariosDelDia.length > 0 && horariosDelDia[0].horaEntrada && horariosDelDia[0].horaSalida) {
  const [hInicio, mInicio] = horariosDelDia[0].horaEntrada.split(':').map(Number);
  const [hFin, mFin] = horariosDelDia[0].horaSalida.split(':').map(Number);

  const inicio = new Date(1970, 0, 1, hInicio, mInicio);
  const fin = new Date(1970, 0, 1, hFin, mFin);

  if (fin < inicio) fin.setDate(fin.getDate() + 1);

  jornadaAsignada = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
}

const extra = totalHoras > jornadaAsignada ? totalHoras - jornadaAsignada : 0;





        if (extra > 0) {
          const extraH = Math.floor(extra);
          const extraM = Math.round((extra - extraH) * 60);
          //item.horasExtras = `${extraH}h ${extraM}m`;
          item.horasExtras = `${extraH.toString().padStart(2, '0')}h ${extraM.toString().padStart(2, '0')}m`;

        } else {
          item.horasExtras = '—';
        }
      } else {
        item.horasExtras = '—';
      }
    }

    const horariosDelDia = this.horariosAsignados.filter(h =>
  h.usuario?.id === registro.usuario?.id &&
  this.fechaDentroDelRango(h.fechaInicio, h.fechaFin, fechaObj)
);

if (item.entrada) {
  item.estado = this.evaluarEstadoConMultiplesHorarios(item.entrada, horariosDelDia, this.toleranciaEntradaMinutos);
} else {
  item.estado = 'Sin registro';
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
        fecha: fechaLocal,
        entrada: asistencia.entrada,
        salida: asistencia.salida,
        idEntrada: asistencia.idEntrada,
        idSalida: asistencia.idSalida
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
    switch (opcion) {
      case 'editar':
        this.editarAsistencia(fila);
        break;
      case 'eliminarEntrada':
        this.eliminarAsistencia(fila.idEntrada);
        break;
      case 'eliminarSalida':
        this.eliminarAsistencia(fila.idSalida);
        break;
    }
  }

  exportarExcel(): void {
  const exportData = this.dataSourceResumen.filteredData.map(row => ({
    Nombre: `${row.usuario?.nombre || ''} ${row.usuario?.apellido || ''}`,
    DNI: row.dni,
    Centro: row.centro,
    Fecha: row.fecha,
    Entrada: row.entrada ? new Date(row.entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    Salida: row.salida ? new Date(row.salida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    'Horas Extras': row.horasExtras || '—',
    Estado: row.estado || '—'
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencias');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, `Asistencias_${new Date().toISOString().slice(0,10)}.xlsx`);
}


  private normalizarFechaLocal(fecha: string): Date {
    const [y, m, d] = fecha.split('-').map(Number);
    return new Date(y, m - 1, d);
  }


  mostrarFiltrosConSwal(): void {
  Swal.fire({
    title: '<strong style="font-size: 18px;">Filtros de búsqueda</strong>',
    html: `
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px; padding-top: 5px;">
        <input id="nombreInput" class="swal2-input" placeholder="Nombre o DNI" value="${this.filtroNombre}" style="height: 32px; font-size: 13px;">

        <select id="tipoSelect" class="swal2-select" style="height: 32px; font-size: 13px;">
          <option value="">Todos los tipos</option>
          <option value="ENTRADA" ${this.filtroTipo === 'ENTRADA' ? 'selected' : ''}>ENTRADA</option>
          <option value="SALIDA" ${this.filtroTipo === 'SALIDA' ? 'selected' : ''}>SALIDA</option>
        </select>

        <input id="fechaInicioInput" type="date" class="swal2-input" value="${this.fechaInicio ? this.fechaInicio.toISOString().slice(0,10) : ''}" style="height: 32px; font-size: 13px;">
        <input id="fechaFinInput" type="date" class="swal2-input" value="${this.fechaFin ? this.fechaFin.toISOString().slice(0,10) : ''}" style="height: 32px; font-size: 13px;">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Aplicar filtros',
    cancelButtonText: 'Limpiar',
    customClass: {
      popup: 'swal2-popup-filtros-mini'
    },
    preConfirm: () => {
      this.filtroNombre = (document.getElementById('nombreInput') as HTMLInputElement).value;
      this.filtroTipo = (document.getElementById('tipoSelect') as HTMLSelectElement).value;

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


private convertirFechaLocal(fecha: Date | string): Date {
  const f = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return new Date(f.getFullYear(), f.getMonth(), f.getDate(), 12); // Mediodía local para evitar desfases
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


esExtraAlta(horasExtras: string): boolean {
  const match = horasExtras?.match(/(\d+)h\s*(\d+)?m?/);
  const h = match ? parseInt(match[1], 10) : 0;
  return h >= 2;
}





}
