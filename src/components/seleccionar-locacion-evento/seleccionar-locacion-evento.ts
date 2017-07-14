import { Component } from '@angular/core'
import { Platform, NavParams, ViewController } from 'ionic-angular'

import { Locacion } from '../../interfaces/locacion'

@Component({
  selector: 'seleccionar-locacion-evento',
  templateUrl: 'seleccionar-locacion-evento.html'
})
export class SeleccionarLocacionEventoComponent {
  private locacion: Locacion

  constructor (
    private platform: Platform,
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.locacion = params.get('locacion')
  }

  dismiss() {
    this.viewCtrl.dismiss(this.locacion)
  }

}
