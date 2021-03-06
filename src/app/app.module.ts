import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule }   from '@angular/forms'
import { HttpModule } from '@angular/http'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular'
import { IonicStorageModule } from '@ionic/storage'
import { CallNumber } from '@ionic-native/call-number'
import { CloudSettings, CloudModule } from '@ionic/cloud-angular'

import { MyApp } from './app.component'
import { HomePage } from '../pages/home/home'
import { LoginPage } from '../pages/login/login'
import { ResetPasswordPage } from '../pages/reset-password/reset-password'
import { EmpleadosPage } from '../pages/empleados/empleados'
import { ClientesPage } from '../pages/clientes/clientes'
import { LocacionesPage } from '../pages/locaciones/locaciones'
import { TalentosPage } from '../pages/talentos/talentos'
import { PerfilPage } from '../pages/perfil/perfil'

import { EventoDetallesPage } from '../pages/evento-detalles/evento-detalles'
import { CrearEventoPage } from '../pages/crear-evento/crear-evento'
import { EditarEventoPage } from '../pages/editar-evento/editar-evento'

import { CrearClientePage } from '../pages/crear-cliente/crear-cliente'
import { DetallesClientePage } from '../pages/detalles-cliente/detalles-cliente'
import { EditarClientePage } from '../pages/editar-cliente/editar-cliente'

import { DetallesLocacionPage } from '../pages/detalles-locacion/detalles-locacion'
import { CrearLocacionPage } from '../pages/crear-locacion/crear-locacion'
import { EditarLocacionPage } from '../pages/editar-locacion/editar-locacion'

import { CrearTalentoPage } from '../pages/crear-talento/crear-talento'
import { EditarTalentoPage } from '../pages/editar-talento/editar-talento'
import { DetallesTalentoPage } from '../pages/detalles-talento/detalles-talento'

import { DetallesEmpleadoPage } from '../pages/detalles-empleado/detalles-empleado'
import { EditarEmpleadoPage } from '../pages/editar-empleado/editar-empleado'
import { CrearEmpleadoPage } from '../pages/crear-empleado/crear-empleado'

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { Toast } from '@ionic-native/toast'
import { HeaderColor } from '@ionic-native/header-color'
import { Camera } from '@ionic-native/camera'

import { AuthProvider } from '../providers/auth/auth'
import { PerfilProvider } from '../providers/perfil/perfil'
import { EventosProvider } from '../providers/eventos/eventos'
import { ModalCronogramaEventoComponent } from '../components/modal-cronograma-evento/modal-cronograma-evento'
import { TelefonoPipe } from '../pipes/telefono/telefono'
import { TimePipe } from '../pipes/time/time'
import { ResetPasswordProvider } from '../providers/reset-password/reset-password'
import { SeleccionarEstadoEventoComponent } from '../components/seleccionar-estado-evento/seleccionar-estado-evento'
import { SeleccionarLocacionEventoComponent } from '../components/seleccionar-locacion-evento/seleccionar-locacion-evento'
import { SeleccionarClienteEventoComponent } from '../components/seleccionar-cliente-evento/seleccionar-cliente-evento'
import { SeleccionarTipoEventoComponent } from '../components/seleccionar-tipo-evento/seleccionar-tipo-evento'
import { ClientesProvider } from '../providers/clientes/clientes'
import { TipoEventoProvider } from '../providers/tipo-evento/tipo-evento'
import { EstadoEventoProvider } from '../providers/estado-evento/estado-evento'
import { LocacionesProvider } from '../providers/locaciones/locaciones'
import { TelefonosProvider } from '../providers/telefonos/telefonos'
import { EmpleadosProvider } from '../providers/empleados/empleados'
import { SeleccionarTalentoEventoComponent } from '../components/seleccionar-talento-evento/seleccionar-talento-evento'
import { TalentosProvider } from '../providers/talentos/talentos'

const cloudSettings: CloudSettings = {
  core: {
    app_id: '470166f4'
  },
  push: {
    sender_id: '243420000366',
    pluginConfig: {
      ios: {
        badge: true,
        sound: true
      },
      android: {
        iconColor: '#1976D2',
        forceShow: true
      }
    }
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ResetPasswordPage,
    ClientesPage,
    LocacionesPage,
    TalentosPage,
    EmpleadosPage,
    PerfilPage,
    EventoDetallesPage,
    CrearEventoPage,
    EditarEventoPage,
    CrearClientePage,
    DetallesClientePage,
    EditarClientePage,
    DetallesLocacionPage,
    CrearLocacionPage,
    EditarLocacionPage,
    CrearTalentoPage,
    EditarTalentoPage,
    DetallesTalentoPage,
    DetallesEmpleadoPage,
    EditarEmpleadoPage,
    CrearEmpleadoPage,
    ModalCronogramaEventoComponent,
    TelefonoPipe,
    TimePipe,
    SeleccionarEstadoEventoComponent,
    SeleccionarLocacionEventoComponent,
    SeleccionarClienteEventoComponent,
    SeleccionarTipoEventoComponent,
    SeleccionarTalentoEventoComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ],
      monthShortNames: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sept',
        'Oct',
        'Nov',
        'Dic'
      ]
    }),
    IonicStorageModule.forRoot({
      name: '__tp'
    }),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ResetPasswordPage,
    ClientesPage,
    LocacionesPage,
    TalentosPage,
    EmpleadosPage,
    PerfilPage,
    EventoDetallesPage,
    CrearEventoPage,
    EditarEventoPage,
    CrearClientePage,
    DetallesClientePage,
    EditarClientePage,
    DetallesLocacionPage,
    CrearLocacionPage,
    EditarLocacionPage,
    CrearTalentoPage,
    EditarTalentoPage,
    DetallesTalentoPage,
    DetallesEmpleadoPage,
    EditarEmpleadoPage,
    CrearEmpleadoPage,
    ModalCronogramaEventoComponent,
    SeleccionarEstadoEventoComponent,
    SeleccionarLocacionEventoComponent,
    SeleccionarClienteEventoComponent,
    SeleccionarTipoEventoComponent,
    SeleccionarTalentoEventoComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Toast,
    HeaderColor,
    CallNumber,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    PerfilProvider,
    EventosProvider,
    ResetPasswordProvider,
    ClientesProvider,
    TipoEventoProvider,
    EstadoEventoProvider,
    LocacionesProvider,
    TelefonosProvider,
    EmpleadosProvider,
    TalentosProvider
  ]
})
export class AppModule {}
