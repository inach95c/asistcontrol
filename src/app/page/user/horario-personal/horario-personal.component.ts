import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HorarioService } from '../../../services/horario.service';
import { AsistenciaService, Asistencia } from '../../../services/asistencia.service';
import { Horario } from '../../../models/horario';
import Swal from 'sweetalert2';

declare var jsQR: any;

@Component({
  selector: 'app-horario-personal',
  templateUrl: './horario-personal.component.html',
  styleUrls: ['./horario-personal.component.css']
})
export class HorarioPersonalComponent implements OnInit {

  //horarioDeHoy: Horario | null = null;
  historialAsistencia: Asistencia[] = [];
  entradaRegistrada: boolean = false;
  salidaRegistrada: boolean = false;
  fechaHoraActual: Date = new Date();

  jornadaActiva: boolean = false;
  mensajeJornada: string = '';

  mostrarScanner: boolean = false;

  horariosDelDia: Horario[] = [];

  mostrarBotonEscanear: boolean = false;



  @ViewChild('video', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  scanning: boolean = false;
  mensajeQr: string = '';
  tokenEscaneado: string = '';
  tipoQrDetectado: string = '';
  qrExpiraEnSegundos: number = 15;
  escaneoActivo: boolean = false;
  intervaloExpiracion: any;

  constructor(
    private horarioService: HorarioService,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit(): void {
    this.actualizarReloj();
    //this.cargarHorario();
    this.cargarHistorialAsistencia();

    this.cargarHorariosDelDia();

  }

  actualizarReloj(): void {
    setInterval(() => {
      this.fechaHoraActual = new Date();
      this.verificarEstadoJornada();
      this.actualizarEstadoBotonEscanear();
    }, 1000);
  }

 

    cargarHorariosDelDia(): void {
  this.horarioService.getHorariosDelDia().subscribe({
    next: (horarios) => {
      this.horariosDelDia = horarios;
      this.verificarEstadoJornada();
      this.actualizarEstadoBotonEscanear();
    },
    error: (err) => {
      console.error("❌ Error al obtener horarios del día:", err);
      this.horariosDelDia = [];
    }
  });
}


  cargarHistorialAsistencia(): void {
    this.asistenciaService.obtenerHistorial().subscribe(data => {
      this.historialAsistencia = [...data];
      this.verificarEstadoAsistencia();
      this.actualizarEstadoBotonEscanear();
    });
  }


    salidaPendiente: boolean = false;

verificarEstadoAsistencia(): void {
  const hoy = new Date().toDateString();
  this.entradaRegistrada = this.historialAsistencia.some(a =>
    new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'ENTRADA'
  );
  this.salidaRegistrada = this.historialAsistencia.some(a =>
    new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'SALIDA'
  );
  this.salidaPendiente = this.entradaRegistrada && !this.salidaRegistrada;
}


 verificarEstadoJornada(): void {
  if (!this.horariosDelDia || this.horariosDelDia.length === 0) {
    this.jornadaActiva = false;
    this.mensajeJornada = '🔴 No tienes turnos asignados hoy';
    return;
  }

  const ahora = new Date();
  const horaActual = ahora.getHours() + ahora.getMinutes() / 60;

  let jornadaCompletada = true;
  let dentroDeAlgunaJornada = false;
  let faltaAlgunRegistro = false;

  for (const turno of this.horariosDelDia) {
    const [entradaHora, entradaMin] = turno.horaEntrada.split(':').map(Number);
    const [salidaHora, salidaMin] = turno.horaSalida.split(':').map(Number);

    const horaEntrada = entradaHora + entradaMin / 60;
    const horaSalida = salidaHora + salidaMin / 60;

    const dentroHorario = horaActual >= horaEntrada && horaActual <= horaSalida;
    if (dentroHorario) dentroDeAlgunaJornada = true;

    const hoy = new Date().toDateString();
    const entradas = this.historialAsistencia.filter(a =>
      new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'ENTRADA'
    );
    const salidas = this.historialAsistencia.filter(a =>
      new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'SALIDA'
    );

    const entradaRegistrada = entradas.some(e => {
      const hora = new Date(e.fechaHora);
      return hora.getHours() + hora.getMinutes() / 60 >= horaEntrada &&
             hora.getHours() + hora.getMinutes() / 60 <= horaSalida;
    });

    const salidaRegistrada = salidas.some(s => {
      const hora = new Date(s.fechaHora);
      return hora.getHours() + hora.getMinutes() / 60 >= horaEntrada &&
             hora.getHours() + hora.getMinutes() / 60 <= horaSalida;
    });

    if (!entradaRegistrada || !salidaRegistrada) {
      jornadaCompletada = false;
      faltaAlgunRegistro = true;
    }
  }

  this.jornadaActiva = dentroDeAlgunaJornada && faltaAlgunRegistro;

  if (jornadaCompletada) {
    this.mensajeJornada = '🎉 Jornada completada';
  } else if (this.jornadaActiva) {
    this.mensajeJornada = '🟢 Estás dentro de tu jornada laboral';
  } else if (dentroDeAlgunaJornada) {
    this.mensajeJornada = '📌 Jornada activa (ya registraste asistencia)';
  } else {
    this.mensajeJornada = '🔴 Fuera de horario laboral';
  }
}



  iniciarEscaneoQr(): void {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      const video = this.videoRef.nativeElement;
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
        this.scanning = true;
        this.tokenEscaneado = '';
        this.escaneoActivo = true;
        this.mensajeQr = '📡 Escaneando código QR...';
        this.qrExpiraEnSegundos = 15;

        this.intervaloExpiracion = setInterval(() => {
          if (this.qrExpiraEnSegundos > 0) {
            this.qrExpiraEnSegundos--;
          } else {
            this.detenerEscaneo();
          }
        }, 1000);

        this.loopEscaneo();
      };
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
      this.mensajeQr = `✅ ${resp.nombre}, evento ${resp.evento} registrado a las ${resp.hora}`;
      this.detenerEscaneo();
      this.playBeep(); // 🔊 Sonido sutil tras escaneo exitoso
      this.cargarHistorialAsistencia();
      this.mostrarScanner = false;

      Swal.fire({
        icon: 'success',
        title: resp.mensaje,
        html: `
          <strong>${resp.nombre}</strong><br>
          Evento: <strong>${resp.evento}</strong><br>
          Hora: <strong>${resp.hora}</strong>
        `,
        confirmButtonText: 'OK',
      });
    },
    error: (err) => {
      this.mensajeQr = '❌ QR inválido';
      this.tokenEscaneado = '';
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
      this.mensajeQr = '✔ Registro desde QR-JWT exitoso';
      this.detenerEscaneo();
      this.playBeep(); // 🔉 Sonido al completar registro
      this.cargarHistorialAsistencia();
      this.mostrarScanner = false;

      Swal.fire({
        icon: 'success',
        title: 'Evento registrado',
        text: mensaje,
        confirmButtonText: 'OK',
      });
    },
    error: (err) => {
      this.mensajeQr = '❌ QR inválido';
      this.tokenEscaneado = '';
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


 toggleEscaner(): void {
  this.mostrarScanner = !this.mostrarScanner;
  if (this.mostrarScanner) {
    this.iniciarEscaneoQr();
  } else {
    this.detenerEscaneo();
  }
}


playBeep(): void {
  const audio = new Audio('assets/sounds/beep.mp3');
  audio.play().catch(error => {
    console.warn('🔇 No se pudo reproducir el sonido:', error);
  });
}


obtenerEstadoTurno(turno: Horario): { emoji: string; texto: string } {
  const hoy = new Date().toDateString();
  const entradas = this.historialAsistencia.filter(a =>
    new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'ENTRADA'
  );
  const salidas = this.historialAsistencia.filter(a =>
    new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'SALIDA'
  );

  const [hEntrada, mEntrada] = turno.horaEntrada.split(':').map(Number);
  const [hSalida, mSalida] = turno.horaSalida.split(':').map(Number);

  const inicio = new Date();
  inicio.setHours(hEntrada, mEntrada, 0, 0);

  const fin = new Date();
  fin.setHours(hSalida, mSalida, 0, 0);

  const ahora = new Date();

  const entradaRegistrada = entradas.some(e => {
    const hora = new Date(e.fechaHora);
    return hora >= inicio && hora <= fin;
  });

  const salidaRegistrada = salidas.some(s => {
    const hora = new Date(s.fechaHora);
    return hora >= inicio && hora <= fin;
  });

 if (entradaRegistrada && salidaRegistrada) {
  return { emoji: '✔️', texto: 'Completado' };
}

if (entradaRegistrada && !salidaRegistrada) {
  if (ahora > fin) {
   return { emoji: '⚠️', texto: 'Turno vencido' };
   //return { emoji: '⚠️', texto: 'Turno vencido' };
  } else {
    return { emoji: '⏳', texto: 'Falta salida' };
  }
}

if (!entradaRegistrada && !salidaRegistrada) {
  if (ahora >= inicio && ahora <= fin) {
    return { emoji: '🕒', texto: 'Pendiente' };
  } else {
    return { emoji: '❌', texto: 'No registrado' };
  }
}

// Casos como salida sin entrada, o datos corruptos
return { emoji: '⚠️', texto: 'Incompleto' };
}

actualizarEstadoBotonEscanear(): void {
  if (!this.horariosDelDia || this.horariosDelDia.length === 0) {
    this.mostrarBotonEscanear = false;
    return;
  }

  const ahora = new Date();
  const hoy = ahora.toDateString();
  const entradas = this.historialAsistencia.filter(a =>
    new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'ENTRADA'
  );
  const salidas = this.historialAsistencia.filter(a =>
    new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'SALIDA'
  );

  for (const turno of this.horariosDelDia) {
    const [hEntrada, mEntrada] = turno.horaEntrada.split(':').map(Number);
    const [hSalida, mSalida] = turno.horaSalida.split(':').map(Number);

    const inicio = new Date();
    inicio.setHours(hEntrada, mEntrada, 0, 0);

    const fin = new Date();
    fin.setHours(hSalida, mSalida, 0, 0);

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
      this.mostrarBotonEscanear = true;
      return;
    }
  }

  this.mostrarBotonEscanear = false;
}



}
