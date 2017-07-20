import { Component } from '@angular/core'
import { IonicPage, NavParams, Platform } from 'ionic-angular'
import { CallNumber } from '@ionic-native/call-number'
import { format } from 'libphonenumber-js'

import { Locacion } from '../../interfaces/locacion'

@IonicPage()
@Component({
  selector: 'page-detalles-locacion',
  templateUrl: 'detalles-locacion.html',
})
export class DetallesLocacionPage {
  private locacion: Locacion

  constructor(
    private navParams: NavParams,
    private callNumber: CallNumber,
    private platform: Platform
  ) {
  }

  ionViewDidLoad() {
    this.locacion = this.navParams.get('locacion')
  }

  call (telefono) {
    this.platform.ready().then(() => {
      let number = format(`${telefono.prefijo}${telefono.numero}`, telefono.pais, 'International')
      this.callNumber.callNumber(number, true).then(() => console.log('Launched dialer!')).catch(err => console.error('Error launching dialer', err))
    })
  }

}
