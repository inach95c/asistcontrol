



import { Component, OnInit } from '@angular/core';


import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { MatTableDataSource } from '@angular/material/table';
import { Examen } from '../../../models/examen.model';
import { ExamenService } from '../../../services/examen.service';




@Component({
  selector: 'app-indicadores-user',
  templateUrl: './indicadores-user.component.html',
  styleUrls: ['./indicadores-user.component.css']
})

export class IndicadoresUserComponent implements OnInit {



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

    // Indicadores DI
    totalExamenesDIAGestionar: number = 0; 
    totalExamenesDI: number = 0;              //esta es del backend
    totalExamenesDIActual: number = 0;             
    totalExamenesDIAnterior: number = 0;  
    
    totalExamenesDIGestionadas: number = 0; 
    totalExamenesDIOperaciones: number = 0; 
    totalExamenesDIInversiones: number = 0; 
    totalExamenesDIReparador: number = 0; 

    totalExamenesDISolucionadas: number = 0;
    totalExamenesOKSolucionadas: number = 0; 
    totalExamenesOK_Red_MovilSolucionadas: number = 0;

    totalExamenesOKSolucionadasMesActual: number = 0;
    totalExamenesOK_Red_MovilSolucionadasMesActual: number = 0;
    totalExamenesDISolucionadasMesActual: number = 0;

    totalExamenesDICanceladas: number = 0;

    totalExamenesDINivelDeGestion: number = 0;

    totalExamenesDINivelDeGestionClientesCorporativos: number = 0;
    restaNivelCorporativo: number = 0;
    
  // Tabla indicadores
  displayedColumns: string[] = ['descripcion', 'valor'];
  dataSource!: MatTableDataSource<any>;  // Inicializar sin valores

  
    constructor(private examenService: ExamenService) { }
  
    ngOnInit() {
      this.obtenerExamenes();
      this.obtenerCantidadExamenesDI();      // Indicadores DI para obtener del backend

     // Inicializar `dataSource` después de obtener datos pata la tabla
    this.dataSource = new MatTableDataSource([
      { descripcion: 'Total de Demandas a Gestionar', valor: this.totalExamenesDIAGestionar },
      { descripcion: 'Total demandas insatisfechas del año en curso', valor: this.totalExamenesDIActual },
      { descripcion: 'Total demandas insatisfechas al cierre del año anterior', valor: this.totalExamenesDIAnterior },
      { descripcion: 'Total de demandas Gestionadas', valor: this.totalExamenesDIGestionadas },
      { descripcion: 'Total de DI conciliadas con Operaciones de la Red', valor: this.totalExamenesDIOperaciones },
      { descripcion: 'Total de DI conciliadas con Inversiones', valor: this.totalExamenesDIInversiones },
      { descripcion: 'Pendientes instalación de las solicitudes que estaban en DI', valor: this.totalExamenesDIReparador },
      { descripcion: 'Total DI Solucionadas', valor: this.totalExamenesDISolucionadas },
      { descripcion: 'DI Solucionadas en el mes', valor: this.totalExamenesDISolucionadasMesActual },
      { descripcion: 'DI Canceladas', valor: this.totalExamenesDICanceladas },
      { descripcion: 'Nivel de gestión de la DI', valor: this.totalExamenesDINivelDeGestion },
      { descripcion: 'Nivel de gestión de clientes corporativos', valor: this.totalExamenesDINivelDeGestionClientesCorporativos }
    ]);


    }  // fin del ngOnInit


    
    alternarPanel() {
      this.panelExpandido = !this.panelExpandido;
    }

