import { Component } from '@angular/core'
import { NavController, LoadingController, AlertController, ModalController, ActionSheetController, Events, ToastController } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { Observable } from 'rxjs'

import { EventoDetallesPage } from '../evento-detalles/evento-detalles'
import { CrearEventoPage } from '../crear-evento/crear-evento'
import { EditarEventoPage } from '../editar-evento/editar-evento'

import { EventosProvider } from '../../providers/eventos/eventos'

import { Evento } from '../../interfaces/evento'

import { ModalCronogramaEventoComponent } from '../../components/modal-cronograma-evento/modal-cronograma-evento'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private eventos: Observable<Evento[]>
  private showMessage: string
  private auth

  constructor(
    private navCtrl: NavController,
    private eventosProvider: EventosProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private events: Events,
    private toast: ToastController
  ) {
    this.subscribeToEvents()
  }

  getEventos (ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value

    if (!val) {
      this.initializeEventos()
      return
    }

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.storage.get('auth').then(auth => {
        if (auth) {
          this.eventos = this.eventosProvider.searchEventosByNombre(val, auth.token).map(res => {
            let response = res.json()
            if (response.error) {
              this.showMessage = response.error.message
              return []
            } 
            return res.json() as Evento[]
          })
        }
      })
    }
  }

  private subscribeToEvents () {
    this.events.subscribe('eventos:edited', (evento, time) => {
      this.initializeEventos()
      console.log(`Eventos actualizados a las ${time}`)
    })

    this.events.subscribe('eventos:eliminado', (id, time) => {
      this.initializeEventos()
      console.log(`Evento ${id} eliminado a las ${time}`)
    })

    this.events.subscribe('eventos:added', (id, time) => {
      this.initializeEventos()
      console.log(`Evento ${id} agreado a las ${time}`)
    })
  }

  onCancelEventos (ev: any) {
    this.initializeEventos()
  }

  showDetallesEvento (id: number) {
    this.navCtrl.push(EventoDetallesPage, { id })
  }

  showCronograma (evento: Evento) {
    let modal = this.modalCtrl.create(ModalCronogramaEventoComponent, { evento })
    modal.present()
  }

  goCrearNuevoEvento () {
    this.navCtrl.push(CrearEventoPage)
  }

  showEditarEvento (evento: Evento) {
    this.navCtrl.push(EditarEventoPage, { evento })
  }

  presentActionSheet (evento: Evento) {
    let config = {
      title: `Opciones de evento`,
      buttons: [
        {
          text: 'Detalles',
          icon: 'open',
          handler: () => {
            this.showDetallesEvento(evento.id)
          }
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.showEditarEvento(evento)
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked')
          }
        }
      ]
    }

    if (this.auth.role.id == 2 || this.auth.role.id == 3) {
      config.buttons.push({
        text: 'Eliminar',
        icon: 'trash',
        role: 'destructive',          
        handler: () => {
          setTimeout(()=> {
            this.deleteEvento(evento.id)
          })
        }
      })
    }
    let actionSheet = this.actionSheetCtrl.create(config)
    actionSheet.present()
  }

  deleteEvento (id: number) {
    let confirm = this.alertCtrl.create({
      title: `¿Está seguro que desea eliminar el evento ${id}?`,
      message: 'Una vez eliminado, no podrá ser recuperado',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            let loading = this.loadingCtrl.create()
            loading.present()
            this.storage.get('auth').then(auth => {
              if (auth) {
                this.eventosProvider.deleteEvento(id, auth.token).subscribe(res => {
                  this.events.publish('eventos:eliminado', id, Date.now())
                  this.presentToast(`Evento ${id} ha sido eliminado satisfactoriamente`)
                }, err => {
                  console.error('ERROR', err)
                  loading.dismissAll()
                  this.presentToast(`Ha ocurrido un error procesando su solicitud`)
                }, () => loading.dismissAll())
              }
            })
          }
        }
      ]
    })
    confirm.present()
  }

  private initializeEventos () {
    let loading = this.loadingCtrl.create()
    loading.present()
    this.showMessage = null
    this.eventos = this.eventosProvider.getEventos(this.auth.token).map(res => {
      loading.dismiss()
      return res.json() as Evento[]
    })
  }

  private presentToast (message: string) {
    let toast = this.toast.create({
      message: message,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    })
    toast.present()
  }

  ionViewDidLoad () {
    this.storage.get('auth').then(auth => {
      if (auth) {
        this.auth = auth
        this.initializeEventos()        
      }
    })
  }

}
