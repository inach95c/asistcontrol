import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Asistencia, AsistenciaService } from '../../../services/asistencia.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-historial-user',
  templateUrl: './historial-user.component.html',
  styleUrls: ['./historial-user.component.css']
})
export class HistorialUserComponent implements OnInit, AfterViewInit {
  columnas: string[] = ['fechaHora', 'tipo'];
  dataSource = new MatTableDataSource<Asistencia>();
  datosOriginales: Asistencia[] = [];

  tipoSeleccionado: string | null = null;
  fechaHoraActual: Date = new Date();
  fechaYHoraDelRegistro: string | null = null;

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private asistenciaService: AsistenciaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
    this.iniciarReloj();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  registrar(tipo: string): void {
    if (this.yaRegistroHoy(tipo)) {
      const hora = this.obtenerUltimaMarca(tipo);
      const mensaje = `⚠️ Ya registraste ${tipo.toLowerCase()} hoy a las ${hora}`;
      this.snackBar.open(mensaje, 'Cerrar', {
        duration: 4000,
        panelClass: ['snackbar-alerta']
      });
      return;
    }

    const ahora = new Date();
    this.asistenciaService.registrar(tipo).subscribe(() => {
      this.cargarHistorial();
      const mensaje = `✅ Registrado: ${this.formatearFechaYHora(ahora)} (${tipo.toLowerCase()})`;
      this.snackBar.open(mensaje, 'OK', {
        duration: 4000,
        panelClass: ['snackbar-confirmado']
      });
    });
  }

  formatearFechaYHora(fecha: Date): string {
    const fechaFormateada = fecha.toLocaleDateString('en-CA');
    const horaFormateada = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${fechaFormateada} | ${horaFormateada}`;
  }

  cargarHistorial(): void {
    this.asistenciaService.obtenerHistorial().subscribe(data => {
      this.datosOriginales = [...data];
      this.dataSource.data = [...data];
    });
  }

  iniciarReloj(): void {
    setInterval(() => {
      this.fechaHoraActual = new Date();
    }, 1000);
  }

  yaRegistroHoy(tipo: string): boolean {
    const hoy = new Date().toDateString();
    return this.dataSource.data.some(item =>
      new Date(item.fechaHora).toDateString() === hoy && item.tipo === tipo
    );
  }

  obtenerUltimaMarca(tipo: string): string {
    const hoy = new Date().toDateString();
    const registros = this.dataSource.data
      .filter(item => new Date(item.fechaHora).toDateString() === hoy && item.tipo === tipo)
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
    return new Date(registros[0]?.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  filtrarPorFechas(): void {
    if (!this.fechaInicio || !this.fechaFin) return;

    const desde = new Date(this.fechaInicio).setHours(0, 0, 0, 0);
    const hasta = new Date(this.fechaFin).setHours(23, 59, 59, 999);

    this.dataSource.data = this.datosOriginales.filter(a => {
      const fecha = new Date(a.fechaHora).getTime();
      return fecha >= desde && fecha <= hasta;
    });
  }

  restablecerFiltro(): void {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.dataSource.data = [...this.datosOriginales];
  }
}
