



import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Asistencia, AsistenciaService } from '../../../services/asistencia.service';
import { HorarioService } from '../../../services/horario.service';
import { Horario } from '../../../models/horario';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { AsistenciaStateService } from 'src/app/services/asistencia-state.service';

declare var jsQR: any;




@Component({
  selector: 'app-login-asistencia',
  templateUrl: './login-asistencia.component.html',
  styleUrls: ['./login-asistencia.component.css']
})
export class LoginAsistenciaComponent implements OnInit, AfterViewInit {
  columnas: string[] = ['fechaHora', 'tipo'];
  dataSource = new MatTableDataSource<Asistencia>();
  fechaHoraActual: Date = new Date();

  entradaRegistrada = false;
  salidaRegistrada = false;
  salidaPendiente = false;
  jornadaCompletada = false;
  mensajeJornada = '';
  mostrarScanner = false;
  mostrarTabla = false;

  sinHorarioAsignado = false;
  estaDentroDelHorario = false;
  horarioDeHoy: Horario | null = null;

  toleranciaEntradaMinutos: number = 30;
  toleranciaSalidaMinutos: number = 0;

  mostrarBotonEscanear = false;

  horariosDelDia: Horario[] = [];



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('video', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  scanning = false;
  mensajeQr = '';
  tokenEscaneado = '';
  tipoQrDetectado = '';
  qrExpiraEnSegundos = 15;
  escaneoActivo = false;
  intervaloExpiracion: any;

  constructor(
    private asistenciaService: AsistenciaService,
    private horarioService: HorarioService,
    private asistenciaStateService: AsistenciaStateService
  ) {}

  ngOnInit(): void {
    this.toleranciaEntradaMinutos = this.horarioService.getToleranciaEntrada();
    this.toleranciaSalidaMinutos = this.horarioService.getToleranciaSalida();
    this.iniciarReloj();
    this.cargarHistorial();
    //this.cargarHorarioDeHoy();
    this.cargarHorariosDelDia();
  }

  ngAfterViewInit(): void {
    this.actualizarPaginador();
  }

  iniciarReloj(): void {
    setInterval(() => {
      this.fechaHoraActual = new Date();
      this.verificarEstadoAsistencia();
      this.verificarHorarioActual();
      this.actualizarEstadoBotonEscanear();

    }, 1000);
  }

  cargarHistorial(): void {
    this.asistenciaService.obtenerHistorial().subscribe(data => {
      this.dataSource.data = [...data];
      this.verificarEstadoAsistencia();
      this.actualizarPaginador();
    });
  }



cargarHorariosDelDia(): void {
  this.horarioService.getHorariosDelDia().subscribe({
    next: (horarios) => {
      this.horariosDelDia = horarios;
      this.sinHorarioAsignado = horarios.length === 0;
      this.verificarHorarioActual();
      this.actualizarEstadoBotonEscanear();
    },
    error: () => {
      this.horariosDelDia = [];
      this.sinHorarioAsignado = true;
      this.actualizarEstadoBotonEscanear();
    }
  });
}



  verificarHorarioActual(): void {
    if (!this.horarioDeHoy) {
      this.estaDentroDelHorario = false;
      return;
    }

    const ahora = new Date();
    const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

    const [entradaHora, entradaMin] = this.horarioDeHoy.horaEntrada.split(':').map(Number);
    const [salidaHora, salidaMin] = this.horarioDeHoy.horaSalida.split(':').map(Number);

    const horaEntrada = entradaHora + entradaMin / 60;
    const horaSalida = salidaHora + salidaMin / 60;

    const margenEntrada = this.toleranciaEntradaMinutos / 60;
    const margenSalida = this.toleranciaSalidaMinutos / 60;

    const inicioConTolerancia = horaEntrada - margenEntrada;
    const finConTolerancia = horaSalida + margenSalida;

    this.estaDentroDelHorario = horaActual >= inicioConTolerancia && horaActual <= finConTolerancia;
  }

 


        verificarEstadoAsistencia(): void {
  const hoy = new Date().toDateString();

  // Filtrar registros del día
  const registrosHoy = this.dataSource.data
    .filter(a => new Date(a.fechaHora).toDateString() === hoy)
    .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

  const turnos: { entrada: Date; salida?: Date }[] = [];
  let entradaPendiente: Date | null = null;

  for (const registro of registrosHoy) {
    const fecha = new Date(registro.fechaHora);

    if (registro.tipo === 'ENTRADA') {
      // Si ya hay una entrada pendiente, no la duplicamos
      if (!entradaPendiente) {
        entradaPendiente = fecha;
      }
    } else if (registro.tipo === 'SALIDA') {
      // Si hay una entrada pendiente, emparejamos
      if (entradaPendiente) {
        turnos.push({ entrada: entradaPendiente, salida: fecha });
        entradaPendiente = null;
      } else {
        // Salida sin entrada previa: ignorar o manejar como error si lo deseas
      }
    }
  }

  // Si quedó una entrada sin salida, la agregamos como turno incompleto
  if (entradaPendiente) {
    turnos.push({ entrada: entradaPendiente });
  }

  // Actualizar estados
  this.entradaRegistrada = turnos.length > 0;
  this.salidaRegistrada = turnos.every(t => !!t.salida);
  this.salidaPendiente = turnos.some(t => !t.salida);
  this.jornadaCompletada = turnos.length > 0 && this.salidaRegistrada;

  // Mensaje dinámico
  if (this.jornadaCompletada) {
    this.mensajeJornada = `🎉 Jornada completada (${turnos.length} turno${turnos.length > 1 ? 's' : ''})`;
  } else if (this.entradaRegistrada) {
    const incompletos = turnos.filter(t => !t.salida).length;
    this.mensajeJornada = `📌 Jornada activa (${incompletos} turno${incompletos > 1 ? 's' : ''} pendiente${incompletos > 1 ? 's' : ''})`;
  } else {
    this.mensajeJornada = '🟢 Aún no has registrado asistencia hoy';
  }
}


  actualizarPaginador(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

    toggleEscaner(): void {
    this.mostrarScanner = !this.mostrarScanner;
    if (this.mostrarScanner) {
      this.iniciarEscaneoQr();
      this.mostrarTabla = false;
    } else {
      this.detenerEscaneo();
    }
  }

  iniciarEscaneoQr(): void {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        const tieneCamaraTrasera = videoInputs.length > 1;

        const constraints = {
          video: tieneCamaraTrasera ? { facingMode: { ideal: 'environment' } } : true,
          audio: false
        };

        return navigator.mediaDevices.getUserMedia(constraints);
      })
      .then(stream => {
        const video = this.videoRef.nativeElement;
        video.srcObject = stream;

        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');

        video.onloadedmetadata = () => {
          video.play().catch(err => console.warn('🎥 Error al reproducir el video:', err));
          this.scanning = true;
          this.tokenEscaneado = '';
          this.qrExpiraEnSegundos = 15;
          this.escaneoActivo = true;
          this.mensajeQr = '📡 Escaneando código QR...';
          this.tipoQrDetectado = '';

          this.intervaloExpiracion = setInterval(() => {
            if (this.qrExpiraEnSegundos > 0) {
              this.qrExpiraEnSegundos--;
            } else {
              this.detenerEscaneo();
            }
          }, 1000);

          this.loopEscaneo();
        };
      })
      .catch(error => {
        console.error('🚫 No se pudo acceder a la cámara:', error);
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado a cámara',
          text: 'Verifica los permisos o usa HTTPS.',
          confirmButtonText: 'Cerrar'
        });
        this.mostrarScanner = false;
      });
  }

  loopEscaneo(): void {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 300;

    const leerFrame = () => {
      if (!this.scanning) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code?.data) {
        this.scanning = false;
        this.tokenEscaneado = code.data;
        this.escaneoActivo = false;
        clearInterval(this.intervaloExpiracion);

        const extraido = code.data.includes('token=') ? code.data.split('token=')[1] : code.data;

        if (extraido.split('.').length === 3) {
          this.tipoQrDetectado = 'JWT';
          this.mensajeQr = '🔐 QR tipo JWT detectado';
          this.registrarConJwt(extraido);
        } else {
          this.tipoQrDetectado = 'UUID';
          this.mensajeQr = '🔎 QR tipo UUID detectado';
          this.validarTokenQr(extraido);
        }
      } else {
        requestAnimationFrame(leerFrame);
      }
    };

    requestAnimationFrame(leerFrame);
  }

  detenerEscaneo(): void {
    this.scanning = false;
    this.escaneoActivo = false;
    clearInterval(this.intervaloExpiracion);
    const stream = this.videoRef.nativeElement.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    this.mensajeQr = '⏹ Escaneo finalizado.';
    this.tipoQrDetectado = '';
  }

  validarTokenQr(token: string): void {
    this.asistenciaService.validarQrDesdeToken(token).subscribe({
      next: (resp) => {
        this.tokenEscaneado = token;
        this.detenerEscaneo();
        this.playBeep();
        this.cargarHistorial();
        this.mostrarScanner = false;
        this.mostrarTabla = true;
        this.actualizarPaginador();

        Swal.fire({
          icon: 'success',
          title: resp.mensaje,
          html: `<strong>${resp.nombre}</strong><br>Evento: <strong>${resp.evento}</strong><br>Hora: <strong>${resp.hora}</strong>`,
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        this.tokenEscaneado = '';
        this.mensajeQr = '❌ QR inválido';
        this.tipoQrDetectado = '';

        Swal.fire({
          icon: 'error',
          title: 'QR rechazado',
          text: err.error?.message || 'No se pudo validar el token QR.',
          confirmButtonText: 'Cerrar',
        });

        this.escaneoActivo = true;
        this.scanning = true;
        this.loopEscaneo();
      }
    });
  }

  registrarConJwt(token: string): void {
    this.asistenciaService.registrarDesdeJwt(token).subscribe({
      next: (mensaje) => {
        this.tokenEscaneado = token;
        this.detenerEscaneo();
        this.playBeep();
        this.cargarHistorial();
        this.mostrarScanner = false;
        this.mostrarTabla = true;
        this.actualizarPaginador();

        Swal.fire({
          icon: 'success',
          title: 'Evento registrado',
          text: mensaje,
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        this.tokenEscaneado = '';
        this.mensajeQr = '❌ QR inválido';
        this.tipoQrDetectado = '';

        Swal.fire({
          icon: 'error',
          title: 'QR rechazado',
          text: err.error?.message || 'No se pudo registrar el evento.',
          confirmButtonText: 'Cerrar',
        });

        this.escaneoActivo = true;
        this.scanning = true;
        this.loopEscaneo();
      }
    });
  }

  playBeep(): void {
    const audio = new Audio('assets/sounds/beep.mp3');
    audio.play().catch(error => {
      console.warn('🔇 No se pudo reproducir el sonido:', error);
    });
  }


actualizarEstadoBotonEscanear(): void {
  if (this.sinHorarioAsignado || this.horariosDelDia.length === 0) {
    this.mostrarBotonEscanear = false;
    return;
  }

  const ahora = new Date();
  const hoy = ahora.toDateString();
  const registrosHoy = this.dataSource.data.filter(a =>
    new Date(a.fechaHora).toDateString() === hoy
  );

  const entradas = registrosHoy.filter(r => r.tipo === 'ENTRADA');
  const salidas = registrosHoy.filter(r => r.tipo === 'SALIDA');

  let dentroDelHorarioConPendiente = false;

  for (const horario of this.horariosDelDia) {
    const [hEntrada, mEntrada] = horario.horaEntrada.split(':').map(Number);
    const [hSalida, mSalida] = horario.horaSalida.split(':').map(Number);

    const inicio = new Date();
    inicio.setHours(hEntrada, mEntrada - this.toleranciaEntradaMinutos, 0, 0);

    const fin = new Date();
    fin.setHours(hSalida, mSalida + this.toleranciaSalidaMinutos, 0, 0);

    const estaDentroDelHorario = ahora >= inicio && ahora <= fin;

    const entradaRegistrada = entradas.some(e => {
      const hora = new Date(e.fechaHora);
      return hora >= inicio && hora <= fin;
    });

    const salidaRegistrada = salidas.some(s => {
      const hora = new Date(s.fechaHora);
      return hora >= inicio && hora <= fin;
    });

    if (estaDentroDelHorario && (!entradaRegistrada || !salidaRegistrada)) {
      dentroDelHorarioConPendiente = true;
      break;
    }
  }

  // Mostrar botón si estamos dentro del horario con algo pendiente
  // O si hay una salida pendiente fuera del horario
  this.mostrarBotonEscanear = dentroDelHorarioConPendiente || this.salidaPendiente;
}



}

