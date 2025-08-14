import { Component, OnInit, ViewChild } from '@angular/core';
import { HorarioService } from 'src/app/services/horario.service';
import { Horario } from 'src/app/models/horario';
import { MatPaginator } from '@angular/material/paginator';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-resumen-horarios',
  templateUrl: './resumen-horarios.component.html',
  styleUrls: ['./resumen-horarios.component.css']
})
export class ResumenHorariosComponent implements OnInit {
  usuariosHorarios: Map<string, Horario[]> = new Map();
  filtroBusqueda: string = '';

  usuariosFiltrados: string[] = [];

  pageSize: number = 5;
  currentPage: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private horarioService: HorarioService) {}

  ngOnInit(): void {
    this.horarioService.obtenerTodosLosHorarios().subscribe((horarios) => {
      const mapa = new Map<string, Horario[]>();

      horarios.forEach((h) => {
        const nombreCompleto = `${h.usuario?.nombre || 'Desconocido'} ${h.usuario?.apellido || ''}`;
        if (!mapa.has(nombreCompleto)) {
          mapa.set(nombreCompleto, []);
        }
        mapa.get(nombreCompleto)!.push(h);
      });

      this.usuariosHorarios = mapa;
      this.actualizarFiltrado();
    });
  }

  usuariosOrdenados(): string[] {
    return this.usuariosFiltrados.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );
  }

  getHorariosPorNombre(nombre: string): Horario[] {
    return this.usuariosHorarios.get(nombre) || [];
  }

  aplicarFiltro(): void {
    this.currentPage = 0;
    this.actualizarFiltrado();
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.currentPage = 0;
    this.actualizarFiltrado();
  }

  actualizarFiltrado(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();

    const coincidencias = Array.from(this.usuariosHorarios.entries())
      .filter(([nombre, horarios]) => {
        const nombreLower = nombre.toLowerCase();
        const coincidenciaNombre = nombreLower.includes(filtro);

        const coincidenciaHorario = horarios.some(h => {
          const entrada = h.horaEntrada?.toLowerCase() || '';
          const salida = h.horaSalida?.toLowerCase() || '';
          const turno = h.turno?.toLowerCase() || '';
          const fechaInicio = h.fechaInicio ? new Date(h.fechaInicio).toLocaleDateString('es-ES') : '';
          const dni = h.usuario?.dni?.toLowerCase() || '';

          return entrada.includes(filtro) ||
                 salida.includes(filtro) ||
                 turno.includes(filtro) ||
                 fechaInicio.includes(filtro) ||
                 dni.includes(filtro);
        });

        return coincidenciaNombre || coincidenciaHorario;
      })
      .map(([nombre]) => nombre)
      .sort();

    this.usuariosFiltrados = coincidencias;
  }

  cambiarPagina(event: any): void {
    this.currentPage = event.pageIndex;
  }

 exportarExcel(): void {
  const nombreArchivo = 'resumen_horarios.xlsx';
  const datosExportar: any[] = [];

  this.usuariosFiltrados.forEach(nombre => {
    const horarios = this.getHorariosPorNombre(nombre);

    horarios.forEach(h => {
      datosExportar.push({
        Nombre: nombre,
        DNI: h.usuario?.dni || '',
        FechaInicio: h.fechaInicio ? new Date(h.fechaInicio).toLocaleDateString('es-ES') : '',
        Entrada: h.horaEntrada || '',
        Salida: h.horaSalida || '',
        Turno: h.turno || '',
      });
    });
  });

  if (datosExportar.length === 0) return;

  const hoja: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExportar);
  const libro: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Horarios');

  const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  saveAs(blob, nombreArchivo);
}


}
