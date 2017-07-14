import { Component } from '@angular/core'
import { NavController, LoadingController, AlertController, ModalController, ActionSheetController } from 'ionic-angular'
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

  constructor(
    private navCtrl: NavController,
    private eventosProvider: EventosProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.initializeEventos()
  }

  getEventos (ev: any) {
    this.initializeEventos()

    // set val to the value of the searchbar
    let val = ev.target.value

    if (!val) return

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
    let actionSheet = this.actionSheetCtrl.create({
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
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',          
          handler: () => {
            this.deleteEvento(evento.id)
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
    })
    actionSheet.present()
  }

  deleteEvento (id: number) {
    console.log('EVENTO ', id)
  }

  private initializeEventos () {
    this.showMessage = null
    this.storage.get('auth').then(auth => {
      if (auth) {
        this.eventos = this.eventosProvider.getEventos(auth.token).map(res => {
          return res.json() as Evento[]
        })
      }
    })
  }

}
