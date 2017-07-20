import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, AlertController, ToastController, Events } from 'ionic-angular'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage'

import { Cliente } from '../../interfaces/cliente'

import { ClientesProvider } from '../../providers/clientes/clientes'

import { NumberValidator } from '../../validators/number/number'

import * as countries from '../../enviroment/countries'

@IonicPage()
@Component({
  selector: 'page-crear-cliente',
  templateUrl: 'crear-cliente.html',
})
export class CrearClientePage implements OnInit {
  private crearClienteForm: FormGroup
  public countries: Array<{name:string; code:string;}> = countries.default
  private submitted: boolean

  constructor(
    private navCtrl: NavController,
    private _fb: FormBuilder,
    private _clientes: ClientesProvider,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private storage: Storage,
    private _events: Events
  ) {}

  submit (isValid: boolean) {
    if (isValid) {
      this.submitted = true
      const model: Cliente = this.crearClienteForm.value
      this.storage.get('auth').then(auth => {
        this._clientes.createCliente(model, auth.token).subscribe(res => {
          this._events.publish('cliente:created', Date.now())
          this.navCtrl.pop()
          this.presentToast(`Cliente creado satisfactoriamente`)
        }, err => {
          this.presentToast('Ha ocurrido un error procesando su solicitud')
        })
      })
    } else {
      this.presentToast('Porfavor complete todos los campo correctamente')
    }
  }

  ngOnInit () {
    this.crearClienteForm = this._fb.group({
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
        <any>Validators.minLength(10),
        <any>Validators.maxLength(20)
      ]],
      direccion: ['', [
        <any>Validators.required,
        <any>Validators.minLength(10),
        <any>Validators.maxLength(150)
      ]],
      telefonos: this._fb.array([])
    })
  }

  addToTelefonos () {
    const control = <FormArray>this.crearClienteForm.controls['telefonos']
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
						const control = <FormArray>this.crearClienteForm.controls['telefonos']
						control.removeAt(i)
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
}
