/*import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HorarioService } from '../../../services/horario.service';
//import { AuthService } from '../../../services/auth.service';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-configuracion-horario',
  templateUrl: './configuracion-horario.component.html',
  styleUrls: ['./configuracion-horario.component.css']
})
export class ConfiguracionHorarioComponent implements OnInit {
  toleranciaEntrada: number = 30;
  toleranciaSalida: number = 0;
  esAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private horarioService: HorarioService
  ) {}

  ngOnInit(): void {
    const rol = this.authService.obtenerRol();
    this.esAdmin = rol?.trim().toLowerCase() === 'admin';

    this.horarioService.obtenerTolerancia().subscribe({
      next: (data) => {
        this.toleranciaEntrada = data.toleranciaEntrada;
        this.toleranciaSalida = data.toleranciaSalida;
      },
      error: (err) => {
        console.error('❌ Error al obtener tolerancia:', err);
      }
    });
  }

 guardarConfiguracion() {
  console.log('⏺ Método guardarConfiguracion() activado');
  console.log('🧠 ¿Es admin?', this.esAdmin);

  const datos = {
    toleranciaEntrada: this.toleranciaEntrada,
    toleranciaSalida: this.toleranciaSalida
  };

  console.log('📤 Payload:', datos); // 👈 aquí va el log que deseas

  if (this.esAdmin) {
    this.horarioService.guardarTolerancia(datos.toleranciaEntrada, datos.toleranciaSalida)
      .subscribe({
        next: () => {
          Swal.fire('Guardado', 'Configuración actualizada con éxito', 'success');
        },
        error: (error) => {
          console.error('❌ Error al guardar:', error);
          Swal.fire('Error', 'No se pudo guardar la configuración', 'error');
        }
      });
  }
}


  consultarToleranciaEntradaPorFecha() {
    const fechaActual = new Date().toISOString().split('T')[0];
    const usuarioId = this.authService.obtenerUsuario()?.id;

    if (!usuarioId) {
      console.warn('🚫 Usuario no autenticado.');
      Swal.fire('Error', 'No se puede consultar la tolerancia: Usuario no disponible', 'error');
      return;
    }

    this.horarioService.obtenerToleranciaEntrada(usuarioId, fechaActual)
      .subscribe({
        next: (tolerancia: number) => {
          Swal.fire({
            icon: 'info',
            title: 'Tolerancia de Entrada Hoy',
            text: `Tienes ${tolerancia} minutos de tolerancia para la fecha ${fechaActual}.`,
            confirmButtonText: 'Entendido'
          });
        },
        error: (error) => {
          console.error('❌ Error al consultar tolerancia por fecha:', error);
          Swal.fire('Error', 'No se pudo obtener la tolerancia para hoy.', 'error');
        }
      });
  }


}
*/


import { Component, OnInit } from '@angular/core';
//import { HorarioService } from 'src/app/services/horario.service';
import Swal from 'sweetalert2';
import { HorarioService } from '../../../services/horario.service';

@Component({
  selector: 'app-configuracion-horario',
  templateUrl: './configuracion-horario.component.html',
  styleUrls: ['./configuracion-horario.component.css']
})
export class ConfiguracionHorarioComponent implements OnInit {
  toleranciaEntrada: number = 0;
  toleranciaSalida: number = 0;
  horasNormalesPorDia: number = 8; // valor por defecto

  constructor(private horarioService: HorarioService) {}

  ngOnInit(): void {
    this.horarioService.obtenerTolerancia().subscribe(
      (response) => {
        this.toleranciaEntrada = response.toleranciaEntrada;
        this.toleranciaSalida = response.toleranciaSalida;
      },
      (error) => {
        console.error('Error obteniendo tolerancia:', error);
      }
    );

    this.horarioService.obtenerHorasNormalesPorDia().subscribe(
      (response) => {
        this.horasNormalesPorDia = response.horasNormalesPorDia;
      },
      (error) => {
        console.error('Error obteniendo horas normales por día:', error);
      }
    );
  }

  guardarConfiguracion(): void {
    this.horarioService.guardarTolerancia(this.toleranciaEntrada, this.toleranciaSalida).subscribe(
      () => {
        this.horarioService.guardarHorasNormalesPorDia(this.horasNormalesPorDia).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: '¡Configuración guardada!',
              text: 'Las configuraciones fueron actualizadas correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error al guardar las horas normales por día.'
            });
            console.error('Error guardando horas normales:', error);
          }
        );
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un problema al guardar la tolerancia.'
        });
        console.error('Error guardando tolerancia:', error);
      }
    );
  }
}
