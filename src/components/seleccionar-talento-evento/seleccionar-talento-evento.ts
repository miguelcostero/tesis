import { Component } from '@angular/core'
import { ViewController, LoadingController } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { TalentosProvider } from '../../providers/talentos/talentos'

import { Talento } from '../../interfaces/talento'

@Component({
  selector: 'seleccionar-talento-evento',
  templateUrl: 'seleccionar-talento-evento.html'
})
export class SeleccionarTalentoEventoComponent {
  private talento: Talento
  private talentos: Talento[]

  constructor (
    private viewCtrl: ViewController,
    private talentosProvider: TalentosProvider,
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) {
    this.initializeTalentos()
  }

  public selectTalento (t: Talento): void {
    this.talento = t
    this.dismiss()
  }

  private initializeTalentos (): void {
    let loading = this.loadingCtrl.create()
    loading.present().then(() => {
      this.storage.get('auth').then(auth => {
        this.talentosProvider.getTalentos(auth.token).map(talentos => talentos.json() as Talento[]).subscribe(res => {
          loading.dismissAll()
          this.talentos = res
        })
      })
    })
  }

  private dismiss(): void {
    this.viewCtrl.dismiss(this.talento)
  }

}
