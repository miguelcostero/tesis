import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { Toast } from '@ionic-native/toast'
import { CallNumber } from '@ionic-native/call-number'
import { format } from 'libphonenumber-js'

import { EventosProvider } from '../../providers/eventos/eventos'

import { Evento } from '../../interfaces/evento'

@IonicPage()
@Component({
  selector: 'page-evento-detalles',
  templateUrl: 'evento-detalles.html'
})
export class EventoDetallesPage {
  private eventoId: number
  private evento: Evento

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private eventosProvider: EventosProvider,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private toast: Toast,
    private callNumber: CallNumber,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {
    this.eventoId = navParams.get('id') 
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create()
    loading.present()

    this.storage.get('auth').then(auth => {
      this.eventosProvider.getEvento(this.eventoId, auth.token).subscribe(evento => {
        this.evento = evento
      }, err => {
        this.navCtrl.pop()
        console.error('ERROR', err)        
        let alert = this.alertCtrl.create({
          title: 'Ha ocurrido un error',
          subTitle: 'Un error ha ocurrido tratando de recueperar los datos de su evento, porfavor intente de nuevo más tarde',
          buttons: [ 'Ok' ]
        })
        alert.present()
        loading.dismiss()
        this.toast.show(`Ha ocurrido un error, intente de nuevo`, '3000', 'bottem')
      }, () => {
        loading.dismiss()
      })
    })
  }

  private call (telefono) {
    this.platform.ready().then(() => {
      let number = format(`${telefono.prefijo}${telefono.numero}`, telefono.pais, 'International')
      this.callNumber.callNumber(number, true).then(() => console.log('Launched dialer!')).catch(err => console.error('Error launching dialer', err))
    })
  }

}
