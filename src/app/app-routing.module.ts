import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// 🔹 Componentes públicos
import { HomeComponent } from './page/home/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { SignupComponent } from './page/signup/signup.component';

// 🔹 Guardas
import { AdminGuard } from './services/admin.guard';
import { NormalGuard } from './services/normal.guard';

// 🔹 Componentes del Admin
import { DashboardComponent } from './page/admin/dashboard/dashboard.component';
import { WelcomeComponent } from './page/admin/welcome/welcome.component';
import { ProfileComponent } from './page/profile/profile.component';
import { ViewCategoriasComponent } from './page/admin/view-categorias/view-categorias.component';
import { AddCategoriaComponent } from './page/admin/add-categoria/add-categoria.component';
import { ActualizarCategoriaComponent } from './page/admin/actualizar-categoria/actualizar-categoria.component';
import { ViewExamenesComponent } from './page/admin/view-examenes/view-examenes.component';
import { AddExamenComponent } from './page/admin/add-examen/add-examen.component';
import { ActualizarExamenComponent } from './page/admin/actualizar-examen/actualizar-examen.component';
import { ViewExamenPreguntasComponent } from './page/admin/view-examen-preguntas/view-examen-preguntas.component';
import { AddPreguntaComponent } from './page/admin/add-pregunta/add-pregunta.component';
import { ActualizarPreguntaComponent } from './page/admin/actualizar-pregunta/actualizar-pregunta.component';
import { UsuarioComponent } from './page/admin/usuario/usuario.component';
import { AsistenciaAdminComponent } from './page/admin/asistencia-admin/asistencia-admin.component';
import { EstadisticasAsisteciaComponent } from './page/admin/estadisticas-asistecia/estadisticas-asistecia.component';
import { AsignarHorarioComponent } from './page/admin/asignar-horarios/asignar-horarios.component';
import { ResumenHorariosComponent } from './page/admin/resumen-horarios/resumen-horarios.component';
import { EmpleadosComponent } from './page/admin/empleados/empleados.component';
import { RegistroAsistenciaDiariaComponent } from './page/admin/registro-asistencia-diaria/registro-asistencia-diaria.component';
import { HorasTrabajadasMensualmenteComponent } from './page/admin/horas-trabajadas-mensualmente/horas-trabajadas-mensualmente.component';
import { InasistenciasComponent } from './page/admin/inasistencias/inasistencias.component';
import { HorasExtrasComponent } from './page/admin/horas-extras/horas-extras.component';
import { ReportesComponent } from './page/reportes/reportes.component';
import { IndicadoresComponent } from './page/indicadores/indicadores.component';


// 🔹 Componentes del usuario
import { UserLayoutComponent } from './page/user/user-layout/user-layout.component';
import { SidebarComponent } from './page/user/sidebar/sidebar.component';
import { UserDashboardComponent } from './page/user/user-dashboard/user-dashboard.component';
import { LoadExamenComponent } from './page/user/load-examen/load-examen.component';
import { InstruccionesComponent } from './page/user/instrucciones/instrucciones.component';
import { StartComponent } from './page/user/start/start.component';
import { OperacionesComponent } from './page/user/operaciones/operaciones.component';
import { InversionesComponent } from './page/user/inversiones/inversiones.component';
import { BuscarComponent } from './page/buscar/buscar.component';
import { IndicadoresUserComponent } from './page/user/indicadores-user/indicadores-user.component';
import { ReportesUserComponent } from './page/user/reportes-user/reportes-user.component';
import { LoginAsistenciaComponent } from './page/user/login-asistencia/login-asistencia.component';
import { ProfileUserComponent } from './page/user/profile-user/profile-user.component';
import { HistorialComponent } from './page/user/historial/historial.component';
import { HistorialUserComponent } from './page/user/historial-user/historial-user.component';
import { Historial1Component } from './page/user/historial1/historial1.component';
import { QrPersonalComponent } from './page/user/qr-personal/qr-personal.component';
import { HorarioPersonalComponent } from './page/user/horario-personal/horario-personal.component';

