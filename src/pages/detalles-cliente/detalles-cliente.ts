import { Component } from '@angular/core'
import { IonicPage, NavParams, Platform } from 'ionic-angular'
import { CallNumber } from '@ionic-native/call-number'
import { format } from 'libphonenumber-js'

import { Cliente } from '../../interfaces/cliente'

@IonicPage()
@Component({
  selector: 'page-detalles-cliente',
  templateUrl: 'detalles-cliente.html',
})
export class DetallesClientePage {
  private cliente: Cliente

  constructor(
    public navParams: NavParams,
    private callNumber: CallNumber,
    private platform: Platform
  ) {}

  call (telefono) {
    this.platform.ready().then(() => {
      let number = format(`${telefono.prefijo}${telefono.numero}`, telefono.pais, 'International')
      this.callNumber.callNumber(number, true).then(() => console.log('Launched dialer!')).catch(err => console.error('Error launching dialer', err))
    })
  }

  ionViewDidLoad() {
    this.cliente = this.navParams.get('cliente')
  }

}
