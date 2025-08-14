
/*import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsistenciaService } from '../../../services/asistencia.service';
//import { AsistenciaService } from 'src/app/services/asistencia.service';

@Component({
  selector: 'app-dialogo-asistencia',
  templateUrl: './dialogo-asistencia.component.html'
})
export class DialogoAsistenciaComponent implements OnInit {
  fechaHoraLocal: string = '';
  tipo: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogoAsistenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit(): void {
    this.tipo = this.data.tipo;
    this.fechaHoraLocal = this.convertToLocalDatetime(this.data.fechaHora);
  }

  private convertToLocalDatetime(fechaHora: string): string {
    const date = new Date(fechaHora);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16); // formato 'YYYY-MM-DDTHH:mm'
  }

  guardar(): void {
    const payload = {
      fechaHora: new Date(this.fechaHoraLocal).toISOString(),
      tipo: this.tipo
    };

    console.log('📦 Payload enviado:', payload);
  console.log('🆔 ID de asistencia:', this.data.id);

    this.asistenciaService.actualizarAsistencia(this.data.id, payload).subscribe({
      next: () => {
        console.log('✅ Asistencia actualizada');
        this.dialogRef.close(true); // notifica éxito al padre
      },
      error: err => {
        console.error('❌ Error al actualizar asistencia:', err);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
*/


import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsistenciaService } from '../../../services/asistencia.service';

@Component({
  selector: 'app-dialogo-asistencia',
  templateUrl: './dialogo-asistencia.component.html'
})
export class DialogoAsistenciaComponent implements OnInit {
  fecha: string = '';
  horaEntrada: string = '';
  horaSalida: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogoAsistenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit(): void {
    console.log('🔍 ID Entrada:', this.data.idEntrada);
console.log('🔍 ID Salida:', this.data.idSalida);

    const entrada = this.data.entrada ? new Date(this.data.entrada) : null;
    const salida = this.data.salida ? new Date(this.data.salida) : null;

    if (entrada) {
      this.fecha = entrada.toISOString().split('T')[0];
      const h = entrada.getHours().toString().padStart(2, '0');
      const m = entrada.getMinutes().toString().padStart(2, '0');
      this.horaEntrada = `${h}:${m}`;
    }

    if (salida) {
      const h = salida.getHours().toString().padStart(2, '0');
      const m = salida.getMinutes().toString().padStart(2, '0');
      this.horaSalida = `${h}:${m}`;
    }
  }
/*
  guardar(): void {
  const actualizaciones: any[] = [];

  if (this.horaEntrada && this.data.idEntrada) {
    const entradaStr = `${this.fecha}T${this.horaEntrada}`;
    actualizaciones.push({
      id: this.data.idEntrada,
      tipo: 'ENTRADA',
      fechaHora: new Date(entradaStr).toISOString()
    });
  }

  if (this.horaSalida && this.data.idSalida) {
    const salidaStr = `${this.fecha}T${this.horaSalida}`;
    actualizaciones.push({
      id: this.data.idSalida,
      tipo: 'SALIDA',
      fechaHora: new Date(salidaStr).toISOString()
    });
  }

  let completados = 0;
  actualizaciones.forEach(payload => {
    console.log('📦 Enviando:', payload);

    this.asistenciaService.actualizarAsistencia(payload.id, payload).subscribe({
      next: () => {
        completados++;
        if (completados === actualizaciones.length) {
          console.log('✅ Asistencia(s) actualizada(s)');
          this.dialogRef.close(true);
        }
      },
      error: err => {
        console.error('❌ Error al actualizar asistencia:', err);
      }
    });
  });
}
*/


guardar(): void {
  const actualizaciones: any[] = [];

  if (this.horaEntrada && this.data.idEntrada) {
    const entradaStr = `${this.fecha}T${this.horaEntrada}`;
    actualizaciones.push({
      id: this.data.idEntrada,
      tipo: 'ENTRADA',
      fechaHora: entradaStr // 🟢 sin convertir
    });
  }

  if (this.horaSalida && this.data.idSalida) {
    const salidaStr = `${this.fecha}T${this.horaSalida}`;
    actualizaciones.push({
      id: this.data.idSalida,
      tipo: 'SALIDA',
      fechaHora: salidaStr // 🟢 sin convertir
    });
  }

  let completados = 0;
  actualizaciones.forEach(payload => {
    console.log('📦 Enviando:', payload);

    this.asistenciaService.actualizarAsistencia(payload.id, payload).subscribe({
      next: () => {
        completados++;
        if (completados === actualizaciones.length) {
          console.log('✅ Asistencia(s) actualizada(s)');
          this.dialogRef.close(true);
        }
      },
      error: err => {
        console.error('❌ Error al actualizar asistencia:', err);
      }
    });
  });
}


  cancelar(): void {
    this.dialogRef.close();
  }
}
