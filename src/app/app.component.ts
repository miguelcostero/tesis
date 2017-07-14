import { Component, ViewChild } from '@angular/core'
import { Nav, Platform, LoadingController, Events } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { HeaderColor } from '@ionic-native/header-color'

import { AuthProvider } from '../providers/auth/auth'

import { HomePage } from '../pages/home/home'
import { LoginPage } from '../pages/login/login'
import { EmpleadosPage } from '../pages/empleados/empleados'
import { ClientesPage } from '../pages/clientes/clientes'
import { LocacionesPage } from '../pages/locaciones/locaciones'
import { TalentosPage } from '../pages/talentos/talentos'
import { PerfilPage } from '../pages/perfil/perfil'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav

  rootPage: any = HomePage

  empladoLogged: any

  pages: Array<{title: string, component: any}>

  private mainColor: string = '#0D47A1'
  private isAdmin: boolean = false
  private empleadosPage: { title: string, component: any }

  constructor(
    private platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    private auth: AuthProvider,
    private headerColor: HeaderColor,
    private loadingCtrl: LoadingController,
    private events: Events
  ) {
    this.initializeApp()
    this.checkLogin()
    this.subscribeToEvents()

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Perfil', component: PerfilPage },
      { title: 'Clientes', component: ClientesPage },
      { title: 'Locaciones', component: LocacionesPage },
      { title: 'Talentos', component: TalentosPage }
    ]

    this.empleadosPage = { title: 'Empleados', component: EmpleadosPage }
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(true)
      this.statusBar.backgroundColorByHexString(this.mainColor)
      this.headerColor.tint(this.mainColor)
      this.splashScreen.hide()
    })
  }

  private subscribeToEvents () {
    this.events.subscribe('empleado:login', (empleado, time) => {
      console.log('Empleado logged in at ' + time)
      this.empladoLogged = empleado
      this.isAdmin = this.empladoLogged.role.id === '2' || this.empladoLogged.role.id === '3' ? true : false
    })

    this.events.subscribe('empleado:logout', time => {
      console.log('Empleado logged out at ' + time)
      this.empladoLogged = null
    })
  }

  private checkLogin () {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    })
    loading.present()
    // Check if user is logged
    this.auth.checkLogin().then(auth => {
      loading.dismissAll()
      this.empladoLogged = auth
      this.isAdmin = this.empladoLogged.role.id === '2' || this.empladoLogged.role.id === '3' ? true : false
    }).catch(err => {
      console.error('ERROR AL CHECKEAR LOGIN', err)
      this.nav.setRoot(LoginPage)
    })
  }

  logout () {
    this.auth.logout()
    this.nav.setRoot(LoginPage)    
  }

  openPage (page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component)
  }
}
