import { Component } from '@angular/core'
import { Platform, NavParams, ViewController, LoadingController } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { LocacionesProvider } from '../../providers/locaciones/locaciones'

import { Locacion } from '../../interfaces/locacion'

@Component({
  selector: 'seleccionar-locacion-evento',
  templateUrl: 'seleccionar-locacion-evento.html'
})
export class SeleccionarLocacionEventoComponent {
  private locacion: Locacion
  private locaciones: Locacion[]

  constructor (
    private platform: Platform,
    private params: NavParams,
    private viewCtrl: ViewController,
    private locacionesProvider: LocacionesProvider,
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) {
    this.locacion = params.get('locacion')
    this.initializeLocaciones()
  }

  private selectLocacion (l: Locacion) {
    this.locacion = l
    this.dismiss()
  }

  private initializeLocaciones () {
    let loading = this.loadingCtrl.create()
    loading.present()
    this.storage.get('auth').then(auth => {
      this.locacionesProvider.getLocaciones(auth.token).map(locaciones => locaciones.json() as Locacion[]).subscribe(res => {
        loading.dismissAll()
        this.locaciones = res
      })
    })
  }

  private dismiss() {
    this.viewCtrl.dismiss(this.locacion)
  }

}
