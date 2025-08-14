import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AsistenciaService } from '../../../services/asistencia.service';

declare const jsQR: any;

@Component({
  selector: 'app-qr-scan',
  templateUrl: './qr-scan.component.html',
  styleUrls: ['./qr-scan.component.css']
})
export class QrScanComponent implements AfterViewInit {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  contenidoQR: string = '';
  escaneado: boolean = false;
  mensaje: string = '';

  constructor(private asistenciaService: AsistenciaService) {}

  ngAfterViewInit(): void {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.play();
      this.detectarCodigo();
    }).catch(err => {
      this.mensaje = 'Error al acceder a la cámara: ' + err;
    });
  }

  detectarCodigo(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const video = this.video.nativeElement;

    const loop = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && !this.escaneado) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const codigo = jsQR(imageData?.data, canvas.width, canvas.height);

        if (codigo) {
          this.contenidoQR = codigo.data;
          this.escaneado = true;

          const partes = codigo.data.split(':');
          if (partes.length === 3 && partes[0] === 'asistencia') {
            const username = partes[1];
            const tipo = partes[2];

            this.asistenciaService.registrar(tipo).subscribe(() => {
              this.mensaje = `✅ Asistencia registrada como ${tipo}`;
            }, () => {
              this.mensaje = '❌ Error al registrar asistencia';
              this.escaneado = false;
            });
          } else {
            this.mensaje = `⚠️ Código QR inválido: ${codigo.data}`;
            this.escaneado = false;
          }
        }
      }

      if (!this.escaneado) requestAnimationFrame(loop);
    };

    loop();
  }
}
