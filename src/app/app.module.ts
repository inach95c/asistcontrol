import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SignupComponent } from './page/signup/signup.component';
import { LoginComponent } from './page/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { authInterceptorProviders } from './services/auth.interceptor';
import { DashboardComponent } from './page/admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './page/user/user-dashboard/user-dashboard.component';
import { ProfileComponent } from './page/profile/profile.component';

import {MatListModule} from '@angular/material/list';
import { SidebarComponent } from './page/admin/sidebar/sidebar.component';
import { WelcomeComponent } from './page/admin/welcome/welcome.component';
import { WelcomeclsComponent } from './page/admin/welcomecls/welcomecls.component';
import { ViewCategoriasComponent } from './page/admin/view-categorias/view-categorias.component';
import { AddCategoriaComponent } from './page/admin/add-categoria/add-categoria.component';
import { ViewExamenesComponent } from './page/admin/view-examenes/view-examenes.component';
import { AddExamenComponent } from './page/admin/add-examen/add-examen.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { ActualizarExamenComponent } from './page/admin/actualizar-examen/actualizar-examen.component';
import { ViewExamenPreguntasComponent } from './page/admin/view-examen-preguntas/view-examen-preguntas.component';
import { AddPreguntaComponent } from './page/admin/add-pregunta/add-pregunta.component';
import { ActualizarPreguntaComponent } from './page/admin/actualizar-pregunta/actualizar-pregunta.component';
import { SidebarComponent as UserSidebar} from './page/user/sidebar/sidebar.component';
import { LoadExamenComponent } from './page/user/load-examen/load-examen.component';
import { InstrucionesComponent } from './page/user/instruciones/instruciones.component';
import { InstruccionesComponent } from './page/user/instrucciones/instrucciones.component';
import { StartComponent } from './page/user/start/start.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ActualizarCategoriaComponent } from './page/admin/actualizar-categoria/actualizar-categoria.component';
import { OperacionesComponent } from './page/user/operaciones/operaciones.component';
import { InversionesComponent } from './page/user/inversiones/inversiones.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http'; // Importa la constante necesaria
import { DateInterceptor } from './interceptors/date.interceptor';
import { BuscarComponent } from './page/buscar/buscar.component'; // Importa tu interceptor de fechas

//import { AuthInterceptor } from './interceptors/authBuscar.interceptor';

//import { NgxUiLoaderModule , NgxUiLoaderHttpModule } from "ngx-ui-loader";      //esto es para mostrar el progreso circular
import {MatBadgeModule} from '@angular/material/badge';
import { ReportesComponent } from './page/reportes/reportes.component';
import {MatExpansionModule} from '@angular/material/expansion';

import { RouterModule } from '@angular/router';
import { IndicadoresComponent } from './page/indicadores/indicadores.component'; 
import { MatTableModule } from '@angular/material/table';
import { DetalleExamenDialogComponent } from './page/detalle-examen-dialog/detalle-examen-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DetalleLoadDialogComponent } from './page/detalle-load-dialog/detalle-load-dialog.component';
import { UsuarioComponent } from './page/admin/usuario/usuario.component';
import { IndicadoresUserComponent } from './page/user/indicadores-user/indicadores-user.component';
import { ReportesUserComponent } from './page/user/reportes-user/reportes-user.component';
import { MatPaginatorModule } from '@angular/material/paginator';

import { LoginAsistenciaComponent } from './page/user/login-asistencia/login-asistencia.component';

import { MatRadioModule } from '@angular/material/radio';
import { ProfileUserComponent } from './page/user/profile-user/profile-user.component';
import { AdminAsistenciaComponent } from './page/admin/admin-asistencia/admin-asistencia.component';
import { HistorialComponent } from './page/user/historial/historial.component';
import { HistorialUserComponent } from './page/user/historial-user/historial-user.component';
import { Historial1Component } from './page/user/historial1/historial1.component';
import { AsistenciaAdminComponent } from './page/admin/asistencia-admin/asistencia-admin.component';
import { EstadisticasAsisteciaComponent } from './page/admin/estadisticas-asistecia/estadisticas-asistecia.component';

