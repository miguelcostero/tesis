import { Component } from '@angular/core'
import { IonicPage, NavController, Loading, LoadingController, ToastController, ActionSheetController, Events, AlertController } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { CrearTalentoPage } from '../crear-talento/crear-talento'
import { EditarTalentoPage } from '../editar-talento/editar-talento'
import { DetallesTalentoPage } from '../detalles-talento/detalles-talento'

import { Talento } from '../../interfaces/talento'

import { TalentosProvider } from '../../providers/talentos/talentos'

@IonicPage()
@Component({
  selector: 'page-talentos',
  templateUrl: 'talentos.html',
})
export class TalentosPage {
  private loading: Loading
  private talentos: Talento[]

  constructor(
    public navCtrl: NavController, 
    private talentosProvider: TalentosProvider,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private events: Events,
    private alertCtrl: AlertController
  ) {
    this.subscribeToEvents()
  }

  ionViewDidLoad() {
    this.createLoader()
    this.loading.present().then(() => {
      this.initializeTalentos().then(() => {
        this.loading.dismiss()
      })
    })
  }

  presentActionSheet (talento: Talento) {
    let config = {
      title: `Opciones de talento`,
      buttons: [
        {
          text: 'Detalles',
          icon: 'open',
          handler: () => this.showDetails(talento)
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: () => this.editarTalento(talento)
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            setTimeout(() => {
              this.eliminarTalento(talento.id)
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

  showDetails (talento: Talento): void {
    this.navCtrl.push(DetallesTalentoPage, { talento })
  }

  editarTalento (talento: Talento): void {
    this.navCtrl.push(EditarTalentoPage, { talento })
  }

  eliminarTalento (id: number): void {
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
              this.storage.get('auth').then(auth => {
                this.talentosProvider.deteleTalentos(id, auth.token).subscribe(res => {
                  this.events.publish('talento:deleted', id, Date.now())
                  this.presentToast(`Tlento ${id} eliminado satisfactoriamente`)
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

  goCrearTalento () {
    this.navCtrl.push(CrearTalentoPage)
  }

  private initializeTalentos (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then(auth => {
        this.talentosProvider.getTalentos(auth.token).map(res => res.json() as Talento[]).subscribe(res => {
          this.talentos = res
        }, err => {
          reject(err)
          console.error('ERROR', err)
          this.presentToast('Ha ocurrido un error desconocido')
        }, () => resolve(true))
      })
    })
  }

  private subscribeToEvents () {
    this.events.subscribe('talento:created', time => {
      this.initializeTalentos()
    })

    this.events.subscribe('talento:updated', time => {
      this.initializeTalentos()
    })

    this.events.subscribe('talento:deleted', time => {
      this.initializeTalentos()
    })
  }

  private createLoader (message: string = '') {
    this.loading = this.loadingCtrl.create({
      content: message
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

}
