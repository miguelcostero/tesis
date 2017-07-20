import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, Events, LoadingController, ToastController, ActionSheetController, AlertController, Loading } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { CrearClientePage } from '../crear-cliente/crear-cliente'
import { DetallesClientePage } from '../detalles-cliente/detalles-cliente'
import { EditarClientePage } from '../editar-cliente/editar-cliente'

import { Cliente } from '../../interfaces/cliente'

import { ClientesProvider } from '../../providers/clientes/clientes'

@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage implements OnInit {
  private clientes: Cliente[]
  private loading: Loading

  constructor (
    private navCtrl: NavController,
    private _events: Events,
    private _clintes: ClientesProvider,
    private _storage: Storage,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit () {
    this.subscribeToEvents()
  }

  ionViewDidLoad() {
    this.initializeClientes()
    // this.createLoader()
  }

  presentActionSheet (cliente: Cliente) {
    let config = {
      title: `Opciones de cliente`,
      buttons: [
        {
          text: 'Detalles',
          icon: 'open',
          handler: () => this.showDetails(cliente)
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: () => this.editarCliente(cliente)
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            setTimeout(() => {
              this.eliminarCliente(cliente.id)
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

  showDetails (cliente: Cliente) {
    this.navCtrl.push(DetallesClientePage, { cliente })
  }

  editarCliente (cliente: Cliente) {
    this.navCtrl.push(EditarClientePage, { cliente })
  }

  eliminarCliente (id: number) {
    let confirm = this.alertCtrl.create({
      title: '¿Esta seguro que desea eliminr este cliente?',
      message: 'Una vez eliminado este no podrá ser recuperado',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this._events.publish('cliente:deleted', id, Date.now())
          }
        }
      ]
    })
    confirm.present()
  }

  goCrearCliente () {
    this.navCtrl.push(CrearClientePage)
  }

  private initializeClientes () {
    this.createLoader()
    this.loading.present().then(() => {
      this._storage.get('auth').then(auth => {
        this._clintes.getClientes(auth.token).map(res => res.json() as Cliente[]).subscribe(clientes => {
          this.clientes = clientes
        }, err => {
          this.presentToast('Ha ocurrido un error inesperado, porfavor intente de nuevo')
          console.error('ERROR', err)
        }, () => this.loading.dismiss())
      })
    })
  }

  private initializeClientesWithoutLoader (): Promise<any> {
    return new Promise((resolve, reject) => {
      this._storage.get('auth').then(auth => {
        this._clintes.getClientes(auth.token).map(res => res.json() as Cliente[]).subscribe(clientes => {
          this.clientes = clientes
          resolve()
        }, err => {
          this.presentToast('Ha ocurrido un error inesperado, porfavor intente de nuevo')
          console.error('ERROR', err)
          reject(err)
        })
      })
    })
  }

  private subscribeToEvents () {
    this._events.subscribe('cliente:created', time => {
      console.log(`Cliente creado a las ${time}`)
      this.initializeClientes()
    })

    this._events.subscribe('cliente:updated', (id, time) => {
      console.log(`Cliente ${id} actualizado a las ${time}`)
      this.initializeClientes()
    })

    this._events.subscribe('cliente:deleted', (id, time) => {
      this.createLoader()
      this.loading.present().then(() => {
        console.log(`Cliente ${id} eliminado a las ${time}`)

        this._storage.get('auth').then(auth => {
          this._clintes.deleteCliente(id, auth.token).subscribe(res => {
            this.presentToast('Cliente eliminado satisfactoriamente')
            this.initializeClientesWithoutLoader().then(() => {
              this.loading.dismiss()
            })
          }, err => {
            this.presentToast('Ha ocurrido un error inesperado')
            console.error('ERROR', err)
          })
        })
      })
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
