import { Component } from '@angular/core'
import { Platform, NavParams, ViewController } from 'ionic-angular'

import { Evento } from '../../interfaces/evento'
import { EventoIn } from '../../interfaces/EventoIn'

@Component({
  selector: 'modal-cronograma-evento',
  templateUrl: 'modal-cronograma-evento.html'
})
export class ModalCronogramaEventoComponent {
  private evento: Evento

  constructor(
    private platform: Platform,
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.evento = params.get('evento')
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

}
