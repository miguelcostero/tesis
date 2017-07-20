import { Component } from '@angular/core'
import { IonicPage, NavController, LoadingController, Loading, ToastController, Events, ActionSheetController, AlertController } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { DetallesLocacionPage } from '../detalles-locacion/detalles-locacion'
import { EditarLocacionPage } from '../editar-locacion/editar-locacion'
import { CrearLocacionPage } from '../crear-locacion/crear-locacion'

import { LocacionesProvider } from '../../providers/locaciones/locaciones'

import { Locacion } from '../../interfaces/locacion'

@IonicPage()
@Component({
  selector: 'page-locaciones',
  templateUrl: 'locaciones.html',
})
export class LocacionesPage {
  private loading: Loading
  private locaciones: Locacion[]

  constructor(
    public navCtrl: NavController,
    private _locaciones: LocacionesProvider,
    private _storage: Storage,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private events: Events,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  goCrearLocacion () {
    this.navCtrl.push(CrearLocacionPage)
  }

  presentActionSheet (locacion: Locacion) {
    let config = {
      title: `Opciones de locacion`,
      buttons: [
        {
          text: 'Detalles',
          icon: 'open',
          handler: () => this.showDetails(locacion)
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: () => this.editarLocacion(locacion)
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            setTimeout(() => {
              this.eliminarLocacion(locacion.id)
            })
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'exit'
        }
      ]
    }
    let actionSheet = this.actionSheetCtrl.create(config)
    actionSheet.present()
  }

  ionViewDidLoad() {
    this.subscribeToEvents()
    this.createLoader()
    this.loading.present().then(() => {
      this.initializeLocaciones().then(() => this.loading.dismiss())
    })  
  }

  private initializeLocaciones (): Promise<any> {
    return new Promise((resolve, reject) => {
      this._storage.get('auth').then(auth => {
        this._locaciones.getLocaciones(auth.token).map(res => res.json() as Locacion[]).subscribe(locaciones => {
          this.locaciones = locaciones
        }, err => {
          reject(err)
          console.error('ERROR', err)
          this.presentToast('Ha ocurrido un error procesando su solicitud')
        }, () => resolve(true))
      })
    })
  }

  private showDetails (locacion: Locacion) {
    this.navCtrl.push(DetallesLocacionPage, { locacion })
  }

  private editarLocacion (locacion: Locacion) {
    this.navCtrl.push(EditarLocacionPage, { locacion })
  }

  private eliminarLocacion (id: number) {
    let confirm = this.alertCtrl.create({
      title: '¿Está seguro de que desea eliminar esta locación?',
      message: 'Una vez eliminado, esta locación no podrá ser recuperada',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.createLoader()
            this.loading.present().then(() => {
              this._storage.get('auth').then(auth => {
                this._locaciones.deleteLocacion(id, auth.token).subscribe(res => {
                  this.events.publish('locacion:deleted', id, Date.now())
                  this.presentToast(`Locación ${id} eliminada satisfactoriamente`)
                }, err => {
                  this.loading.dismiss()
                  console.error('ERROR', err)
                  this.presentToast('Ha ocurrido un error procesando su solicitud')
                }, () => this.loading.dismiss())
              })
            })
          }
        }
      ]
    })
    confirm.present()
  }

  private subscribeToEvents () {
    this.events.subscribe('locacion:created', time => {
      this.initializeLocaciones()
    })

    this.events.subscribe('locacion:updated', time => {
      this.initializeLocaciones()
    })

    this.events.subscribe('locacion:deleted', time => {
      this.initializeLocaciones()
    })
  }

  private presentToast (message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    })
    toast.present()
  }

  private createLoader (message: string = '') {
    this.loading = this.loadingCtrl.create({
      content: message
    })
  }

}