    obtenerCantidadExamenesDI() {                // Indicadores DI  para obtener del backend           
      this.examenService.contarExamenesDI().subscribe({
        next: (data) => {
          this.totalExamenesDI = data;                       // para obtener del backend
        },
        error: (error) => {
          console.error("Error al obtener la cantidad de exámenes DI:", error);
        }
      });
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
   
     //------------*********Inicio Indicador Total demandas a Gestionar********-------------------------------
    // Calcular el total de exámenes DI del backend
    this.totalExamenesDI = this.searchResults.filter(examen => examen.estadoDeCalificacionDeLosCentros === 'DI').length;

    // Calcular el total de exámenes DI del año actual
    this.totalExamenesDIActual = this.searchResults.filter(examen => examen.estadoDeCalificacionDeLosCentros === 'DI').length;

    // Calcular el total de exámenes DI del año anterior
    this.totalExamenesDIAnterior = this.examenes.filter(examen => {
      const fechaExamen = new Date(examen.fechaDeSolicitud);
      return fechaExamen.getFullYear() === new Date().getFullYear() - 1 && examen.estadoDeCalificacionDeLosCentros === 'DI';
    }).length;

    // Sumar ambos valores Total de Demandas a Gestionar:
    this.totalExamenesDIAGestionar = this.totalExamenesDI + this.totalExamenesDIAnterior;
    //------------Fin Indicador Total demandas a Gestionar-------------------------------
    

    //------------*******Inicio Indicador Total de demandas Gestionadas********-------------------------------

    // Total de DI conciliadas con Operaciones de la Red
    this.totalExamenesDIOperaciones = this.searchResults.filter(examen => examen.evaluacion === 'Operaciones').length;
    
    // Total de DI conciliadas con Inversiones 
    this.totalExamenesDIInversiones = this.searchResults.filter(examen => examen.evaluacion === 'Inversiones').length;
    
    // Pendientes instalación de las solicitudes que estaban en DI (Son las DI pendientes de instalación por parte del reparador) 
    this.totalExamenesDIReparador = this.searchResults.filter(examen => examen.estadoDelServicio === 'Con_OS_Siprec').length;
    
   // Sumar ambos valores Total de demandas Gestionadas
   this.totalExamenesDIGestionadas = this.totalExamenesDIOperaciones + this.totalExamenesDIInversiones + this.totalExamenesDIReparador;
   
    //------------Inicio Indicador Total de demandas Gestionadas-------------------------------

   
    //------------******* Inicio Total DI  Solucionadas (Suma de las DI solucionadas (Acumulado)********-------------------------------
    // Total DI  Solucionadas (Suma de las DI solucionadas (Acumulado) hay que sumar las OK y las OK_Red_Movil segun el estadoDelServicio

    this.totalExamenesOKSolucionadas = this.searchResults.filter(examen => examen.estadoDelServicio === 'OK').length;
    this.totalExamenesOK_Red_MovilSolucionadas = this.searchResults.filter(examen => examen.estadoDelServicio === 'OK_Red_Móvil').length;
      this.totalExamenesDISolucionadas = this.totalExamenesOKSolucionadas + this.totalExamenesOK_Red_MovilSolucionadas;


      //------------******* Inicio DI  Solucionadas en el mes********-----------
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth(); // Enero es 0, Diciembre es 11
      const añoActual = fechaActual.getFullYear();

      // Filtrar exámenes del mes actual
      const examenesMesActual = this.searchResults.filter(examen => {
        const fechaExamen = new Date(examen.fechaDeSolicitud); // Suponiendo que `fecha` es un campo en `examen`
        return fechaExamen.getMonth() === mesActual && fechaExamen.getFullYear() === añoActual;
      });

      // Calcular los valores
      this.totalExamenesOKSolucionadasMesActual = examenesMesActual.filter(examen => examen.estadoDelServicio === 'OK').length;
      this.totalExamenesOK_Red_MovilSolucionadasMesActual = examenesMesActual.filter(examen => examen.estadoDelServicio === 'OK_Red_Móvil').length;
      this.totalExamenesDISolucionadasMesActual = this.totalExamenesOKSolucionadasMesActual + this.totalExamenesOK_Red_MovilSolucionadasMesActual;

      // `totalExamenesDISolucionadas` mantiene el acumulado


       //------------*********IDI canceladas e) esta mal********-------------------------------
    this.totalExamenesDICanceladas = this.searchResults.filter(examen => examen.estadoDeCalificacionDeLosCentros === 'DI').length;

    // ----------------------Nivel de gestión de la DI --------------------
    this.totalExamenesDINivelDeGestion = this.totalExamenesDIGestionadas + this.totalExamenesDISolucionadas;
    
    // ----------------------Nivel de gestión de la DI --------------------
    this.restaNivelCorporativo = this.totalExamenesDIAGestionar - this.totalExamenesDICanceladas;
    this.totalExamenesDINivelDeGestionClientesCorporativos = this.totalExamenesDINivelDeGestion / this.restaNivelCorporativo;
    
    // **Actualizar la tabla**
    this.dataSource.data = [
      { descripcion: 'Total de Demandas a Gestionar', valor: this.totalExamenesDIAGestionar },
      { descripcion: 'Total demandas insatisfechas del año en curso', valor: this.totalExamenesDIActual },
      { descripcion: 'Total demandas insatisfechas al cierre del año anterior', valor: this.totalExamenesDIAnterior },
      { descripcion: 'Total de demandas Gestionadas', valor: this.totalExamenesDIGestionadas },
      { descripcion: 'Total de DI conciliadas con Operaciones de la Red', valor: this.totalExamenesDIOperaciones },
      { descripcion: 'Total de DI conciliadas con Inversiones', valor: this.totalExamenesDIInversiones },
      { descripcion: 'Pendientes instalación de las solicitudes que estaban en DI', valor: this.totalExamenesDIReparador },
      { descripcion: 'Total DI Solucionadas', valor: this.totalExamenesDISolucionadas },
      { descripcion: 'DI Solucionadas en el mes', valor: this.totalExamenesDISolucionadasMesActual },
      { descripcion: 'DI Canceladas', valor: this.totalExamenesDICanceladas },
      { descripcion: 'Nivel de gestión de la DI', valor: this.totalExamenesDINivelDeGestion },
      { descripcion: 'Nivel de gestión de clientes corporativos', valor: this.totalExamenesDINivelDeGestionClientesCorporativos }
    ];
    
    // Reiniciar la paginación al hacer una nueva búsqueda
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

    exportarExcelIndicadores() {
      const datos = [
        { Indicador: "Total de Demandas a Gestionar", Valor: this.totalExamenesDIAGestionar },
        { Indicador: "Total demandas insatisfechas del año en curso", Valor: this.totalExamenesDIActual },
        { Indicador: "Total demandas insatisfechas al cierre del año anterior", Valor: this.totalExamenesDIAnterior },
        { Indicador: "Total de demandas Gestionadas", Valor: this.totalExamenesDIGestionadas },
        { Indicador: "Total de DI conciliadas con Operaciones de la Red", Valor: this.totalExamenesDIOperaciones },
        { Indicador: "Total de DI conciliadas con Inversiones", Valor: this.totalExamenesDIInversiones },
        { Indicador: "Pendientes instalación de solicitudes en DI", Valor: this.totalExamenesDIReparador },
        { Indicador: "Total DI Solucionadas", Valor: this.totalExamenesDISolucionadas },
        { Indicador: "DI Solucionadas en el mes", Valor: this.totalExamenesDISolucionadasMesActual },
        { Indicador: "DI Canceladas", Valor: this.totalExamenesDICanceladas },
        { Indicador: "Nivel de gestión de la DI", Valor: this.totalExamenesDINivelDeGestion },
        { Indicador: "Nivel de gestión de clientes corporativos", Valor: this.totalExamenesDINivelDeGestionClientesCorporativos }
      ];
  
      const worksheet = XLSX.utils.json_to_sheet(datos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Indicadores");
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, "Tabla_Indicadores.xlsx");
    }
  
  }  //fin
  
