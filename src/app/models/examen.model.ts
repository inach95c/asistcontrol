export interface Examen {
    examenId: number;
    titulo: string;
    descripcion: string;
    categoria: {
      titulo: string;
    };
    prioridad: string;
    categoriaDelCliente: string;
    organismo: string;
    numeroDeSolicitud: string;
    seguimiento: string;
    municipio: string;
    consejoPopular: string;
    direccion: string;
    telefonoDeContacto: string;
    solicitud: string;
    velocidad: string;
    enlace: string;
    noAdsl: string;
    cuota: string;
    costoDeInstalacion: string;
    estadoDelServicio: string;
    estadoDeCalificacionDeLosCentros: string;
    evaluacion: string;
    propuestaDeSoluionTecnica: string;
    tipoDeRecursosADemandar: string;
    fechaDeSolicitud: string;
    fechaRespuestaCalificacionOperaciones: string;
    fechaDeEjecucionEstimadaAProponer: string;
    
  }
  