import {
  Component, OnInit, Inject
} from '@angular/core';
import {
  FormBuilder, FormGroup, Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../../../services/user.service';
import { HorarioService } from '../../../services/horario.service';

@Component({
  selector: 'app-dialogo-usuario-multiple',
  templateUrl: './dialogo-usuario-multiple.component.html',
  styleUrls: ['./dialogo-usuario-multiple.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class DialogoAsignarHorarioComponent implements OnInit {
  horarioForm!: FormGroup;
  usuarios: { id: number; nombre: string; apellido: string; dni: string }[] = [];
  allSelected = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private horarioService: HorarioService,
    private dialogRef: MatDialogRef<DialogoAsignarHorarioComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarUsuarios();
  }

  initForm(): void {
    this.horarioForm = this.fb.group({
      horaEntrada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      fechaInicio: [''],
      fechaFin: [''],
      usuariosIds: [[], Validators.required],
      dividirPorDias: [false]
    });
  }

  cargarUsuarios(): void {
    this.userService.obtenerUsuarios().subscribe({
      next: (usuarios) => this.usuarios = usuarios,
      error: () => this.mostrarAlerta('Error al cargar usuarios', 'error')
    });
  }

  onSubmit(): void {
    if (!this.horarioForm.valid) {
      return this.mostrarAlerta('Formulario inválido. Completa todos los campos requeridos.', 'warning');
    }

    const {
      usuariosIds, horaEntrada, horaSalida, fechaInicio, fechaFin, dividirPorDias
    } = this.horarioForm.value;

    const horarioBase = { horaEntrada, horaSalida, fechaInicio, fechaFin };

    this.horarioService.asignarHorarioMultiple({
      usuariosIds,
      horario: horarioBase,
      dividirPorDias
    }).subscribe({
      next: () => {
        
        Swal.fire({
          title: '✅ Horarios asignados correctamente',
          icon: 'success',
          text: 'La asignación fue exitosa para todos los usuarios',
          confirmButtonText: 'Genial'
        });
        this.horarioForm.reset();
        this.allSelected = false;
      },
      error: (err) => {
        const errores: string[] = err.error;
        // poner asignado correctamente aqui el que va es el que esta comentado el de error
        
        Swal.fire({
         //title: '⛔ Error al asignar horarios',
         //title: '⚠️ Precaución',
         // icon: 'error',
          icon: 'warning',
          html: errores?.length
            ? '<ul style="text-align: left;">' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>'
           // : 'Ocurrió un error inesperado',
            : 'Asignación realizada', 
          confirmButtonText: 'Entendido',
          width: 500,
          customClass: {
            popup: 'swal2-border-radius'
          }
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
            error: () => this.mostrarAlerta(`Error al eliminar horarios del usuario ID ${id}`, 'error')
          });
        });
        this.mostrarAlerta('Horarios eliminados correctamente', 'success');
      }
    });
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
}
