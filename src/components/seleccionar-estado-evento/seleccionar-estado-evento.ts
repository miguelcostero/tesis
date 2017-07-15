import { Component } from '@angular/core'
import { Platform, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular'
import { Observable } from 'rxjs'
import { Toast } from '@ionic-native/toast'
import { Storage } from '@ionic/storage'

import { EstadoEventoProvider } from '../../providers/estado-evento/estado-evento'

import { EstadoEvento } from '../../interfaces/estado_evento'

@Component({
  selector: 'seleccionar-estado-evento',
  templateUrl: 'seleccionar-estado-evento.html'
})
export class SeleccionarEstadoEventoComponent {
  private estado_evento: EstadoEvento
  // private estados_eventos: Observable<EstadoEvento[]>
  private estados_eventos: EstadoEvento[]  

  constructor (
    private platform: Platform,
    private params: NavParams,
    private viewCtrl: ViewController,
    private estadoEventoProvider: EstadoEventoProvider,
    private toast: Toast,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {
    this.estado_evento = params.get('estado_evento')
    this.initializeEstadosEvento()
  }

  private selectEstadoEvento (ee: EstadoEvento) {
    this.estado_evento = ee
    this.dismiss()
  }

  private removeEstadoEvento (id: number) {
    let loading = this.loadingCtrl.create()
    loading.present()
    let confirm = this.alertCtrl.create({
      title: `¿Desea eliminar el estado de evento ${id}?`,
      message: `Una vez eliminado no podrá ser recuperado`,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => loading.dismissAll()
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.presentToast(`Estado de evento ${id} ha sido eliminado`, 'bottom')
            this.storage.get('auth').then(auth => {
              this.estadoEventoProvider.deleteEstadoEvento(id, auth.token).subscribe(res => {
                console.log(`ESTADO EVENTO ${id} ELIMINADO`, res.json())
                this.initializeEstadosEvento()
              })
            })
          }
        }
      ]
    })
    confirm.present()
  }

  private crearEstadoEvento () {
    let loading = this.loadingCtrl.create()
    loading.present()
    let prompt = this.alertCtrl.create({
      title: 'Nuevo estado de evento',
      message: 'Ingrese un nombre para el nuevo estado de evento',
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Pendiente de aprobación'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => loading.dismissAll()
        },
        {
          text: 'Guardar',
          handler: data => {
            this.storage.get('auth').then(auth => {
              this.estadoEventoProvider.createEstadoEvento({ nombre: data.nombre }, auth.token).subscribe(res => {
                console.log('RESPONSE', res.json())
                this.initializeEstadosEvento()
              })
            })
          }
        }
      ]
    })
    prompt.present()
  }

  private initializeEstadosEvento () {
    let loading = this.loadingCtrl.create()
    loading.present()
    this.storage.get('auth').then(auth => {
      this.estadoEventoProvider.getEstadosEvento(auth.token).map(ee => ee.json() as EstadoEvento[]).subscribe(ee => {
        loading.dismissAll()
        this.estados_eventos = ee
      })
    })
  }

  private dismiss() {
    this.viewCtrl.dismiss(this.estado_evento)
  }

  private presentToast (message: string, position: string) {
    this.platform.ready().then(() => {
      this.toast.show(message, 'short', position)
    })
  }

}
