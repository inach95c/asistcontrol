
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-examen-dialog',
  templateUrl: './detalle-examen-dialog.component.html',
  styleUrls: ['./detalle-examen-dialog.component.css']
})
export class DetalleExamenDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetalleExamenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrarDialogo(): void {
    this.dialogRef.close();
  }
 
}