// 🔹 Otros
import { KioskAsistenciaComponent } from './kiosk-asistencia/kiosk-asistencia.component';
import { PorcentajePorUsuarioComponent } from './page/admin/porcentaje-por-usuario/porcentaje-por-usuario.component';
import { ConfiguracionHorarioComponent } from './page/admin/configuracion-horario/configuracion-horario.component';
import { ResumenSalarioMensualComponent } from './page/admin/resumen-salario-mensual/resumen-salario-mensual.component';
import { ResumenSalarioPersonalComponent } from './page/user/resumen-salario-personal/resumen-salario-personal.component';

const routes: Routes = [
  //{ path: '', component: HomeComponent, pathMatch: 'full' },
 
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // 🔐 ADMIN layout y rutas hijas
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: WelcomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'usuarios', component: UsuarioComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'categorias', component: ViewCategoriasComponent },
      { path: 'add-categoria', component: AddCategoriaComponent },
      { path: 'categoria/:categoriaId', component: ActualizarCategoriaComponent },
      { path: 'examenes', component: ViewExamenesComponent },
      { path: 'add-examen', component: AddExamenComponent },
      { path: 'examen/:examenId', component: ActualizarExamenComponent },
      { path: 'ver-preguntas/:examenId/:titulo', component: ViewExamenPreguntasComponent },
      { path: 'add-pregunta/:examenId/:titulo', component: AddPreguntaComponent },
      { path: 'pregunta/:preguntaId', component: ActualizarPreguntaComponent },
      { path: 'indicadores', component: IndicadoresComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'asistencia-admin', component: AsistenciaAdminComponent },
      { path: 'estadisticas-asistecia', component: EstadisticasAsisteciaComponent },
      { path: 'asignar-horarios/:id', component: AsignarHorarioComponent },
      { path: 'resumen-horarios', component: ResumenHorariosComponent },
      { path: 'empleados', component: EmpleadosComponent },
      { path: 'registro-asistencia-diaria', component: RegistroAsistenciaDiariaComponent },
      { path: 'horas-trabajadas-mensualmente', component: HorasTrabajadasMensualmenteComponent },
      { path: 'inasistencias', component: InasistenciasComponent },
      { path: 'horas-extras', component: HorasExtrasComponent },
      { path: 'porcentaje-por-usuario', component:     PorcentajePorUsuarioComponent },
      { path: 'configuracion-horario', component:    ConfiguracionHorarioComponent },
      { path: 'resumen-salario-mensual', component:    ResumenSalarioMensualComponent },
      { path: 'kiosk-asistencia', component: KioskAsistenciaComponent },
        { path: '**', redirectTo: 'home' }
  
    ]
  },

  // 👤 USER layout con rutas hijas
  {
    path: 'user-dashboard',
    component: UserLayoutComponent,
    canActivate: [NormalGuard],
    children: [
      { path: '', component: UserDashboardComponent },
      { path: ':catId', component: LoadExamenComponent },
      { path: 'instrucciones/:examenId', component: InstruccionesComponent },
      { path: 'start/:examenId', component: StartComponent },
      { path: 'operaciones/:examenId', component: OperacionesComponent },
      { path: 'inversiones/:examenId', component: InversionesComponent },
      { path: 'user/reportes-user', component: ReportesUserComponent },
      { path: 'user/indicadores-user', component: IndicadoresUserComponent },
      { path: 'buscar', component: BuscarComponent },
      { path: 'user/login-asistencia', component: LoginAsistenciaComponent },
      { path: 'user/profile-user', component: ProfileUserComponent },
      { path: 'user/historial', component: HistorialComponent },
      { path: 'user/historial-user', component: HistorialUserComponent },
      { path: 'user/historial1', component: Historial1Component },
      { path: 'user/qr-personal', component: QrPersonalComponent },
      { path: 'user/horario-personal', component: HorarioPersonalComponent },
      { path: 'user/resumen-salario-personal', component: ResumenSalarioPersonalComponent },
    ]
  },

  // 🧩 Accesos independientes
 // { path: 'kiosk-asistencia', component: KioskAsistenciaComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule {}
