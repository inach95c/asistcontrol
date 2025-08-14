import { Component } from '@angular/core';
import { QrPersonalService } from '../../../services/qr-personal.service';
//import { QrPersonalService } from '../../services/qr-personal.service';

@Component({
  selector: 'app-qr-personal',
  templateUrl: './qr-personal.component.html',
  styleUrls: ['./qr-personal.component.css']
})
export class QrPersonalComponent {
  qrImagenUrl: string | null = null;
  cargando: boolean = false;

  constructor(private qrService: QrPersonalService) {}

  generarQr(): void {
    this.cargando = true;
    this.qrService.getQrPersonal().subscribe({
      next: (blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.qrImagenUrl = reader.result as string;
          this.cargando = false;
        };
        reader.readAsDataURL(blob);
      },
      error: () => {
        this.qrImagenUrl = null;
        this.cargando = false;
        alert('No se pudo generar el QR. Intenta más tarde.');
      }
    });
  }
}
