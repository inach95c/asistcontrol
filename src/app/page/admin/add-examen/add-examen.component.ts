import { Component, OnInit } from '@angular/core';
//import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaService } from './../../../services/categoria.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { ExamenService } from 'src/app/services/examen.service';
import { ExamenService } from './../../../services/examen.service';
import { Router } from '@angular/router';
//import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-add-examen',
  templateUrl: './add-examen.component.html',
  styleUrls: ['./add-examen.component.css']
  
})
export class AddExamenComponent implements OnInit {

  prioridad = 'Nínguno';                                            //txd de boton select
  categoriaDelCliente = 'Sin Clasificación';
  organismo = 'otro';

  categorias:any = [];

  examenData = {
    titulo:'',
    descripcion:'',
    puntosMaximos:'',
    numeroDePreguntas:'',
    activo:true,
    categoria:{
      categoriaId:''
    },
    prioridad:'' ,                                                //txd
    categoriaDelCliente:'',
    organismo:'',
    entidad:'',
    numeroDeSolicitud:'',
    seguimiento:'',
    municipio:'',
    consejoPopular:'',
    direccion:'',
    telefonoDeContacto:'',
    solicitud:'',
    velocidad:'',
    enlace:'',
    noAdsl:'',
    cuota:'',
    costoDeInstalacion:'',
    estadoDelServicio:'',
    tipoDeServicio:'',
         instalada:'',
         programaProyecto:'',
   fechaDeSolicitud: new Date(), // Fecha actual como valor inicial 

   // OPERACIONES
   estadoDeCalificacionDeLosCentros:'',
   observacion:'',
   evaluacion:'',  
   observacionesEspecialistaDeOperaciones:'',
   OfechaRespuestaCalificacionOperaciones: new Date(), // Fecha actual como valor inicial

  // INVERSIONES
  propuestaDeSoluionTecnica:'',
  tipoDeRecursosADemandar:'',
  fechaDeEjecucionEstimadaAProponer: new Date(), // Fecha actual como valor inicial
  observacionEspInversiones:'',

  }

  constructor(
    private categoriaService:CategoriaService,
    private snack:MatSnackBar,
    private examenService:ExamenService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.categoriaService.listarCategorias().subscribe(
      (dato:any) => {
        this.categorias = dato;
        console.log(this.categorias);
      },(error) => {
        console.log(error);
        Swal.fire('Error !!','Error al cargar los datos','error');
      }
    )
  }


  guardarCuestionario(){
 /*   const datosExamen = {             //txd
      ...this.examenData,                                      //txd
      fechaDeSolicitud: new Date(this.examenData.fechaDeSolicitud).toISOString().split('T')[0]     //txd
    };
*/
    console.log(this.examenData);
    fechaDeSolicitud: new Date(this.examenData.fechaDeSolicitud)                    //ojo para la fecha
    if(this.examenData.titulo.trim() == '' || this.examenData.titulo == null){
      this.snack.open('Por favor rellenar los campos requeridos','',{
        duration:3000
      });
      return ;
    }

    this.examenService.agregarExamen(this.examenData).subscribe(
      (data) => {
        console.log(data);
        Swal.fire('solicitud guardada','La solicitud ha sido guardada con éxito','success');
        this.examenData = {
          titulo : '',
          descripcion : '',
          puntosMaximos : '',
          numeroDePreguntas : '',
          activo:true,
          categoria:{
            categoriaId:''
          },
          prioridad:'',                                       //txd
          categoriaDelCliente:'',
          organismo:'',
          entidad:'',
          numeroDeSolicitud:'',
          seguimiento:'',
          municipio:'',
          consejoPopular:'',
          direccion:'',
          telefonoDeContacto:'',
          solicitud:'',
          velocidad:'',
          enlace:'',
          noAdsl:'',
          cuota:'',
          costoDeInstalacion:'',
          estadoDelServicio:'',
          tipoDeServicio:'',
         instalada:'',
         programaProyecto:'',
         fechaDeSolicitud: new Date(), // Fecha actual como valor inicial
         

        // OPERACIONES
        estadoDeCalificacionDeLosCentros:'',
        observacion:'',
        evaluacion:'',  
        observacionesEspecialistaDeOperaciones:'',
        OfechaRespuestaCalificacionOperaciones: new Date(), // Fecha actual como valor inicial
         
      // INVERSIONES
           propuestaDeSoluionTecnica:'',
           tipoDeRecursosADemandar:'',
          fechaDeEjecucionEstimadaAProponer: new Date(), // Fecha actual como valor inicial
           observacionEspInversiones:'',
          
        }
        this.router.navigate(['/admin/examenes']);
      },
      (error) => {
        Swal.fire('Error','Error al guardar la solicitud','error');
      }
    )

  }  


}
