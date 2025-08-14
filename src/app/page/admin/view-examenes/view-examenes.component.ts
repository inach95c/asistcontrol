import { Component, OnInit } from '@angular/core';
//import { ExamenService } from 'src/app/services/examen.service';
import { ExamenService } from './../../../services/examen.service';
import Swal from 'sweetalert2';
import { DetalleExamenDialogComponent } from '../../detalle-examen-dialog/detalle-examen-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Examen } from '../../../models/examen.model';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-examenes',
  templateUrl: './view-examenes.component.html',
  styleUrls: ['./view-examenes.component.css']
})
export class ViewExamenesComponent implements OnInit {

 // examenes : any = []
  
//mio
 searchQuery: string = ''; 
   fechaInicio: Date | null = null;
   fechaFin: Date | null = null;
   estadoSeleccionado: string = ''; 
   estadoSeleccionadoCalificacion: string = ''; 
   estadoSeleccionadoEvaluacion: string = ''; 
   examenes: Examen[] = []; 
   searchResults: Examen[] = []; 
 
   paginaActual: number = 1; // Página actual
   numElementosPorPagina: number = 6; // Número de elementos por página (por defecto)
 
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

  constructor(private examenService:ExamenService, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.examenService.listarCuestionarios().subscribe(
      (dato:any) => {
        this.examenes = dato;
         
        console.log(this.examenes);
      },   
      (error) => {
        console.log(error);
        Swal.fire('Error','Error al cargar las solicitudes','error');
      }
    )
    this.obtenerExamenes();

  }

   alternarPanel() {
    this.panelExpandido = !this.panelExpandido;
  }

 /* obtenerExamenes() {
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
        console.error("Error al obtener solicitud:", error);
      }
    });
  }
  */
 obtenerExamenes() {
  this.examenService.obtenerExamenes().subscribe({
    next: (data) => {
      if (Array.isArray(data)) {
        this.examenes = data;
        
        // Ordenar los resultados por fecha descendente
        this.searchResults = [...data].sort((a, b) => new Date(b.fechaDeSolicitud).getTime() - new Date(a.fechaDeSolicitud).getTime());
        
      } else {
        console.error("Error: La API no devolvió un array.");
      }
    },
    error: (error) => {
      console.error("Error al obtener solicitud:", error);
    }
  });
}


  eliminarExamen(examenId:any){
    Swal.fire({
      title:'Eliminar solicitud',
      text:'¿Estás seguro de eliminar la solicitud?',
      icon:'warning',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Eliminar',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        this.examenService.eliminarExamen(examenId).subscribe(
          (data) => {
            this.examenes = this.examenes.filter((examen:any) => examen.examenId != examenId);
            Swal.fire('Solicitud eliminada','La solicitud ha sido eliminado de la base de datos','success');
          },
          (error) => {
            Swal.fire('Error','Error al eliminar la solicitud','error');
          }    
        )
      }
    })
  }

  infoExamen(examen: any) {
    this.dialog.open(DetalleExamenDialogComponent, {
      data: {
        titulo: examen.titulo,
        descripcion: examen.descripcion,
        prioridad: examen.prioridad,
        categoriaDelCliente: examen.categoriaDelCliente,
        organismo: examen.organismo,
        seguimiento: examen.seguimiento,
        municipio: examen.municipio,                      //NO LO USO
        consejoPopular: examen.consejoPopular,
        direccion: examen.direccion,
        telefonoDeContacto: examen.telefonoDeContacto,
        solicitud: examen.solicitud,
        velocidad: examen.velocidad,
        enlace: examen.enlace,
        noAdsl: examen.noAdsl,
        estadoDelServicio: examen.estadoDelServicio,
        tipoDeServicio: examen.tipoDeServicio,
        programaProyecto: examen.programaProyecto,
        instalada: examen.instalada,
        fechaDeSolicitud: examen.fechaDeSolicitud,
        estadoDeCalificacionDeLosCentros: examen.estadoDeCalificacionDeLosCentros,
        observacion: examen.observacion,
        evaluacion: examen.evaluacion,
        observacionesEspecialistaDeOperaciones: examen.observacionesEspecialistaDeOperaciones,
        fechaRespuestaCalificacionOperaciones: examen.fechaRespuestaCalificacionOperaciones,
        propuestaDeSoluionTecnica: examen.propuestaDeSoluionTecnica,
        tipoDeRecursosADemandar: examen.tipoDeRecursosADemandar,
        fechaDeEjecucionEstimadaAProponer: examen.fechaDeEjecucionEstimadaAProponer,
        observacionEspInversiones: examen.observacionEspInversiones
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
  /* searchResultsFiltrados(): Examen[] {
    return this.searchResults.slice((this.paginaActual - 1) * this.numElementosPorPagina, this.paginaActual * this.numElementosPorPagina);
  }
*/

searchResultsFiltrados() {
  return [...this.searchResults]
    .sort((a, b) => new Date(b.fechaDeSolicitud).getTime() - new Date(a.fechaDeSolicitud).getTime()) // Orden descendente
    .slice((this.paginaActual - 1) * this.numElementosPorPagina, this.paginaActual * this.numElementosPorPagina);
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
  

}//fin export
