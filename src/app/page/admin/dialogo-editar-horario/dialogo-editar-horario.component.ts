/*import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Horario } from '../../../models/horario';
//import { Horario } from 'src/app/models/horario';

@Component({
  selector: 'app-dialogo-editar-horario',
  templateUrl: './dialogo-editar-horario.component.html',
})
export class DialogoEditarHorarioComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogoEditarHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Horario
  ) {}

  guardar(): void {
  if (!this.data?.usuario?.id) {
    console.error('❗El usuario asociado no tiene ID definido');
    return;
  }

  const actualizado = {
    id: this.data.id,
    horaEntrada: this.data.horaEntrada,
    horaSalida: this.data.horaSalida,
    fechaInicio: this.data.fechaInicio,
    fechaFin: this.data.fechaFin,
    usuario: { id: this.data.usuario.id } // asegurado
  };

  this.dialogRef.close(actualizado);
}




private formatFecha(fecha: any): string | null {
  if (!fecha) return null;
  const f = new Date(fecha);
  return f.toISOString().substring(0, 10); // te da 'YYYY-MM-DD' en local
}


  cancelar(): void {
    this.dialogRef.close();
  }
}
*/

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Horario } from '../../../models/horario';
@Component({
  selector: 'app-dialogo-editar-horario',
  templateUrl: './dialogo-editar-horario.component.html',
})
export class DialogoEditarHorarioComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogoEditarHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Horario
  ) {}

 guardar(): void {
    if (!this.data?.usuario?.id) {
      console.error('❗El usuario asociado no tiene ID definido');
      return;
    }

    const actualizado = {
      id: this.data.id,
      horaEntrada: this.data.horaEntrada,
      horaSalida: this.data.horaSalida,
      fechaInicio: this.formatearFecha(this.data.fechaInicio),
      fechaFin: this.formatearFecha(this.data.fechaFin),
      usuario: { id: this.data.usuario.id }
    };

    console.log('🗓️ Enviando datos actualizados:', actualizado);
    this.dialogRef.close(actualizado);
  }





  cancelar(): void {
    this.dialogRef.close();
  }

  private formatearFecha(fecha: Date | string): string | null {
    if (!fecha) return null;
    const f = new Date(fecha);
    const año = f.getFullYear();
    const mes = String(f.getMonth() + 1).padStart(2, '0');
    const dia = String(f.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }
}
