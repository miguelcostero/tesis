import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, LoadingController, AlertController, Platform } from 'ionic-angular'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SplashScreen } from '@ionic-native/splash-screen'
import { Toast } from '@ionic-native/toast'

import * as md5 from 'md5'

import { HomePage } from '../home/home'
import { ResetPasswordPage } from '../reset-password/reset-password'

import { AuthProvider } from '../../providers/auth/auth'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  private loginForm: FormGroup
  private submitted: boolean
  private errorMessage: string

  constructor (
    private navCtrl: NavController,
    private auth: AuthProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private toast: Toast
  ) {}

  login (model: { email: string; password: string; }, isValid: boolean) {
    if (isValid) {
      let loading = this.loadingCtrl.create({
        dismissOnPageChange: true
      })
      loading.present()
      this.submitted = true
      this.auth.login(model.email, md5(model.password)).then(empleado => {
        this.navCtrl.setRoot(HomePage)
      }).catch(err => {
        try {
          this.errorMessage = JSON.parse(err._body).error.message
        } catch (err) {
          this.errorMessage = 'Ha ocurrido un error desconocido'
        }
        let alert = this.alertCtrl.create({
          title: 'Ha ocurrido un error',
          subTitle: this.errorMessage,
          buttons: [ 'Ok' ]
        })
        alert.present()
        loading.dismiss()
      })
    } else {
      this.showToast(`Complete todos los campos correctamente`, 'bottom')
    }
  }

  ngOnInit () {
    this.loginForm = new FormGroup({
      email: new FormControl('', [<any>Validators.required, <any>Validators.email]),
      password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(6)])
    })
  }

  ionViewDidLoad () {
    this.platform.ready().then(() => {
      this.splashScreen.hide()
    })
  }

  goToResetPassword () {
    this.navCtrl.push(ResetPasswordPage)
  }
  
  private showToast (message: string, position: string) {
    this.platform.ready().then(() => {
      this.toast.show(message, '2000', position)
    })
  }
}
