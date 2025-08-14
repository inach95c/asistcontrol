

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ctlc: string;
  dni: string;
  direccion: string;
  puesto: string;
  fechaDeContrato: string;
  tarifaPorHora: number;
  tarifaHoraExtra: number;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  filtroNombre: string = '';
  filtroTelefono: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  centrosDisponibles: string[] = [];
  usuariosOriginales: Usuario[] = [];

  displayedColumns: string[] = [
    'id', 'username', 'nombre', 'apellido', 'email', 'telefono', 'ctlc', 'tarifaPorHora', 'tarifaHoraExtra', 'accion'
  ];
  dataSource = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchControl = new FormControl('');

  constructor(private userService: UserService, private snack: MatSnackBar) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.buscarUsuarios(value);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarUsuarios() {
    this.userService.obtenerUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuariosOriginales = [...data];
        this.dataSource.data = data.sort((a, b) => b.id - a.id);
        this.snack.open('Usuarios cargados correctamente', 'Cerrar', { duration: 3000 });
      },
      (error) => {
        this.snack.open('Error al cargar los usuarios. Intenta nuevamente.', 'Cerrar', { duration: 5000 });
      }
    );
  }

  buscarUsuarios(username: string) {
    if (username) {
      this.userService.buscarUsuarios(username).subscribe(data => {
        this.dataSource.data = data;
      });
    } else {
      this.cargarUsuarios();
    }
  }

  editarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '<span style="font-size:15px; font-weight:500;">✏️ Editar Usuario</span>',
      html: `
        <div class="swal-form-grid">
          <input id="username" class="swal2-input" placeholder="Usuario" value="${usuario.username}">
          <input id="nombre" class="swal2-input" placeholder="Nombre" value="${usuario.nombre}">
          <input id="apellido" class="swal2-input" placeholder="Apellido" value="${usuario.apellido}">
          <input id="dni" class="swal2-input" placeholder="DNI/Cédula" value="${usuario.dni}">
          <input id="email" class="swal2-input" placeholder="Email" value="${usuario.email}">
          <input id="telefono" class="swal2-input" placeholder="Teléfono" value="${usuario.telefono}">
          <input id="direccion" class="swal2-input" placeholder="Dirección" value="${usuario.direccion}">
          <input id="ctlc" class="swal2-input" placeholder="Área" value="${usuario.ctlc}">
          <input id="puesto" class="swal2-input" placeholder="Puesto" value="${usuario.puesto}">
          <input id="tarifaPorHora" class="swal2-input" placeholder="Tarifa por hora" value="${usuario.tarifaPorHora}">
          <input id="tarifaHoraExtra" class="swal2-input" placeholder="Tarifa por hora extra" value="${usuario.tarifaHoraExtra}">
          </div>
      `,
      width: 400,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal2-popup-mini-ajustada'
      },
      preConfirm: () => {
        return {
          id: usuario.id,
          username: (document.getElementById('username') as HTMLInputElement).value,
          nombre: (document.getElementById('nombre') as HTMLInputElement).value,
          apellido: (document.getElementById('apellido') as HTMLInputElement).value,
          dni: (document.getElementById('dni') as HTMLInputElement).value,
          email: (document.getElementById('email') as HTMLInputElement).value,
          telefono: (document.getElementById('telefono') as HTMLInputElement).value,
          direccion: (document.getElementById('direccion') as HTMLInputElement).value,
          ctlc: (document.getElementById('ctlc') as HTMLInputElement).value,
          puesto: (document.getElementById('puesto') as HTMLInputElement).value,
          tarifaPorHora: parseFloat((document.getElementById('tarifaPorHora') as HTMLInputElement).value),
          tarifaHoraExtra: parseFloat((document.getElementById('tarifaHoraExtra') as HTMLInputElement).value)        
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.actualizarUsuario(result.value).subscribe(() => {
          const index = this.dataSource.data.findIndex(u => u.id === usuario.id);
          if (index !== -1) {
            this.dataSource.data[index] = result.value;
            this.dataSource._updateChangeSubscription();
          }
          Swal.fire('✅ Actualizado', 'El usuario ha sido actualizado correctamente.', 'success');
        });
      }
    });
  }

  accionSeleccionada(opcion: string, usuario: any): void {
    if (opcion === 'editar') {
      this.editarUsuario(usuario);
    } else if (opcion === 'eliminar') {
      this.eliminarUsuario(usuario.id);
    }
  }

    eliminarUsuario(id: number) {
    const usuario = this.dataSource.data.find((u: Usuario) => u.id === id);
    if (usuario && (usuario.username === 'santod' || usuario.username === 'santodgc')) {
      Swal.fire('Acción no permitida', 'No se puede eliminar este usuario', 'warning');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.eliminarUsuario(id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(usuario => usuario.id !== id);
          Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        });
      }
    });
  }

  exportarExcel(): void {
    const exportData = this.dataSource.filteredData.map(usuario => ({
      ID: usuario.id,
      Usuario: usuario.username,
      Nombre: usuario.nombre,
      Apellido: usuario.apellido,
      Email: usuario.email,
      Teléfono: usuario.telefono,
      Área: usuario.ctlc,
      Tarifa: usuario.tarifaPorHora
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `Usuarios_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  aplicarFiltro(): void {
    const nombreFiltro = this.filtroNombre.trim().toLowerCase();
    const telefonoFiltro = this.filtroTelefono.trim().replace(/\D/g, '');
    const desde = this.fechaInicio ? new Date(this.fechaInicio).getTime() : null;
    const hasta = this.fechaFin ? new Date(this.fechaFin).getTime() : null;

    this.dataSource.data = this.usuariosOriginales.filter(usuario => {
      const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
      const coincideNombre =
        nombreCompleto.includes(nombreFiltro) ||
        usuario.username.toLowerCase().includes(nombreFiltro);

      const telefonoUsuario = (usuario.telefono || '').replace(/\D/g, '');
      const coincideTelefono = telefonoFiltro ? telefonoUsuario.includes(telefonoFiltro) : true;

      const fechaContrato = usuario.fechaDeContrato ? new Date(usuario.fechaDeContrato).getTime() : null;
      const dentroDeFechas =
        (!desde || (fechaContrato && fechaContrato >= desde)) &&
        (!hasta || (fechaContrato && fechaContrato <= hasta));

      return coincideNombre && coincideTelefono && dentroDeFechas;
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroTelefono = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.cargarUsuarios();
  }

  mostrarFiltrosUsuariosSwal(): void {
    Swal.fire({
      title: '<span style="font-size: 15px;">Filtros</span>',
      html: `
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
          <input id="nombreInput" class="swal2-input" placeholder="Nombre/DNI" value="${this.filtroNombre}" 
                 style="height: 28px; font-size: 12px; padding: 4px;">
          <input id="telefonoInput" class="swal2-input" placeholder="Teléfono" value="${this.filtroTelefono}" 
                 style="height: 28px; font-size: 12px; padding: 4px;">
          <input id="fechaInicioInput" type="date" class="swal2-input" 
                 value="${this.fechaInicio ? this.fechaInicio.toISOString().slice(0,10) : ''}" 
                 style="height: 28px; font-size: 12px; padding: 4px;">
          <input id="fechaFinInput" type="date" class="swal2-input" 
                 value="${this.fechaFin ? this.fechaFin.toISOString().slice(0,10) : ''}" 
                 style="height: 28px; font-size: 12px; padding: 4px;">
        </div>
      `,
      width: 280,
      confirmButtonText: 'Aplicar',
      cancelButtonText: 'Limpiar',
      showCancelButton: true,
      focusConfirm: false,
      customClass: { popup: 'swal2-popup-mini-ajustada' },
      preConfirm: () => {
        this.filtroNombre = (document.getElementById('nombreInput') as HTMLInputElement).value;
        this.filtroTelefono = (document.getElementById('telefonoInput') as HTMLInputElement).value;

        const fi = (document.getElementById('fechaInicioInput') as HTMLInputElement).value;
        const ff = (document.getElementById('fechaFinInput') as HTMLInputElement).value;
        this.fechaInicio = fi ? new Date(fi) : null;
        this.fechaFin = ff ? new Date(ff) : null;

        this.aplicarFiltro();
      }
    }).then(result => {
      if (result.dismiss === Swal.DismissReason.cancel) this.limpiarFiltros();
    });
  }
}
