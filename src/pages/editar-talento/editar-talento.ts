import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Events, Loading } from 'ionic-angular'

import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage'

import { Talento } from '../../interfaces/talento'

import { TalentosProvider } from '../../providers/talentos/talentos'
import { TelefonosProvider } from '../../providers/telefonos/telefonos'

import { NumberValidator } from '../../validators/number/number'

import * as countries from '../../enviroment/countries'

@IonicPage()
@Component({
  selector: 'page-editar-talento',
  templateUrl: 'editar-talento.html',
})
export class EditarTalentoPage {
  private talento: Talento
  private editarTalentoForm: FormGroup
  public countries: Array<{name:string; code:string;}> = countries.default
  private submitted: boolean
  private loading: Loading

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private _fb: FormBuilder,
    private talentosProvider: TalentosProvider,
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
      const model: Talento = this.editarTalentoForm.value

      this.createLoader()
      this.loading.present().then(() => {
        this.storage.get('auth').then(auth => {
          this.talentosProvider.updateTalento(model, auth.token).subscribe(res => {
            this._events.publish('talento:updated', model.id, Date.now())
            this.presentToast(`Talento ${model.id} ha sido actualizado satisfactoriamente`)
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
    this.editarTalentoForm = this._fb.group({
      id: ['', [
        <any>Validators.required,
        <any>NumberValidator.isValid
      ]],
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

  ionViewDidLoad () {
    this.talento = this.navParams.get('talento')

    this.editarTalentoForm.controls['id'].setValue(this.talento.id)
    this.editarTalentoForm.controls['nombre'].setValue(this.talento.nombre)
    this.editarTalentoForm.controls['email'].setValue(this.talento.email)
    if (this.talento.notas) {
      this.editarTalentoForm.controls['notas'].setValue(this.talento.notas)
    }

    if (this.talento.telefonos) {
      this.talento.telefonos.forEach(t => {
        const telefonos = <FormArray>this.editarTalentoForm.controls['telefonos']
				telefonos.push(this.initTelefono(t.id, t.numero, t.prefijo, t.pais))
      })
    }
  }

  addToTelefonos () {
    const control = <FormArray>this.editarTalentoForm.controls['telefonos']
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
						const telefono = this.editarTalentoForm.value.telefonos[i]
						if (!isNaN(telefono.id) && telefono.id !== null) {
              this.createLoader()
              this.loading.present().then(() => {
                this.storage.get('auth').then(auth => {
                  this.telefonosProvider.deteleTelefono(telefono.id, auth.token, 'talento').subscribe(res => {
                    const control = <FormArray>this.editarTalentoForm.controls['telefonos']
                    control.removeAt(i)
                    this.presentToast(`Número de teléfono ${telefono.id} ha sido eliminado satisfactoriamente`)
                    this._events.publish('talento:updated', this.editarTalentoForm.value.id, Date.now())
                  }, err => {
                    console.log('ERROR', err)
                    this.loading.dismiss()
                    this.presentToast('No se ha podido eliminar su número de teléfono')
                  }, () => this.loading.dismiss())
                })
              })
						} else {
							const control = <FormArray>this.editarTalentoForm.controls['telefonos']
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
