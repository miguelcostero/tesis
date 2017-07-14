import { Component } from '@angular/core'
import { Platform, NavParams, ViewController } from 'ionic-angular'

import { EstadoEvento } from '../../interfaces/estado_evento'

@Component({
  selector: 'seleccionar-estado-evento',
  templateUrl: 'seleccionar-estado-evento.html'
})
export class SeleccionarEstadoEventoComponent {
  private estado_evento: EstadoEvento

  constructor (
    private platform: Platform,
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.estado_evento = params.get('estado_evento')
  }

  dismiss() {
    this.viewCtrl.dismiss(this.estado_evento)
  }

}
