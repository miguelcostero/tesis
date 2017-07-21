import { Component, ViewChild } from '@angular/core'
import { Nav, Platform, Events, AlertController } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { HeaderColor } from '@ionic-native/header-color'
import { Storage } from '@ionic/storage'
import * as firebase from 'firebase'
import { Push, PushToken } from '@ionic/cloud-angular'

import { AuthProvider } from '../providers/auth/auth'
import { EmpleadosProvider } from '../providers/empleados/empleados'

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
    private events: Events,
    private _empleados: EmpleadosProvider,
    private storage: Storage,
    public push: Push,
    private alertCtrl: AlertController
  ) {
    this.initializeApp()
    this.checkLogin()
    this.subscribeToEvents()

    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Perfil', component: PerfilPage },
      { title: 'Clientes', component: ClientesPage },
      { title: 'Locaciones', component: LocacionesPage },
      { title: 'Talentos', component: TalentosPage }
    ]

    this.empleadosPage = { title: 'Empleados', component: EmpleadosPage }

    this.platform.ready().then(() => {
      this.registerToken()
      this.getNotifications()
    })
  }

  private registerToken(){
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t, {
        ignore_user: true
      })
    }).then((t: PushToken) => {
      console.log('Token saved:', t.token)
    })
  }

  private getNotifications(){
    this.push.rx.notification().subscribe(msg => {
      let alert = this.alertCtrl.create({
        title: msg.title,
        message: msg.text,
        buttons: ['Cerrar']
      })
      alert.present()
    })
  }

  private initializeFirebase () {
    const firebaseConfig = {
      apiKey: 'AIzaSyAaJEYQox-nue8aBp9uRLt6Y8sNrPDWyzs',
      authDomain: 'tesis-7ffec.firebaseapp.com',
      databaseURL: 'https://tesis-7ffec.firebaseio.com',
      projectId: 'tesis-7ffec',
      storageBucket: 'tesis-7ffec.appspot.com',
      messagingSenderId: '243420000366'
    }
    firebase.initializeApp(firebaseConfig)
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(true)
      this.statusBar.backgroundColorByHexString(this.mainColor)
      this.headerColor.tint(this.mainColor)
      this.splashScreen.hide()
      this.initializeFirebase()
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

    this.events.subscribe('empleado:updated', time => {
      console.log('Empleado updated at ' + time)
      this.storage.get('auth').then(auth => {
        this._empleados.getEmpleado(auth.id, auth.token).subscribe(perfil => {
          let p = perfil.json()[0]
          this.empladoLogged = p
          this.storage.set('auth', {
            id: auth.id,
            token: auth.token,
            email: p.email,
            nombre: p.nombre,
            apellido: p.apellido,
            fecha_nacimiento: p.fecha_nacimiento,
            img_perfil: p.img_perfil,
            telefonos: p.telefonos,
            role: p.role
          })
        }, err => console.error('ERROR', err))
      })
    })
  }

  private checkLogin () {
    // Check if user is logged
    this.auth.checkLogin().then(auth => {
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
