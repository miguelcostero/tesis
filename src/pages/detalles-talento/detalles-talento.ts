import { Component } from '@angular/core'
import { IonicPage, NavParams, Platform } from 'ionic-angular'
import { CallNumber } from '@ionic-native/call-number'
import { format } from 'libphonenumber-js'

import { Talento } from '../../interfaces/talento'


@IonicPage()
@Component({
  selector: 'page-detalles-talento',
  templateUrl: 'detalles-talento.html',
})
export class DetallesTalentoPage {
  private talento: Talento

  constructor(
    private navParams: NavParams,
    private callNumber: CallNumber,
    private platform: Platform
  ) {
  }

  ionViewDidLoad() {
    this.talento = this.navParams.get('talento')
  }

  call (telefono) {
    this.platform.ready().then(() => {
      let number = format(`${telefono.prefijo}${telefono.numero}`, telefono.pais, 'International')
      this.callNumber.callNumber(number, true).then(() => console.log('Launched dialer!')).catch(err => console.error('Error launching dialer', err))
    })
  }


}
