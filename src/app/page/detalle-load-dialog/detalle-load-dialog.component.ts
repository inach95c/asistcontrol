import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-load-dialog',
  templateUrl: './detalle-load-dialog.component.html',
  styleUrls: ['./detalle-load-dialog.component.css']
})
export class DetalleLoadDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetalleLoadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrarDialogo(): void {
    this.dialogRef.close();
  }

  imprimirPagina(){
    window.print();
  }

}

