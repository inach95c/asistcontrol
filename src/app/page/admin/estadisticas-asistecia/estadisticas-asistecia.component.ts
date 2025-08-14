import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import baseUrl from '../../../services/helper';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-estadisticas-asistecia',
  templateUrl: './estadisticas-asistecia.component.html',
  styleUrls: ['./estadisticas-asistecia.component.css']
})
export class EstadisticasAsisteciaComponent implements OnInit, OnChanges {
  @Input() asistencias: any[] = [];

  modoAgrupamiento: 'dia' | 'semana' | 'mes' = 'dia';
  totalesAgrupados: Map<string, number> = new Map();
  porcentajePorUsuario: Map<string, { entradas: number; salidas: number; total: number }> = new Map();
  filtroUsuario = '';

  // Etiquetas amigables
  modoAgrupamientoLabelMap: Record<'dia' | 'semana' | 'mes', string> = {
    dia: 'Día',
    semana: 'Semana',
    mes: 'Mes'
  };

  // Paginación para agrupaciones
  itemsPorPagina = 3;
  paginaActual = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (!this.asistencias || this.asistencias.length === 0) {
      this.cargarAsistenciasDesdeServidor();
    }
  }

  ngOnChanges(): void {
    if (this.asistencias?.length) {
      this.agrupar();
    }
  }

  private cargarAsistenciasDesdeServidor(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<any[]>(`${baseUrl}/asistencia/admin/todas`, { headers }).subscribe({
      next: (data) => {
        this.asistencias = data;
        this.agrupar();
      },
      error: (err) => console.error('Error al cargar asistencias desde servidor:', err)
    });
  }

  agrupar(): void {
    const agrupados = new Map<string, number>();
    this.porcentajePorUsuario.clear();

    this.asistencias.forEach(a => {
      const f = new Date(a.fechaHora);
      let clave = '';

      switch (this.modoAgrupamiento) {
        case 'dia':
          clave = f.toISOString().split('T')[0];
          break;
        case 'semana':
          const inicio = new Date(f.getFullYear(), 0, 1);
          const dias = Math.floor((f.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
          const semana = Math.ceil((dias + inicio.getDay() + 1) / 7);
          clave = `Semana ${semana} - ${f.getFullYear()}`;
          break;
        case 'mes':
          clave = `${f.toLocaleString('default', { month: 'long' })} ${f.getFullYear()}`;
          break;
      }

      agrupados.set(clave, (agrupados.get(clave) || 0) + 1);

      const nombre = `${a.usuario?.nombre || ''} ${a.usuario?.apellido || ''}`.trim();
      if (!this.porcentajePorUsuario.has(nombre)) {
        this.porcentajePorUsuario.set(nombre, { entradas: 0, salidas: 0, total: 0 });
      }

      const resumen = this.porcentajePorUsuario.get(nombre)!;
      resumen.total++;
      if (a.tipo === 'ENTRADA') resumen.entradas++;
      if (a.tipo === 'SALIDA') resumen.salidas++;
    });

    this.totalesAgrupados = agrupados;
    this.paginaActual = 0;
  }

  cambiarAgrupacion(modo: 'dia' | 'semana' | 'mes'): void {
    this.modoAgrupamiento = modo;
    this.agrupar();
  }

  get porcentajeEntradas(): number {
    const total = this.asistencias.length;
    const entradas = this.asistencias.filter(a => a.tipo === 'ENTRADA').length;
    return total > 0 ? (entradas / total) * 100 : 0;
  }

  get porcentajeSalidas(): number {
    const total = this.asistencias.length;
    const salidas = this.asistencias.filter(a => a.tipo === 'SALIDA').length;
    return total > 0 ? (salidas / total) * 100 : 0;
  }

  get clavesAgrupadasPaginadas(): [string, number][] {
    const claves = Array.from(this.totalesAgrupados.entries());
    const inicio = this.paginaActual * this.itemsPorPagina;
    return claves.slice(inicio, inicio + this.itemsPorPagina);
  }

  get usuariosFiltrados(): string[] {
    const filtro = this.filtroUsuario.toLowerCase();
    return Array.from(this.porcentajePorUsuario.keys()).filter(nombre =>
      nombre.toLowerCase().includes(filtro)
    );
  }

  cambiarPagina(event: PageEvent): void {
    this.paginaActual = event.pageIndex;
    this.itemsPorPagina = event.pageSize;
  }


  exportarEstadisticasExcel(): void {
  const nombreArchivo = 'estadisticas_asistencia.xlsx';
  const datosExportar: any[] = [];

  // Totales agrupados
  this.clavesAgrupadasPaginadas.forEach(item => {
    datosExportar.push({
      Agrupación: item[0],
      Total: item[1]
    });
  });

  // Porcentaje global
  datosExportar.push({
    Agrupación: 'Global - Entradas',
    Total: `${this.porcentajeEntradas.toFixed(2)}%`
  });
  datosExportar.push({
    Agrupación: 'Global - Salidas',
    Total: `${this.porcentajeSalidas.toFixed(2)}%`
  });

  // Por usuario
  this.usuariosFiltrados.forEach(usuario => {
    const datos = this.porcentajePorUsuario.get(usuario);
    if (datos) {
      datosExportar.push({
        Agrupación: `Usuario - ${usuario} (Entradas)`,
        Total: `${((datos.entradas / datos.total) * 100).toFixed(2)}%`
      });
      datosExportar.push({
        Agrupación: `Usuario - ${usuario} (Salidas)`,
        Total: `${((datos.salidas / datos.total) * 100).toFixed(2)}%`
      });
    }
  });

  const hoja = XLSX.utils.json_to_sheet(datosExportar);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Estadísticas');

  const buffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, nombreArchivo);
}

get usuariosFiltradosLimitados(): string[] {
  const filtro = this.filtroUsuario.toLowerCase();
  const filtrados = Array.from(this.porcentajePorUsuario.keys()).filter(nombre =>
    nombre.toLowerCase().includes(filtro)
  );
  return filtrados.slice(0, this.itemsPorPagina); // limitar con el mismo selector
}



}
