import { Component } from '@angular/core'
import { IonicPage, NavController, ToastController, Loading, LoadingController, ActionSheetController, AlertController, Events } from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { EditarEmpleadoPage } from '../editar-empleado/editar-empleado'
import { DetallesEmpleadoPage } from '../detalles-empleado/detalles-empleado'
import { CrearEmpleadoPage } from '../crear-empleado/crear-empleado'

import { Empleado } from '../../interfaces/empleado'

import { EmpleadosProvider } from '../../providers/empleados/empleados'

@IonicPage()
@Component({
  selector: 'page-empleados',
  templateUrl: 'empleados.html',
})
export class EmpleadosPage {
  private empleados: Empleado[]
  private loading: Loading

  constructor(
    public navCtrl: NavController,
    private empleadosProvider: EmpleadosProvider,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private events: Events
  ) {}

  ionViewDidLoad() {
    this.subscribeToEvents()
    this.createLoader()
    this.loading.present().then(() => {
      this.initializeEmpleados().then(() => this.loading.dismiss()).catch(err => {
        this.loading.dismiss()
        this.presentToast('Ha ocurrido un error inesperado')
        console.error('ERROR', err)
      })
    })
  }

  goToCrearEmpleado () {
    this.navCtrl.push(CrearEmpleadoPage)
  }

  showDetails (empleado: Empleado) {
    this.navCtrl.push(DetallesEmpleadoPage, { empleado })
  }

  goToEditarEmpleado (empleado: Empleado) {
    this.navCtrl.push(EditarEmpleadoPage, { empleado })
  }

  presentActionSheet (empleado: Empleado) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones avanzadas de empleado',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            setTimeout(() => {
              this.deleteEmpleado(empleado)
            })
          }
        },{
          text: 'Editar',
          handler: () => this.goToEditarEmpleado(empleado)
        },{
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    })
    actionSheet.present()
  }

  private deleteEmpleado (empleado: Empleado) {
    let confirm = this.alertCtrl.create({
      title: '¿Esta seguro de que desea eliminar este empleado?',
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
                this.empleadosProvider.deleteEmpleado(empleado.id, auth.token).subscribe(res => {
                  this.events.publish('empleado:deleted', Date.now())
                  this.presentToast('Empleado eliminado satisfactoriamente')
                }, err => {
                  console.error('ERROR', err)
                  this.presentToast(JSON.parse(err._body).error ? JSON.parse(err._body).error.message : 'Ha ocurrido un error inesperado')
                  this.loading.dismiss()
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
    this.events.subscribe('empleado:created', time => {
      this.initializeEmpleados()
    })

    this.events.subscribe('empleado:updated', time => {
      this.initializeEmpleados()
    })

    this.events.subscribe('empleado:deleted', time => {
      this.initializeEmpleados()
    })
  }

  private initializeEmpleados (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then(auth => {
        this.empleadosProvider.getEmpleados(auth.token).map(res => res.json() as Empleado[]).subscribe(res => {
          this.storage.get('auth').then(auth => {
            let empleados = []
            res.forEach(empleado => {
              if (empleado.id != auth.id) {
                empleados.push(empleado)
              }
            })
            this.empleados = empleados
            resolve(true)
          })
        }, err => reject(err))
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
