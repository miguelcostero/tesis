import { Component } from '@angular/core'
import { Platform, NavParams, ViewController, LoadingController } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { Observable } from 'rxjs'

import { Cliente } from '../../interfaces/cliente'

import { ClientesProvider } from '../../providers/clientes/clientes'

@Component({
  selector: 'seleccionar-cliente-evento',
  templateUrl: 'seleccionar-cliente-evento.html'
})
export class SeleccionarClienteEventoComponent {
  private cliente: Cliente
  private clientes: Observable<Cliente[]>

  constructor (
    private platform: Platform,
    private params: NavParams,
    private viewCtrl: ViewController,
    private clientesProvider: ClientesProvider,
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) {
    this.cliente = params.get('cliente')
    this.initializeClientes()
  }

  private selectCliente (cliente: Cliente) {
    this.cliente = cliente
    this.dismiss()
  }

  private initializeClientes () {
    let loading = this.loadingCtrl.create()
    loading.present()
    this.storage.get('auth').then(auth => {
      this.clientes = this.clientesProvider.getClientes(auth.token).map(res => {
        loading.dismiss()
        return res.json() as Cliente[]
      })
    })
  }

  private dismiss() {
    this.viewCtrl.dismiss(this.cliente)
  }

}
