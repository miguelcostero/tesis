import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, AlertController, ToastController, Events, Loading, LoadingController } from 'ionic-angular'
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage'

import { Talento } from '../../interfaces/talento'

import { TalentosProvider } from '../../providers/talentos/talentos'

import { NumberValidator } from '../../validators/number/number'

import * as countries from '../../enviroment/countries'

@IonicPage()
@Component({
  selector: 'page-crear-talento',
  templateUrl: 'crear-talento.html',
})
export class CrearTalentoPage {
  private loading: Loading
  private crearTalentoForm: FormGroup
  public countries: Array<{name:string; code:string;}> = countries.default
  private submitted: boolean

  constructor(
    private navCtrl: NavController,
    private _fb: FormBuilder,
    private talentosProvider: TalentosProvider,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private storage: Storage,
    private _events: Events,
    private loadingCtrl: LoadingController
  ) {}

  submit (isValid: boolean) {
    if (isValid) {
      this.submitted = true
      const model: Talento = this.crearTalentoForm.value
      this.createLoader()
      this.loading.present().then(() => {
        this.storage.get('auth').then(auth => {
          this.talentosProvider.createTalento(model, auth.token).subscribe(res => {
            this._events.publish('talento:created', Date.now())
            this.navCtrl.pop()
            this.presentToast(`Talento creado satisfactoriamente`)
          }, err => {
            this.loading.dismiss()
            this.submitted = false 
            this.presentToast('Ha ocurrido un error procesando su solicitud')
          }, () => this.loading.dismiss())
        })
      })
    } else {
      this.presentToast('Porfavor complete todos los campo correctamente')
    }
  }

  ngOnInit () {
    this.crearTalentoForm = this._fb.group({
      nombre: ['', [
        <any>Validators.required,
        <any>Validators.minLength(5),
        <any>Validators.maxLength(80)
      ]],
      email: ['', [
        <any>Validators.required,
        <any>Validators.email,
        <any>Validators.maxLength(150)        
      ]],
      notas: ['', [
        <any>Validators.minLength(10)
      ]],
      telefonos: this._fb.array([])
    })
  }

  addToTelefonos () {
    const control = <FormArray>this.crearTalentoForm.controls['telefonos']
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
						const control = <FormArray>this.crearTalentoForm.controls['telefonos']
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
  
  private createLoader (message: string = '') {
    this.loading = this.loadingCtrl.create({
      content: message
    })
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