//import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { MatSortModule } from '@angular/material/sort';
import { AsignarHorarioComponent } from './page/admin/asignar-horarios/asignar-horarios.component';
import { ResumenHorariosComponent } from './page/admin/resumen-horarios/resumen-horarios.component';
import { DialogoEditarHorarioComponent } from './page/admin/dialogo-editar-horario/dialogo-editar-horario.component';
import { DialogoAsistenciaComponent } from './page/admin/dialogo-asistencia/dialogo-asistencia.component';
import { EmpleadosComponent } from './page/admin/empleados/empleados.component';
import { RegistroAsistenciaDiariaComponent } from './page/admin/registro-asistencia-diaria/registro-asistencia-diaria.component';
import { HorasTrabajadasMensualmenteComponent } from './page/admin/horas-trabajadas-mensualmente/horas-trabajadas-mensualmente.component';
import { InasistenciasComponent } from './page/admin/inasistencias/inasistencias.component';
import { HorasExtrasComponent } from './page/admin/horas-extras/horas-extras.component';
import { QrScanComponent } from './page/user/qr-scan/qr-scan.component';
import { KioskAsistenciaComponent } from './kiosk-asistencia/kiosk-asistencia.component';
import { QrPersonalComponent } from './page/user/qr-personal/qr-personal.component';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HorarioPersonalComponent } from './page/user/horario-personal/horario-personal.component';

import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { UserLayoutComponent } from './page/user/user-layout/user-layout.component';
import { DialogoAsignarHorarioComponent } from './page/admin/dialogo-usuario-multiple/dialogo-usuario-multiple.component';
import { PorcentajePorUsuarioComponent } from './page/admin/porcentaje-por-usuario/porcentaje-por-usuario.component';
import { ConfiguracionHorarioComponent } from './page/admin/configuracion-horario/configuracion-horario.component';
import { ResumenSalarioMensualComponent } from './page/admin/resumen-salario-mensual/resumen-salario-mensual.component';
import { ResumenSalarioPersonalComponent } from './page/user/resumen-salario-personal/resumen-salario-personal.component';
//import { DialogoUsuarioMultipleComponent } from './page/admin/dialogo-usuario-multiple/dialogo-usuario-multiple.component';







@NgModule({
  declarations: [
    
    AppComponent,
    NavbarComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    UserDashboardComponent,
    ProfileComponent,
    SidebarComponent,
    WelcomeComponent,
    WelcomeclsComponent,
    ViewCategoriasComponent,
    AddCategoriaComponent,
    ViewExamenesComponent,
    AddExamenComponent,
    ActualizarExamenComponent,
    ViewExamenPreguntasComponent,
    AddPreguntaComponent,
    ActualizarPreguntaComponent,
    UserSidebar,
    LoadExamenComponent,
    InstrucionesComponent,
    InstruccionesComponent,
    StartComponent,
    ActualizarCategoriaComponent,
    OperacionesComponent,
    InversionesComponent,
    BuscarComponent,
    ReportesComponent,
    IndicadoresComponent,
    DetalleExamenDialogComponent,
    DetalleLoadDialogComponent,
    UsuarioComponent,
    IndicadoresUserComponent,
    ReportesUserComponent,
    LoginAsistenciaComponent,
    ProfileUserComponent,
    AdminAsistenciaComponent,
    HistorialComponent,
    HistorialUserComponent,
    Historial1Component,
    AsistenciaAdminComponent,
    EstadisticasAsisteciaComponent,
    AsignarHorarioComponent,
    ResumenHorariosComponent,
    DialogoEditarHorarioComponent,
    DialogoAsistenciaComponent,
    EmpleadosComponent,
    RegistroAsistenciaDiariaComponent,
    HorasTrabajadasMensualmenteComponent,
    InasistenciasComponent,
    HorasExtrasComponent,
    QrScanComponent,
    KioskAsistenciaComponent,
    QrPersonalComponent,
    HorarioPersonalComponent,
    UserLayoutComponent,
    DialogoAsignarHorarioComponent,
    PorcentajePorUsuarioComponent,
    ConfiguracionHorarioComponent,
    ResumenSalarioMensualComponent,
    ResumenSalarioPersonalComponent
   
    
    
   
    //ActualizarCategoriasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatBadgeModule,                   // esto es para la insignia
    MatExpansionModule,               // esto es para expandir el panel
    RouterModule,
    MatTableModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    //MatSnackBar,
       
    //NgxUiLoaderModule,                         //esto es para mostrar el progreso circular abajo too
    //NgxUiLoaderHttpModule
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSortModule,
    CommonModule, 
    MatSidenavModule,
    BrowserAnimationsModule,
    //ZXingScannerModule 
  ],
  providers: [
    authInterceptorProviders, // Tu interceptor de autenticación existente
    { provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true }, // Aquí registras el interceptor de fecha
   // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }   // txd para validar el token en el backend   
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }   // 👈 Este agrega el token JWT a cada request         
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
