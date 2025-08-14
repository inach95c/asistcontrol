import { Component, OnInit } from '@angular/core';
import { ExamenService } from '../../services/examen.service';
import { Examen } from '../../models/examen.model';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  searchQuery: string = ''; 
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  estadoSeleccionado: string = ''; 
  estadoSeleccionadoCalificacion: string = ''; 
  estadoSeleccionadoEvaluacion: string = ''; 
  examenes: Examen[] = []; 
  searchResults: Examen[] = []; 

  paginaActual: number = 1; // Página actual
  numElementosPorPagina: number = 10; // Número de elementos por página (por defecto)

  estadoDeCalificacionDeLosCentros: string[] = [
    'Apto_Simétrico', 'Apto_Asimétrico', 'Apto_Móvil', 'No_Apto',
    'Pdte_Puerta', 'DI'
  ];
  estadosDelServicio: string[] = [
    'OK', 'OK_Red_Móvil', 'Solicitud_Nueva', 'Con_OS_Siprec',
    'Pdte_Usuario', 'En_Proceso', 'DI', 'Cancelada_Usuario'
  ];
  evaluacion: string[] = [
    'Operaciones', 'Inversiones'
  ];

  panelExpandido: boolean = false; // Panel abierto por defecto

  constructor(private examenService: ExamenService) { }

  ngOnInit() {
    this.obtenerExamenes();
  }

  alternarPanel() {
    this.panelExpandido = !this.panelExpandido;
  }

 

  obtenerExamenes() {
    this.examenService.obtenerExamenes().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.examenes = data;
          this.searchResults = data;
        } else {
          console.error("Error: La API no devolvió un array.");
        }
      },
      error: (error) => {
        console.error("Error al obtener exámenes:", error);
      }
    });
  }

  search(): void {
    if (this.searchQuery.trim().length === 0 && !this.fechaInicio && !this.fechaFin && !this.estadoSeleccionado && !this.estadoSeleccionadoCalificacion && !this.estadoSeleccionadoEvaluacion) { 
      this.searchResults = this.examenes;
      return;
    }

    this.searchResults = this.examenes.filter(examen => {
      const coincideBusqueda = this.searchQuery.trim().length === 0 || 
        examen.titulo?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.descripcion?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.organismo?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.numeroDeSolicitud?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.solicitud?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.velocidad?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.enlace?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.noAdsl?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.cuota?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.costoDeInstalacion?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.estadoDelServicio?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.estadoDeCalificacionDeLosCentros?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.evaluacion?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.propuestaDeSoluionTecnica?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.tipoDeRecursosADemandar?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.municipio?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.consejoPopular?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.direccion?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.telefonoDeContacto?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        examen.categoria?.titulo?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const fechaExamen = new Date(examen.fechaDeSolicitud);
      const coincideFecha = (!this.fechaInicio || fechaExamen >= new Date(this.fechaInicio)) &&
                            (!this.fechaFin || fechaExamen <= new Date(this.fechaFin));

      const coincideEstado = !this.estadoSeleccionado || examen.estadoDelServicio === this.estadoSeleccionado;
      const coincideEstadoCalificacion = !this.estadoSeleccionadoCalificacion || examen.estadoDeCalificacionDeLosCentros === this.estadoSeleccionadoCalificacion;
      const coincideEstadoEvaluacion = !this.estadoSeleccionadoEvaluacion || examen.evaluacion === this.estadoSeleccionadoEvaluacion;

      return coincideBusqueda && coincideFecha && coincideEstado && coincideEstadoCalificacion && coincideEstadoEvaluacion;
    });

    this.paginaActual = 1; // Reiniciar la paginación al hacer una nueva búsqueda
  }

  limpiarBusqueda(): void {
    this.searchQuery = ''; 
    this.fechaInicio = null;
    this.fechaFin = null;
    this.estadoSeleccionado = ''; 
    this.estadoSeleccionadoCalificacion = ''; 
    this.estadoSeleccionadoEvaluacion = ''; 
    this.searchResults = this.examenes; 
    this.paginaActual = 1; // Reiniciar a la primera página
    
  }

  // Métodos de paginación
  searchResultsFiltrados(): Examen[] {
    return this.searchResults.slice((this.paginaActual - 1) * this.numElementosPorPagina, this.paginaActual * this.numElementosPorPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.searchResults.length / this.numElementosPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
    }
  }

  cambiarElementosPorPagina(event: any): void {
    this.numElementosPorPagina = parseInt(event.target.value, 10);
    this.paginaActual = 1; // Reiniciar a la primera página al cambiar el número de elementos
  }
  // Método para exportar los resultados a Excel con columnas personalizadas (Demanda de Conectividad)
  exportarExcel(): void {
    const datosExcel = this.searchResults.map(examen => ({
      
      'Id': examen.examenId, 
      'Prioridad': examen.prioridad,
      'Categoría del Cliente': examen.categoriaDelCliente,
      'Seguimiento': examen.seguimiento,
      'Organismo': examen.organismo,
      'Entidad': examen.titulo,              //entidad
      'Municipio': examen.categoria?.titulo,   //que es municipio o CTLC
      'Consejo Popular': examen.consejoPopular,
      
      'Dirección': examen.direccion,
      'cliente': examen.descripcion,       // que es cliente
      'Telefono de Contacto': examen.telefonoDeContacto,
      'Solicitud': examen.solicitud,
      'Velocidad': examen.velocidad,
      'No. ADSL': examen.noAdsl,
      'Cuota': examen.cuota,
      'Costo de Instalación': examen.costoDeInstalacion,
      'Fecha de Solicitud': examen.fechaDeSolicitud,
      
      'Estado del Servicio': examen.estadoDelServicio,
      'Estado de Calificación de los Centros': examen.estadoDeCalificacionDeLosCentros,
      'Fecha Respuesta de Calificación': examen.fechaRespuestaCalificacionOperaciones,
     // 'Observación': examen.observacion,                          //revisar para incluir
      'Evaluación': examen.evaluacion,
     // 'Observacines Especialista de Operaciones': examen.observacionesEspecialistaDeOperaciones,    //revisar para incluir
      'Propuesta de Solución Técnica': examen.propuestaDeSoluionTecnica,
      'Tipo de Recurso a Demandar': examen.tipoDeRecursosADemandar,
      'Fecha de Ejecución Estimada a Proponer': examen.fechaDeEjecucionEstimadaAProponer,
     // 'Observacines Especialista de Inversiones': examen.observacionEspInversiones,   //revisar para incluir
      
    }));

   //esto funciona Inicio 
   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);


    // Agregar el encabezado en la primera fila y combinar celdas
  //XLSX.utils.sheet_add_aoa(ws, [['Comercial']], { origin: 'A1' });
 // ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }]; // Combina desde columna A hasta C (Título, Categoría, Solicitud)
 
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados de Búsqueda');

    // Generar el archivo Excel y descargarlo
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Demanda_Conectividad_Operaciones_Desarrollo.xlsx');
    //esto funciona fin

    
  }


  exportarExcelDmandaConectividadDeEntidadesPorProgramaYPrioridad(): void {
    const datosExcel = this.searchResults.map(examen => ({
      
      'Id': examen.examenId, 
      'Territorio': examen.categoria?.titulo,   //que es municipio o CTLC aqui es territorio
     // 'Programa/Proyecto': examen.programaProyecto,               //revisar para incluir
      'Organismo': examen.organismo,
      'Entidad': examen.titulo,              //entidad
      'cliente': examen.descripcion,       // que es cliente


      'Prioridad': examen.prioridad,
      'Categoría del Cliente': examen.categoriaDelCliente,
      'Seguimiento': examen.seguimiento,
      'ID Servicio': examen.noAdsl,          //  'No. ADSL': examen.noAdsl,
      //'Tipo de Servicio': examen.tipoDeServicio,                  //revisar para incluir
      'Solicitud': examen.solicitud,
      'Velocidad Solicitada': examen.velocidad,
      'Dirección': examen.direccion,
      'CTLC': examen.categoria?.titulo,   //que es municipio o CTLC aqui es territorio
      //'Instalacion': examen.instalada,               //revisar para incluir
      'Estado de Calificación de los Centros': examen.estadoDeCalificacionDeLosCentros,
      //'Observación': examen.observacion,                               //revisar para incluir
      'Propuesta de Solución Técnica': examen.propuestaDeSoluionTecnica,
      'Tipo de Recurso a Demandar': examen.tipoDeRecursosADemandar,
      'Fecha de Ejecución Estimada a Proponer': examen.fechaDeEjecucionEstimadaAProponer,
      //'Observacines Especialista de Operaciones': examen.observacionesEspecialistaDeOperaciones;   //revisar para incluir

      
    }));

   //esto funciona Inicio 
   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);

   
    // Agregar el encabezado en la primera fila y combinar celdas
  //XLSX.utils.sheet_add_aoa(ws, [['Comercial']], { origin: 'A1' });
 // ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }]; // Combina desde columna A hasta C (Título, Categoría, Solicitud)
 
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados de Búsqueda');

    // Generar el archivo Excel y descargarlo
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Demanda_Conectividad_de_Entidades_por_Programas_y_Prioridad.xlsx');
    //esto funciona fin

    
  }

}  //fin
