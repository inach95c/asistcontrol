import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-kiosk-asistencia',
  templateUrl: './kiosk-asistencia.component.html',
  styleUrls: ['./kiosk-asistencia.component.css']
})
export class KioskAsistenciaComponent implements OnInit, OnDestroy {

  tiposEventos: string[] = ['ENTRADA', 'SALIDA', 'ALMUERZO'];
  tipoSeleccionado: string = 'ENTRADA';
  qrImageSrc: string | null = null;
  tiempoRestante: number = 60;
  temporizadorInterval: any;

  // Nuevos añadidos
  selectorBloqueado: boolean = false;
  isMobile: boolean = false;
  horaActual: string = '';
  mensajeFlotante: string = '';

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    this.generarQr();
    this.iniciarTemporizador();
    this.actualizarHora();
  }

  generarQr(): void {
    this.asistenciaService.generarQrDinamico(this.tipoSeleccionado).subscribe(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.qrImageSrc = reader.result as string;
        this.playBeep();
        this.mostrarMensajeTemporal(`✅ Escaneo para ${this.tipoSeleccionado}`);
      };
      reader.readAsDataURL(blob);
    });
  }

  iniciarTemporizador(): void {
    this.tiempoRestante = 60;
    this.temporizadorInterval = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.generarQr();
        this.tiempoRestante = 60;
      }
    }, 1000);
  }

  actualizarHora(): void {
    setInterval(() => {
      const ahora = new Date();
      this.horaActual = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    }, 1000);
  }

  onTipoEventoChange(): void {
    this.generarQr();
    this.tiempoRestante = 60;
  }

  toggleBloqueo(): void {
    this.selectorBloqueado = !this.selectorBloqueado;
  }

  playBeep(): void {
    const audio = new Audio('assets/sounds/success.mp3');
    audio.play().catch(error => console.warn('Sonido no disponible:', error));
  }

  mostrarMensajeTemporal(texto: string): void {
    this.mensajeFlotante = texto;
    setTimeout(() => {
      this.mensajeFlotante = '';
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.temporizadorInterval) {
      clearInterval(this.temporizadorInterval);
    }
  }
}
