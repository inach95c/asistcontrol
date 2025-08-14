import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { UserService } from 'src/app/services/user.service';
//import { HorarioService } from 'src/app/services/horario.service';
//import { Horario } from 'src/app/models/horario';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DialogoEditarHorarioComponent } from '../dialogo-editar-horario/dialogo-editar-horario.component';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DialogoAsignarHorarioComponent } from '../dialogo-usuario-multiple/dialogo-usuario-multiple.component';
//import { Horario } from '../../../models/horario';
import { UserService } from '../../../services/user.service';
import { HorarioService } from '../../../services/horario.service';
import { Horario } from '../../../models/horario';
//import { firstValueFrom } from 'rxjs'; // 👈 recuerda incluir esta línea arriba


@Component({
  selector: 'app-asignar-horarios',
  templateUrl: './asignar-horarios.component.html',
  styleUrls: ['./asignar-horarios.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AsignarHorarioComponent implements OnInit, AfterViewInit {
  horarioForm: FormGroup;
  usuarios: { id: number, nombre: string, apellido: string, dni: string }[] = [];
  dataSource = new MatTableDataSource<Horario>();
  displayedColumns: string[] = ['usuario', 'horaEntrada', 'horaSalida', 'fechaInicio', 'fechaFin', 'acciones'];
  allSelected = false;
  isExpanded = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.horarioForm = this.fb.group({
      horaEntrada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      fechaInicio: [''],
      fechaFin: [''],
      usuariosIds: [[], Validators.required],
      dividirPorDias: [false]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarHorarios();
    this.dataSource.filterPredicate = (data: Horario, filter: string): boolean => {
      const nombre = data.usuario?.nombre || '';
      const apellido = data.usuario?.apellido || '';
      return `${nombre} ${apellido}`.toLowerCase().includes(filter);
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  cargarUsuarios(): void {
    this.userService.obtenerUsuarios().subscribe({
      next: (usuarios) => this.usuarios = usuarios,
      error: () => this.mostrarAlerta('Error al cargar usuarios', 'error')
    });
  }

  cargarHorarios(): void {
    this.horarioService.obtenerTodosLosHorarios().subscribe({
      next: (horarios) => this.dataSource.data = horarios,
      error: () => this.mostrarAlerta('Error al cargar horarios', 'error')
    });
  }

  onSubmit(): void {
    if (!this.horarioForm.valid) {
      return this.mostrarAlerta('Formulario inválido. Completa todos los campos requeridos.', 'warning');
    }
    this.validarHorariosAntesDeAsignar(); // 🔍 Validación antes de guardar
  }

  private convertirHora(hora: string): number {
    const [hh, mm] = hora.split(':').map(Number);
    return hh * 60 + mm;
  }


    private convertirFecha(fecha: string | null | undefined): number {
  if (!fecha || fecha.trim() === '') return Infinity;
  const f = new Date(fecha);
  return isNaN(f.getTime()) ? Infinity : f.getTime();
}



  /*  private hayConflicto(nuevo: Horario, existente: Horario): boolean {
  const entradaN = this.convertirHora(nuevo.horaEntrada);
  const salidaN = this.convertirHora(nuevo.horaSalida);
 // const inicioN = this.convertirFecha(nuevo.fechaInicio);
  //const finN = this.convertirFecha(nuevo.fechaFin);
  const inicioN = this.convertirFecha(nuevo.fechaInicio ?? '');
  const finN    = this.convertirFecha(nuevo.fechaFin ?? '');

  const entradaE = this.convertirHora(existente.horaEntrada);
  const salidaE = this.convertirHora(existente.horaSalida);
  //const inicioE = this.convertirFecha(existente.fechaInicio);
  //const finE = this.convertirFecha(existente.fechaFin);
   const inicioE = this.convertirFecha(existente.fechaInicio ?? '');
const finE    = this.convertirFecha(existente.fechaFin ?? '');



  // ✅ Verificamos si las fechas se cruzan
  const fechasCruzan = inicioN <= finE && finN >= inicioE;

  // ⛔ Solo si las fechas se cruzan, comparamos las horas
  if (!fechasCruzan) return false;

  // ✅ Verificamos si las horas se solapan
  const horasCruzan = entradaN < salidaE && salidaN > entradaE;

  return horasCruzan;
}*/

private hayConflicto(nuevo: Horario, existente: Horario): { conflicto: boolean, advertencia?: string } {
  const entradaN = this.convertirHora(nuevo.horaEntrada);
  const salidaN = this.convertirHora(nuevo.horaSalida);
  const inicioN = this.convertirFecha(nuevo.fechaInicio ?? '');
  const finN = this.convertirFecha(nuevo.fechaFin ?? '');

  const entradaE = this.convertirHora(existente.horaEntrada);
  const salidaE = this.convertirHora(existente.horaSalida);
  const inicioE = this.convertirFecha(existente.fechaInicio ?? '');
  const finE = this.convertirFecha(existente.fechaFin ?? '');

  // ✅ Verificamos si las fechas se cruzan
  const fechasCruzan = inicioN <= finE && finN >= inicioE;
  if (!fechasCruzan) return { conflicto: false };

  // ✅ Verificamos si las horas se solapan
  const horasCruzan = entradaN < salidaE && salidaN > entradaE;
  if (horasCruzan) return { conflicto: true };

  // ✅ Verificamos si el horario es idéntico
  const mismoHorario = entradaN === entradaE && salidaN === salidaE && inicioN === inicioE && finN === finE;
  if (mismoHorario) return { conflicto: true };

  // ⚠️ Advertencia si hay otro turno en el mismo día sin solapamiento
  const mismoDia = new Date(existente.fechaInicio).toDateString() === new Date(nuevo.fechaInicio ?? '').toDateString();
  if (mismoDia) {
    return {
      conflicto: false,
      advertencia: 'Ya tiene otro turno asignado ese día (sin solapamiento).'
    };
  }

  return { conflicto: false };
}




private async validarHorariosAntesDeAsignar(): Promise<void> {
  const {
    usuariosIds,
    horaEntrada,
    horaSalida,
    fechaInicio,
    fechaFin
  } = this.horarioForm.value;

  const horarioNuevo: Horario = {
  horaEntrada,
  horaSalida,
  fechaInicio,
  fechaFin,
  toleranciaEntrada: 5,
  toleranciaSalida: 5,
  esConfiguracion: false
};

  const conflictos: string[] = [];

  for (const id of usuariosIds) {
    const usuario = this.usuarios.find(u => u.id === id);
    const nombreUsuario = usuario
      ? `${usuario.nombre} ${usuario.apellido}`.trim()
      : `Usuario ID ${id}`;

    const horarios = await this.horarioService.obtenerHorariosPorUsuario(id).toPromise();

    horarios.forEach(hExistente => {
     /* if (this.hayConflicto(horarioNuevo, hExistente)) {
        conflictos.push(`${nombreUsuario}: El horario se solapa con otro existente.`);
      }*/
      const resultado = this.hayConflicto(horarioNuevo, hExistente);
      if (resultado.conflicto) {
        conflictos.push(`${nombreUsuario}: El horario se solapa o es idéntico a uno existente.`);
      } else if (resultado.advertencia) {
        conflictos.push(`${nombreUsuario}: ${resultado.advertencia}`);
      }

    });
  }

  if (conflictos.length) {
    Swal.fire({
      title: '🚫 Conflictos de horario',
      html: '<ul style="text-align:left;">' + conflictos.map(c => `<li>${c}</li>`).join('') + '</ul>',
      icon: 'error',
      confirmButtonText: 'Entendido',
      width: 500
    });
  } else {
    this.enviarAsignacion(); // ✅ Sin conflicto, procedemos
  }
}


    private enviarAsignacion(): void {
    const {
      usuariosIds,
      horaEntrada,
      horaSalida,
      fechaInicio,
      fechaFin,
      dividirPorDias
    } = this.horarioForm.value;

    const horarioBase = { horaEntrada, horaSalida, fechaInicio, fechaFin };

    this.horarioService.asignarHorarioMultiple({
      usuariosIds,
      horario: horarioBase,
      dividirPorDias
    }).subscribe({
      next: () => {
        this.mostrarAlerta('Horarios asignados correctamente', 'success');
        this.horarioForm.reset();
        this.allSelected = false;
        this.cargarHorarios();
      },
      error: (err) => {
        const errores: string[] = err.error;
        Swal.fire({
          title: '⛔ Error al asignar horarios',
          icon: 'error',
          html: errores?.length
            ? '<ul style="text-align: left;">' + errores.map(e => `<li>${e}</li>`).join('')
            : 'Ocurrió un error inesperado',
          confirmButtonText: 'Entendido',
          width: 500
        });
      }
    });
  }

  eliminarHorariosSeleccionados(): void {
    const ids = this.horarioForm.value.usuariosIds;
    if (!ids?.length) {
      return this.mostrarAlerta('Selecciona usuarios para eliminar', 'warning');
    }

    Swal.fire({
      title: '¿Eliminar horarios?',
      text: 'Se eliminarán todos los horarios de los usuarios seleccionados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        ids.forEach(id => {
          this.horarioService.eliminarTodosHorariosPorUsuario(id).subscribe({
            next: () => this.cargarHorarios(),
            error: () => this.mostrarAlerta(`Error al eliminar horarios del usuario ID ${id}`, 'error')
          });
        });
        this.mostrarAlerta('Horarios eliminados correctamente', 'success');
      }
    });
  }

  eliminarHorario(id: number): void {
    Swal.fire({
      title: '¿Eliminar horario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.horarioService.eliminarHorario(id).subscribe({
          next: () => {
            this.cargarHorarios();
            this.mostrarAlerta('Horario eliminado correctamente', 'success');
          },
          error: () => this.mostrarAlerta('Error al eliminar horario', 'error')
        });
      }
    });
  }

  abrirDialogoEditar(horario: Horario): void {
    const dialogRef = this.dialog.open(DialogoEditarHorarioComponent, {
      width: '400px',
      data: horario
    });

   

      dialogRef.afterClosed().subscribe((resultadoEditado: Horario | undefined) => {
  if (resultadoEditado && resultadoEditado.id != null) {
    this.horarioService.actualizarHorario(resultadoEditado.id, resultadoEditado).subscribe({
      next: () => {
        this.cargarHorarios();
        this.mostrarAlerta('Horario actualizado correctamente', 'success');
      },
      error: () => this.mostrarAlerta('Error al actualizar horario', 'error')
    });
  } else {
   // this.mostrarAlerta('Horario inválido o sin ID. No se puede actualizar.', 'warning');
  }
}

  );
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleTodos(): void {
    this.allSelected = !this.allSelected;
    const todosIds = this.allSelected ? this.usuarios.map(u => u.id) : [];
    this.horarioForm.get('usuariosIds')?.setValue(todosIds);
  }

  toggleSeleccionarTodos(event: any): void {
    const seleccionados: number[] = event.value;
    this.allSelected = seleccionados.length === this.usuarios.length;
  }

  private mostrarAlerta(titulo: string, icono: 'success' | 'error' | 'warning' | 'info'): void {
    Swal.fire({ title: titulo, icon: icono, confirmButtonText: 'OK' });
  }

  exportarExcel(): void {
    const exportData = this.dataSource.filteredData.map(row => ({
      Usuario: `${row.usuario?.nombre || ''} ${row.usuario?.apellido || ''}`,
      DNI: row.usuario?.dni || '—',
      Entrada: row.horaEntrada || '—',
      Salida: row.horaSalida || '—',
      'Fecha Inicio': row.fechaInicio || '—',
      'Fecha Fin': row.fechaFin || '—'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Horarios');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `Horarios_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  abrirDialogoAsignar(): void {
    const dialogRef = this.dialog.open(DialogoAsignarHorarioComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cargarHorarios();
    });
  }
}
