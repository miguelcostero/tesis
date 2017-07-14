import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { Empleado } from '../../interfaces/empleado'

import { PerfilProvider } from '../../providers/perfil/perfil'

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  private empleado: Empleado

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private perfilProvider: PerfilProvider,
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {
    this.storage.get('auth').then(empleado => {
      console.log(empleado)
      this.empleado = empleado
    })
  }

  updateEmpleado () {
    // this.perfilProvider.updateEmpleado()
  }

}
