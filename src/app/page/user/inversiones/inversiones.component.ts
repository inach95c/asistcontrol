import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntaService } from '../../../services/pregunta.service';
import Swal from 'sweetalert2';
import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inversiones',
  templateUrl: './inversiones.component.html',
  styleUrls: ['./inversiones.component.css']
})
export class InversionesComponent implements OnInit {

 examenId:any;
   preguntas:any;              //original
   puntosConseguidos = 0;
   respuestasCorrectas = 0;
   intentos = 0;
   //velocidad =0;                       //txd
   estadoDeCalificacionDeLosCentros =0;  //txd
 
   esEnviadoInversiones = false;              //txd
   timer:any;

   preguntaId:any = 0;              //txd
   pregunta:any;                  //txd
   
 
   constructor(
     private route:ActivatedRoute,
     private preguntaService:PreguntaService,
     private router:Router,
     ) { }

  
 
   ngOnInit(): void {
   //  this.prevenirElBotonDeRetroceso();          
     this.examenId = this.route.snapshot.params['examenId'];
     console.log(this.examenId);
     this.cargarPreguntas();
//------------------------------------txd------------------------------
     this.preguntaId = this.route.snapshot.params['preguntaId'];
    this.preguntaService.obtenerPregunta(this.preguntaId).subscribe(
      (data:any) => {
        this.preguntas = data;
        console.log(this.preguntas);
      },
      (error) => {
        console.log(error);
      }
    )
//-----------------------------txd-------------------------------------
   }// ngOnInit
 
   cargarPreguntas(){
     this.preguntaService.listarPreguntasDelExamenParaLaPrueba(this.examenId).subscribe(
       (data:any) => {
         console.log(data);
         this.preguntas = data;
 
         this.timer = this.preguntas.length *2 * 60;
 
         this.preguntas.forEach((p:any) => {
           p['respuestaDada'] = '';
           
         })
         console.log(this.preguntas);
     //    this.iniciarTemporizador();                          //esto es para activar el temporizador
       },
       (error) => {
         console.log(error);
         Swal.fire('Error','Error al cargar las preguntas de la prueba','error');
       }
     )
   }
 
 
   iniciarTemporizador(){
     let t = window.setInterval(() => {
       if(this.timer <= 0){
         this.evaluarExamen();
         clearInterval(t);
       }else{
         this.timer --;
       }
     },1000)
   }
 /*
   prevenirElBotonDeRetroceso(){
     history.pushState(null,null!,location.href);
     this.locationSt.onPopState(() => {
       history.pushState(null,null!,location.href);
     })
   }
 */
   enviarCuestionario(){
     Swal.fire({
       title: '¿Quieres enviar el examen?',
       showCancelButton: true,
       cancelButtonText:'Cancelar',
       confirmButtonText: 'Enviar',
       icon:'info'
     }).then((e) => {
       if(e.isConfirmed){
         this.evaluarExamen();
         
       }
     })    
   }
 
   evaluarExamen(){
     this.preguntaService.evaluarExamen(this.preguntas).subscribe(
       (data:any) => {
         console.log(data);
         this.puntosConseguidos = data.puntosMaximos;
         this.respuestasCorrectas = data.respuestasCorrectas;
         this.intentos = data.intentos;

         this.estadoDeCalificacionDeLosCentros = data.estadoDeCalificacionDeLosCentros;  //txd
         
         this.esEnviadoInversiones = true;

          //   this.velocidad = data.velocidad;                          //txd
        
   //      this.actualizarDatosDeLaPregunta();            //txd
      
         
       },
       (error) => {
         console.log(error);
       }
     )
     /*this.esEnviado = true;
     this.preguntas.forEach((p:any) => {
       if(p.respuestaDada == p.respuesta){
         this.respuestasCorrectas ++;
         let puntos = this.preguntas[0].examen.puntosMaximos/this.preguntas.length;
         this.puntosConseguidos += puntos;
       }
 
       if(p.respuestaDada.trim() != ''){
         this.intentos ++;
       }
     });
 
     console.log("Respuestas correctas : " + this.respuestasCorrectas);
     console.log("Puntos conseguidos : " + this.puntosConseguidos);
     console.log("Intentos : " + this.intentos);
     console.log(this.preguntas);*/
   }
 
   obtenerHoraFormateada(){
     let mm = Math.floor(this.timer/60);
     let ss = this.timer - mm*60;
     return `${mm} : min : ${ss} seg`;
   }
 
   imprimirPagina(){
     window.print();
   }

   public actualizarDatosDeLaPregunta(){
       this.preguntaService.actualizarPregunta(this.preguntas).subscribe(
         (data) => {
           Swal.fire('Pregunta actualizada','La pregunta ha sido actualizada con éxito','success').then((e) => {
             this.router.navigate(['/admin/ver-preguntas/'+this.preguntas.examen.examenId+'/'+this.preguntas.examen.titulo]);
           })
         }
       )
     }

     
 
}