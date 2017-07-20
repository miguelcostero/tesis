import { Component } from '@angular/core'
import { IonicPage, NavParams, Platform } from 'ionic-angular'
import { CallNumber } from '@ionic-native/call-number'
import { format } from 'libphonenumber-js'

import { Empleado } from '../../interfaces/empleado'


@IonicPage()
@Component({
  selector: 'page-detalles-empleado',
  templateUrl: 'detalles-empleado.html',
})
export class DetallesEmpleadoPage {
  private empleado: Empleado

  constructor(
    public navParams: NavParams,
    private platform: Platform,
    private callNumber: CallNumber
  ) {}

  ionViewDidLoad() {
    this.empleado = this.navParams.get('empleado')
  }

  call (telefono) {
    this.platform.ready().then(() => {
      let number = format(`${telefono.prefijo}${telefono.numero}`, telefono.pais, 'International')
      this.callNumber.callNumber(number, true).then(() => console.log('Launched dialer!')).catch(err => console.error('Error launching dialer', err))
    })
  }

}
