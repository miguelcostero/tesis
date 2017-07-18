import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, Events, LoadingController, ToastController } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { CrearClientePage } from '../crear-cliente/crear-cliente'

import { Cliente } from '../../interfaces/cliente'

import { ClientesProvider } from '../../providers/clientes/clientes'

@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage implements OnInit {
  private clientes: Cliente[]

  constructor (
    private navCtrl: NavController,
    private _events: Events,
    private _clintes: ClientesProvider,
    private _storage: Storage,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit () {

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create()
    loading.present()
    this._storage.get('auth').then(auth => {
      this._clintes.getClientes(auth.token).map(res => res.json() as Cliente[]).subscribe(clientes => {
        this.clientes = clientes
      }, err => {
        loading.dismiss()
        this.presentToast('Ha ocurrido un error inesperado, porfavor intente de nuevo')
        console.error('ERROR', err)
      }, () => loading.dismiss())
    })
  }

  private goCrearCliente () {
    this.navCtrl.push(CrearClientePage)
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
