import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Toast } from '@ionic-native/toast'

import { LoginPage } from '../login/login'

import { ResetPasswordProvider } from '../../providers/reset-password/reset-password'

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage implements OnInit {
  private resetPasswordForm: FormGroup
  private submitted: boolean

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toast: Toast,
    private platform: Platform,
    private resetPasswordProvider: ResetPasswordProvider,
    private alertCtrl: AlertController
  ) {}

  resetPassword (model: { email: string; }, isValid: boolean) {
    if (isValid) {
      let loading = this.loadingCtrl.create({ dismissOnPageChange: true })
      loading.present()
      this.submitted = true

      this.resetPasswordProvider.sendRequest(model.email).subscribe(res => {
        let response = res.json()
        console.log(response)
        let config: {
          title: string;
          subTitle: string;
          buttons: Array<string>;
        }

        if (response.error) {
          config = {
            title: 'Ha ocurrido un error inesperado',
            subTitle: response.error.message,
            buttons: [ 'Cerrar' ]
          }
        } else {
          config = {
            title: 'Email de confirmación enviado',
            subTitle: 'Un email ha sido enviado a la dirección de correo electrónico proporcionada con su nueva contraseña',
            buttons: [ 'Ok' ]
          }
          this.navCtrl.setRoot(LoginPage)
        }

        let alert = this.alertCtrl.create(config)
        alert.present()
      })
    } else {
      console.error('Correo inválido')
      this.showToast(`Introduzca un correo electrónico válido`, 'bottom')
    }
  }

  ngOnInit () {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [<any>Validators.required, <any>Validators.email])
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage')
  }

  private showToast (message: string, position: string) {
    this.platform.ready().then(() => {
      this.toast.show(message, '2000', position)
    })
  }

}
