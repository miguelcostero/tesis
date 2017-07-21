import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Events, Loading } from 'ionic-angular'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage'

import { Cliente } from '../../interfaces/cliente'

import { ClientesProvider } from '../../providers/clientes/clientes'
import { TelefonosProvider } from '../../providers/telefonos/telefonos'

import { NumberValidator } from '../../validators/number/number'
import { DniValidator } from '../../validators/dni/dni'

import * as countries from '../../enviroment/countries'

@IonicPage()
@Component({
  selector: 'page-editar-cliente',
  templateUrl: 'editar-cliente.html',
})
export class EditarClientePage implements OnInit {
  private cliente: Cliente
  private editarClienteForm: FormGroup
  public countries: Array<{name:string; code:string;}> = countries.default
  private submitted: boolean
  private loading: Loading

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private _fb: FormBuilder,
    private _clientes: ClientesProvider,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private telefonosProvider: TelefonosProvider,
    private _events: Events
  ) {}

  submit (isValid: boolean) {
    if (isValid) {
      this.submitted = true
      const model: Cliente = this.editarClienteForm.value

      this.createLoader()
      this.loading.present().then(() => {
        this.storage.get('auth').then(auth => {
          this._clientes.updateCliente(model, auth.token).subscribe(res => {
            this._events.publish('cliente:updated', model.id, Date.now())
            this.presentToast(`Cliente ${model.id} ha sido actualizado satisfactoriamente`)
            this.navCtrl.pop()
          }, err => {
            this.loading.dismiss()
            this.presentToast('Ha ocurrido un error inesperado, porfavor intente de nuevo más tarde')
            console.error('ERROR', err)
          }, () => this.loading.dismiss())
        })
      })
    } else {
      this.presentToast('Porfavor complete todos los campos de manera correcta')
    }
  }

  ngOnInit () {
    this.editarClienteForm = this._fb.group({
      id: ['', [
        <any>Validators.required,
        <any>NumberValidator.isValid
      ]],
      email: ['', [
        <any>Validators.required,
        <any>Validators.email,
        <any>Validators.maxLength(150)
      ]],
      nombre: ['', [
        <any>Validators.required,
        <any>Validators.minLength(5),
        <any>Validators.maxLength(50)
      ]],
      dni: ['', [
        <any>Validators.required,
        <any>DniValidator.isValid
      ]],
      direccion: ['', [
        <any>Validators.required,
        <any>Validators.minLength(10),
        <any>Validators.maxLength(150)
      ]],
      telefonos: this._fb.array([])
    })
  }

  ionViewDidLoad () {
    this.cliente = this.navParams.get('cliente')

    this.editarClienteForm.controls['id'].setValue(this.cliente.id)
    this.editarClienteForm.controls['email'].setValue(this.cliente.email)
    this.editarClienteForm.controls['nombre'].setValue(this.cliente.nombre)
    this.editarClienteForm.controls['dni'].setValue(this.cliente.dni)
    this.editarClienteForm.controls['direccion'].setValue(this.cliente.direccion)

    if (this.cliente.telefonos) {
      this.cliente.telefonos.forEach(t => {
        const telefonos = <FormArray>this.editarClienteForm.controls['telefonos']
				telefonos.push(this.initTelefono(t.id, t.numero, t.prefijo, t.pais))
      })
    }
  }

  addToTelefonos () {
    const control = <FormArray>this.editarClienteForm.controls['telefonos']
    control.push(this.initTelefono())
  }
  
  removeFromTelefonos (i: number) {
    let alert = this.alertCtrl.create({
      title: `¿Desea eliminar este número de teléfono?`,
      message: 'Una vez eliminado, este no podrá ser recuperado',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Eliminar',
          handler: () => {
						const telefono = this.editarClienteForm.value.telefonos[i]
						if (!isNaN(telefono.id) && telefono.id !== null) {
              this.createLoader()
              this.loading.present().then(() => {
                this.storage.get('auth').then(auth => {
                  this.telefonosProvider.deteleTelefono(telefono.id, auth.token, 'cliente').subscribe(res => {
                    const control = <FormArray>this.editarClienteForm.controls['telefonos']
                    control.removeAt(i)
                    this.presentToast(`Número de teléfono ${telefono.id} ha sido eliminado satisfactoriamente`)
                    this._events.publish('cliente:updated', this.editarClienteForm.value.id, Date.now())
                  }, err => {
                    this.loading.dismiss()
                    console.log('ERROR', err)
                    this.presentToast('No se ha podido eliminar su numero de teléfono')
                  }, () => this.loading.dismiss())
                })
              })
						} else {
							const control = <FormArray>this.editarClienteForm.controls['telefonos']
							control.removeAt(i)
						}
          }
        }
      ]
    })
    alert.present()
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

  private initTelefono (id: number = null, numero = '', prefijo = '', pais = '') {
    return this._fb.group({
			id: [id],
      numero: [numero, [
        <any>Validators.required,
        <any>Validators.maxLength(7),
				<any>Validators.minLength(7),
				<any>NumberValidator.isValid
      ]],
      prefijo: [prefijo, [
				<any>Validators.required,
				<any>Validators.minLength(3),
				<any>Validators.maxLength(4),
				<any>NumberValidator.isValid
      ]],
      pais: [pais, [
        <any>Validators.required,
				<any>Validators.minLength(2),
				<any>Validators.maxLength(2)
      ]]
    })
  }

  private createLoader (message: string = '') {
    this.loading = this.loadingCtrl.create({
      content: message
    })
  }

}
