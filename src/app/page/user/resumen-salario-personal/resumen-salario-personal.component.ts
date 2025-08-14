import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HorasTrabajadas } from '../../../models/horas-trabajadas';
import { Usuario } from '../../../models/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SalarioService } from '../../../services/salario.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-resumen-salario-personal',
  templateUrl: './resumen-salario-personal.component.html',
  styleUrls: ['./resumen-salario-personal.component.css']
})
export class ResumenSalarioPersonalComponent implements OnInit {

  usuarios: Usuario[] = [];
    horas: HorasTrabajadas[] = [];
    mesSeleccionado = '2025-08';
  
    displayedColumns: string[] = ['nombre', 'dni', 'horasNormales', 'horasExtras', 'tarifa', 'tarifaExtra','salarioExtra', 'salarioTotal'];
    dataSource = new MatTableDataSource<any>();
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    constructor(private salarioService: SalarioService) {}
  
   /* ngOnInit() {
      const asistenciasCompartidas = this.salarioService.getAsistenciasDiarias();
      if (asistenciasCompartidas && asistenciasCompartidas.length > 0) {
        console.log('✅ Usando datos compartidos desde asistencia diaria');
        this.salarioService.getUsuarios().subscribe(usuarios => {
          this.usuarios = usuarios;
          this.salarioService.setUsuariosCache(usuarios);
          this.generarResumenDesdeAsistenciaDiaria(asistenciasCompartidas);
        });
      } else {
        console.log('🔄 No hay datos compartidos, cargando desde backend');
        this.cargarResumen();
      }
    }*/

   /*   ngOnInit() {
  const usuarioActual = this.salarioService.getUsuarioActual();
  console.log('👤 Usuario actual:', usuarioActual);

  if (!usuarioActual) {
    console.warn('⚠️ Usuario actual no está definido');
    return;
  }

  const asistenciasCompartidas = this.salarioService.getAsistenciasDiarias();
  if (asistenciasCompartidas && asistenciasCompartidas.length > 0) {
    console.log('✅ Usando datos compartidos desde asistencia diaria');
    this.generarResumenDesdeAsistenciaDiaria(asistenciasCompartidas);
  } else {
    console.log('🔄 No hay datos compartidos, cargando desde backend');
    this.cargarResumen();
  }
}
*/

/*ngOnInit() {
  // ✅ Restaurar usuario desde localStorage si no está en el servicio
  let usuarioActual = this.salarioService.getUsuarioActual();
  if (!usuarioActual) {
    const raw = localStorage.getItem('usuario');
    if (raw) {
      const usuario = JSON.parse(raw);
      this.salarioService.setUsuarioActual(usuario);
      usuarioActual = usuario;
      console.log('🔁 Usuario restaurado desde localStorage:', usuarioActual);
    }
  }

  console.log('👤 Usuario actual:', usuarioActual);

  if (!usuarioActual) {
    console.warn('⚠️ Usuario actual no está definido');
    return;
  }

  const asistenciasCompartidas = this.salarioService.getAsistenciasDiarias();
  if (asistenciasCompartidas && asistenciasCompartidas.length > 0) {
    console.log('✅ Usando datos compartidos desde asistencia diaria');
    this.generarResumenDesdeAsistenciaDiaria(asistenciasCompartidas);
  } else {
    console.log('🔄 No hay datos compartidos, cargando desde backend');
    this.cargarResumen();
  }
}*/

ngOnInit() {
  // ✅ Restaurar usuario
  let usuarioActual = this.salarioService.getUsuarioActual();
  if (!usuarioActual) {
    const raw = localStorage.getItem('usuario');
    if (raw) {
      const usuario = JSON.parse(raw);
      this.salarioService.setUsuarioActual(usuario);
      usuarioActual = usuario;
      console.log('🔁 Usuario restaurado desde localStorage:', usuarioActual);
    }
  }

  console.log('👤 Usuario actual:', usuarioActual);
  if (!usuarioActual) {
    console.warn('⚠️ Usuario actual no está definido');
    return;
  }

  // ✅ Restaurar asistencias si no están en memoria
  let asistenciasCompartidas = this.salarioService.getAsistenciasDiarias();
  if (!asistenciasCompartidas || asistenciasCompartidas.length === 0) {
    const rawAsistencias = localStorage.getItem('asistenciasDiarias');
    if (rawAsistencias) {
      const asistencias = JSON.parse(rawAsistencias);
      this.salarioService.setAsistenciasDiarias(asistencias);
      asistenciasCompartidas = asistencias;
      console.log('🔁 Asistencias restauradas desde localStorage');
    }
  }

  // ✅ Continuar con lógica
  if (asistenciasCompartidas && asistenciasCompartidas.length > 0) {
    console.log('✅ Usando datos compartidos desde asistencia diaria');
    this.generarResumenDesdeAsistenciaDiaria(asistenciasCompartidas);
  } else {
    console.log('🔄 No hay datos compartidos, cargando desde backend');
    this.cargarResumen();
  }
}


  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    /*cargarResumen() {
      forkJoin([
        this.salarioService.getUsuarios().pipe(
          catchError(err => {
            console.error('❌ Error al obtener usuarios:', err);
            return of([]);
          })
        ),
        this.salarioService.getHorasTrabajadas(this.mesSeleccionado).pipe(
          catchError(err => {
            console.error('❌ Error al obtener horas trabajadas:', err);
            return of([] as HorasTrabajadas[]);
          })
        )
      ]).subscribe(([usuarios, horas]) => {
        console.log('📦 Usuarios recibidos:', usuarios);
        console.log('📦 Horas recibidas:', horas);
  
  
        this.usuarios = usuarios;
        this.horas = horas;
        this.salarioService.setUsuariosCache(usuarios);
        this.generarResumenDesdeAsistenciaDiaria(horas);
      });
    }*/
  
