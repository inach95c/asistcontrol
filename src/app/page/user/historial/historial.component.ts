import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Asistencia } from '../../../services/asistencia.service';


import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnChanges {
  @Input() data: Asistencia[] = [];
  @Input() columnas: string[] = [];

  dataSource = new MatTableDataSource<Asistencia>();
  ultimoRegistro: Asistencia | null = null;
  entradaHoy = false;
  salidaHoy = false;
  totalMes = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
    this.dataSource = new MatTableDataSource(this.data); // ← recrear dataSource
    this.procesarResumen();
  }
  }

  procesarResumen(): void {
    if (!this.data.length) return;

    const hoy = new Date().toDateString();
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    const ordenado = [...this.data].sort(
      (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    );
    this.ultimoRegistro = ordenado[0];

    this.entradaHoy = this.data.some(a =>
      new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'ENTRADA'
    );

    this.salidaHoy = this.data.some(a =>
      new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'SALIDA'
    );

    this.totalMes = this.data.filter(a => {
      const fecha = new Date(a.fechaHora);
      return (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual &&
        a.tipo === 'ENTRADA'
      );
    }).length;
  }
}
