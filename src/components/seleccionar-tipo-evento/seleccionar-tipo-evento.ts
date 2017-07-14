import { Component } from '@angular/core'
import { Platform, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { Observable } from 'rxjs'

import { TipoEventoProvider } from '../../providers/tipo-evento/tipo-evento'

import { TipoEvento } from '../../interfaces/tipo_evento'

@Component({
  selector: 'seleccionar-tipo-evento',
  templateUrl: 'seleccionar-tipo-evento.html'
})
export class SeleccionarTipoEventoComponent {
  private tipo_evento: TipoEvento
  private tipos_evento: Observable<TipoEvento[]>

  constructor (
    private platform: Platform,
    private params: NavParams,
    private viewCtrl: ViewController,
    private tipoEventoProvider: TipoEventoProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {
    this.tipo_evento = params.get('tipo_evento')
    this.initializeTiposEvento()
  }

  private selectTipoEvento (te: TipoEvento) {
    this.tipo_evento = te
    this.dismiss()
  }

  private removeTipoEvento (id: number) {
    let loading = this.loadingCtrl.create()
    loading.present()
    let confirm = this.alertCtrl.create({
      title: `¿Desea eliminar el tipo de evento ${id}?`,
      message: `Una vez eliminado no podrá ser recuperado`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            loading.dismiss()
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.storage.get('auth').then(auth => {
              this.tipoEventoProvider.deleteTipoEvento(id, auth.token).subscribe(res => {
                console.log(`EVENTO ${id} ELIMINADO`, res.json())
                this.initializeTiposEvento()
              })
            })
          }
        }
      ]
    })
    confirm.present()
  }

  private crearTipoEvento () {
    let loading = this.loadingCtrl.create()
    loading.present()
    let prompt = this.alertCtrl.create({
      title: 'Nuevo tipo de evento',
      message: 'Ingrese un nombre para el nuevo tipo de evento',
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Fiesta de cumpleaños'
        },
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Guardar',
          handler: data => {
            this.storage.get('auth').then(auth => {
              this.tipoEventoProvider.createTipoEvento({ nombre: data.nombre }, auth.token).subscribe(res => {
                console.log('RESPONSE', res.json())
                this.initializeTiposEvento()
              })
            })
          }
        }
      ]
    })
    prompt.present()
  }

  private initializeTiposEvento () {
    let loading = this.loadingCtrl.create()
    loading.present()
    this.storage.get('auth').then(auth => {
      this.tipos_evento = this.tipoEventoProvider.getTiposEvento(auth.token).map(tipos_evento => {
        loading.dismissAll()
        return tipos_evento.json() as TipoEvento[]
      })
    })
  }

  private dismiss() {
    this.viewCtrl.dismiss(this.tipo_evento)
  }

}
