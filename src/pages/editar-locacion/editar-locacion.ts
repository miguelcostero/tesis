import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Events, Loading } from 'ionic-angular'

import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage'

import { Locacion } from '../../interfaces/locacion'

import { LocacionesProvider } from '../../providers/locaciones/locaciones'
import { TelefonosProvider } from '../../providers/telefonos/telefonos'

import { NumberValidator } from '../../validators/number/number'

import * as countries from '../../enviroment/countries'

@IonicPage()
@Component({
  selector: 'page-editar-locacion',
  templateUrl: 'editar-locacion.html',
})
export class EditarLocacionPage implements OnInit {
  private locacion: Locacion
  private editarLocacionForm: FormGroup
  public countries: Array<{name:string; code:string;}> = countries.default
  private submitted: boolean
  private loading: Loading

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private _fb: FormBuilder,
    private _locaciones: LocacionesProvider,
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
      const model: Locacion = this.editarLocacionForm.value

      this.createLoader()
      this.loading.present().then(() => {
        this.storage.get('auth').then(auth => {
          this._locaciones.updateLocacion(model, auth.token).subscribe(res => {
            this._events.publish('locacion:updated', model.id, Date.now())
            this.presentToast(`Locación ${model.id} ha sido actualizada satisfactoriamente`)
            this.navCtrl.pop()
          }, err => {
            this.loading.dismiss()
            this.presentToast('Ha ocurrido un error inesperado, porfavor intente de nuevo más tarde')
            console.error('ERROR', err)
            this.submitted = false          
          }, () => this.loading.dismiss())
        })
      })

    } else {
      this.presentToast('Porfavor complete todos los campos de manera correcta')
    }
  }

  ngOnInit () {
    this.editarLocacionForm = this._fb.group({
      id: ['', [
        <any>Validators.required,
        <any>NumberValidator.isValid
      ]],
      nombre: ['', [
        <any>Validators.required,
        <any>Validators.minLength(5),
        <any>Validators.maxLength(80)
      ]],
      direccion: ['', [
        <any>Validators.required,
        <any>Validators.minLength(10),
        <any>Validators.maxLength(160)
      ]],
      capacidad: ['', [
        <any>Validators.required,
        <any>Validators.minLength(1),
        <any>NumberValidator.isValid
      ]],
      telefonos: this._fb.array([])
    })
  }

  ionViewDidLoad () {
    this.locacion = this.navParams.get('locacion')

    this.editarLocacionForm.controls['id'].setValue(this.locacion.id)
    this.editarLocacionForm.controls['nombre'].setValue(this.locacion.nombre)
    this.editarLocacionForm.controls['direccion'].setValue(this.locacion.direccion)
    this.editarLocacionForm.controls['capacidad'].setValue(this.locacion.capacidad)

    if (this.locacion.telefonos) {
      this.locacion.telefonos.forEach(t => {
        const telefonos = <FormArray>this.editarLocacionForm.controls['telefonos']
				telefonos.push(this.initTelefono(t.id, t.numero, t.prefijo, t.pais))
      })
    }
  }

  addToTelefonos () {
    const control = <FormArray>this.editarLocacionForm.controls['telefonos']
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
						const telefono = this.editarLocacionForm.value.telefonos[i]
						if (!isNaN(telefono.id) && telefono.id !== null) {
              this.createLoader()
              this.loading.present().then(() => {
                this.storage.get('auth').then(auth => {
                  this.telefonosProvider.deteleTelefono(telefono.id, auth.token, 'locacion').subscribe(res => {
                    const control = <FormArray>this.editarLocacionForm.controls['telefonos']
                    control.removeAt(i)
                    this.presentToast(`Número de teléfono ${telefono.id} ha sido eliminado satisfactoriamente`)
                    this._events.publish('locacion:updated', this.editarLocacionForm.value.id, Date.now())
                  }, err => {
                    console.log('ERROR', err)
                    this.loading.dismiss()
                    this.presentToast('No se ha podido eliminar su número de teléfono')
                  }, () => this.loading.dismiss())
                })
              })
						} else {
							const control = <FormArray>this.editarLocacionForm.controls['telefonos']
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