      cargarResumen() {
  forkJoin([
    this.salarioService.getUsuarios().pipe(
      catchError(err => {
        console.error('❌ Error al obtener usuarios:', err);
        return of([]);
      })
    ),
    this.salarioService.getHorasTrabajadas(this.mesSeleccionado).pipe(
      catchError(err => {
        console.error('❌ Error al obtener horas trabajadas:', err);
        return of([] as HorasTrabajadas[]);
      })
    )
  ]).subscribe(([usuarios, horas]) => {
    console.log('📦 Usuarios recibidos:', usuarios);
    console.log('📦 Horas recibidas:', horas);

    // ✅ Guardar en memoria
    this.usuarios = usuarios;
    this.horas = horas;
    this.salarioService.setUsuariosCache(usuarios);
    this.salarioService.setAsistenciasDiarias(horas);

    // ✅ Guardar en localStorage para restaurar después
    localStorage.setItem('asistenciasDiarias', JSON.stringify(horas));

    // ✅ Generar resumen
    this.generarResumenDesdeAsistenciaDiaria(horas);
  });
}

   
  
  generarResumenDesdeAsistenciaDiaria(data: HorasTrabajadas[]) {
  const usuarioActual = this.salarioService.getUsuarioActual();
  if (!usuarioActual) {
    console.warn('⚠️ Usuario actual no definido');
    return;
  }

  const resumenFinal = data
    .filter(h => h.usuarioId === usuarioActual.id)
    .map(h => {
      const tarifaNormal = usuarioActual.tarifaPorHora || 0;
      const tarifaExtra = usuarioActual.tarifaHoraExtra || 0;

      const salarioNormales = h.horasNormales * tarifaNormal;
      const salarioExtras = h.horasExtras * tarifaExtra;

      return {
        nombre: usuarioActual.nombre,
        dni: usuarioActual.dni,
        horasNormales: +h.horasNormales.toFixed(2),
        horasExtras: +h.horasExtras.toFixed(2),
        tarifa: tarifaNormal,
        tarifaExtra: tarifaExtra,
        salarioExtra: +salarioExtras.toFixed(2),
        salarioTotal: +(salarioNormales + salarioExtras).toFixed(2)
      };
    });

  this.dataSource = new MatTableDataSource(resumenFinal);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

  
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    exportarExcel(): void {
      const exportData = this.dataSource.filteredData.map(row => ({
        Nombre: row.nombre,
        DNI: row.dni,
        'Horas normales': row.horasNormales,
        'Horas extras': row.horasExtras,
        Tarifa: row.tarifa,
        Tarifaextra: row.tarifaExtra,
        Salario_Extra: row.salarioExtra,
        'Salario total': row.salarioTotal
        
  
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ResumenMensual');
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `ResumenMensual_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
  }