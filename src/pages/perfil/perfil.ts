import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, LoadingController, AlertController, ToastController, Platform, Events } from 'ionic-angular'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms'
import { Storage } from '@ionic/storage'
import { Camera, CameraOptions } from '@ionic-native/camera'
import * as moment from 'moment'
import * as firebase from 'firebase'
import * as md5 from 'md5'

import { HomePage } from '../home/home'

import { Empleado } from '../../interfaces/empleado'

import { PerfilProvider } from '../../providers/perfil/perfil'
import { TelefonosProvider } from '../../providers/telefonos/telefonos'

import { PasswordValidation } from '../../validators/password/password'
import { FechaNacimientoValidator } from '../../validators/fecha_nacimiento/fecha_nacimiento'
import { UrlValidator } from '../../validators/url/url'
import { NumberValidator } from '../../validators/number/number'

import * as countries from '../../enviroment/countries'

@IonicPage()
@Component({
	selector: 'page-perfil',
	templateUrl: 'perfil.html',
})
export class PerfilPage implements OnInit {
	private editarPerfilForm: FormGroup
	private perfil: Empleado
	private submitted: boolean
	private countries: Array<{name:string; code:string;}> = countries.default
	private maxAge = moment().subtract(18, 'years').format('YYYY-MM-DD')
	private picture: string = 'asjdlksajd'
	
	constructor(
		private navCtrl: NavController, 
		private perfilProvider: PerfilProvider,
		private storage: Storage,
		private _fb: FormBuilder,
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		private toast: ToastController,
		private platform: Platform,
		private camera: Camera,
		private events: Events,
		private telefonosProvider: TelefonosProvider
	) {}
								
	submit (isValid: boolean) {
		this.submitted = true
		if (isValid) {
			let prompt = this.alertCtrl.create({
				title: 'Confirme sus cambios',
				message: 'Para confirmar sus cambios por favor ingrese su actual contraseña',
				inputs: [
					{
						name: 'password',
						placeholder: '**********',
						type: 'password'
					}
				],
				buttons: [
					{
						text: 'Cancelar',
						role: 'cancel'
					},
					{
						text: 'Guardar',
						handler: data => {
							let loading = this.loadingCtrl.create()
							loading.present()

							this.storage.get('auth').then(auth => {
								const password = md5(data.password)
								const model = this.editarPerfilForm

								if (!isNaN(model.value.password)) {
									const control = <FormControl>this.editarPerfilForm.controls['password']
									control.setValue(md5(model.value.password))
								}

								this.perfilProvider.updateEmpleado(this.perfil.id, auth.token, model.value, password).subscribe(res => {
									this.events.publish('empleado:updated', Date.now())
									this.presentToast('Perfil actualizado satisfactoriamente')
									this.navCtrl.setRoot(HomePage)
								}, err => {
									loading.dismiss()
									this.navCtrl.setRoot(HomePage)									
									console.log('ERROR', err)
									this.presentToast('Ha ocurrido un error inesperado')
								}, () => loading.dismiss())
							})
						}
					}
				]
			})
			prompt.present()
		} else {
			this.presentToast('Complete todos los campos de manera correcta')
		}
	}

	private updateHandler (data: any) {
			
	}
								
	ngOnInit () {
		this.editarPerfilForm = this._fb.group({
			email: ['', [
				<any>Validators.required,
				<any>Validators.email
			]],
			password: ['', [
				<any>Validators.minLength(6),
				<any>PasswordValidation.hasNumber,
				<any>PasswordValidation.hasSpecialCaracter,
				<any>PasswordValidation.hasUpperCaseLetter,
				<any>PasswordValidation.hasLowerCaseLetter
			]],
			nombre: ['', [
				<any>Validators.required,
				<any>Validators.minLength(3),
				<any>Validators.maxLength(50)
			]],
			apellido: ['', [
				<any>Validators.required,
				<any>Validators.minLength(3),
				<any>Validators.maxLength(60)
			]],
			fecha_nacimiento: ['', [
				<any>Validators.required,
				<any>FechaNacimientoValidator.Min18YeardOld
			]],
			img_perfil: ['', [
				<any>Validators.required,
				<any>UrlValidator.isValid
			]],
			telefonos: this._fb.array([])
		})
	}
								
	ionViewDidLoad () {
		let loading = this.loadingCtrl.create()
		loading.present()
		this.storage.get('auth').then(auth => {
			this.perfilProvider.getPerfil(auth.id, auth.token).map(perfil => perfil.json() as Empleado).subscribe(res => {
				this.perfil = res[0]

				this.editarPerfilForm.controls['email'].setValue(this.perfil.email)
				this.editarPerfilForm.controls['password'].setValue(this.perfil.password)
				this.editarPerfilForm.controls['nombre'].setValue(this.perfil.nombre)
				this.editarPerfilForm.controls['apellido'].setValue(this.perfil.apellido)
				this.editarPerfilForm.controls['fecha_nacimiento'].setValue(this.perfil.fecha_nacimiento)
				this.editarPerfilForm.controls['img_perfil'].setValue(this.perfil.img_perfil)

				if (this.perfil.telefonos) {
					this.perfil.telefonos.forEach(t => {
						const telefonos = <FormArray>this.editarPerfilForm.controls['telefonos']
						telefonos.push(this.initTelefono(t.id, t.numero, t.prefijo, t.pais))
					})
				}
			}, err => {
				this.presentToast('Ha ocurrido un error procesando su solicitud')
			}, () => loading.dismissAll())
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

  private addToTelefonos () {
    const control = <FormArray>this.editarPerfilForm.controls['telefonos']
    control.push(this.initTelefono())
	}
	
	private removeFromTelefonos (i: number) {
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
						const telefono = this.editarPerfilForm.value.telefonos[i]
						if (!isNaN(telefono.id) && telefono.id !== null) {
							let loading = this.loadingCtrl.create()
							loading.present()
							this.storage.get('auth').then(auth => {
								this.telefonosProvider.deteleTelefono(telefono.id, auth.token, 'empleado').subscribe(res => {
									const control = <FormArray>this.editarPerfilForm.controls['telefonos']
									control.removeAt(i)
									this.presentToast(`Número de teléfono ${telefono.id} ha sido eliminado satisfactoriamente`)
								}, err => {
									loading.dismiss()
									console.log('ERROR', err)
									this.presentToast('No se ha podido eliminar su numero de teléfono')
								}, () => loading.dismiss())
							})
						} else {
							const control = <FormArray>this.editarPerfilForm.controls['telefonos']
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
	
	private abrirGaleria () {
		this.platform.ready().then(() => {
			let cameraOptions: CameraOptions = {
				sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
				destinationType: this.camera.DestinationType.DATA_URL,
				quality: 60,
				encodingType: this.camera.EncodingType.JPEG,
				targetHeight: 400,
				targetWidth: 400,
				correctOrientation: true
			}

			this.camera.getPicture(cameraOptions).then(data => {
				if (data) {
					let loading = this.loadingCtrl.create({ content: 'Subiendo imagen de perfil...' })
					loading.present().then(() => {
						this.upload(data).then(res => {
							loading.dismiss()
							const control = <FormControl>this.editarPerfilForm.controls['img_perfil']
							control.setValue(res.url)
						}).catch(err => {
							loading.dismiss()
							this.presentToast('Ha ocurrido un error inesperado')
						})
					})
				}
			})
		}).catch(err => {
			console.error('ERROR', err)
			this.presentToast('Ha ocurrido un error desconocido, intente de nuevo más tarde')
		})
	}

	private abrirCamara () {
		this.platform.ready().then(() => {
			let cameraOptions: CameraOptions = {
				sourceType: this.camera.PictureSourceType.CAMERA,
				destinationType: this.camera.DestinationType.DATA_URL,
				quality: 60,
				encodingType: this.camera.EncodingType.JPEG,
				targetHeight: 400,
				targetWidth: 400,
				correctOrientation: true
			}

			this.camera.getPicture(cameraOptions).then(data => {
				if (data) {
					let loading = this.loadingCtrl.create({ content: 'Subiendo imagen de perfil...' })
					loading.present().then(() => {
						this.upload(data).then(res => {
							loading.dismiss()
							const control = <FormControl>this.editarPerfilForm.controls['img_perfil']
							control.setValue(res.url)
						}).catch(err => {
							loading.dismiss()
							this.presentToast('Ha ocurrido un error inesperado')
						})
					})
				}
			})
		})
	}

	private upload (data: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const picture = `${data}`
			let storageRef = firebase.storage().ref()
			const filename = Math.floor(Date.now() / 1000)
			const imageRef = storageRef.child(`images/${filename}.jpg`)
			imageRef.putString(picture, firebase.storage.StringFormat.BASE64).then(snapshot => {
				resolve({ url: snapshot.downloadURL })
			}).catch(err => reject(err))
		})
	}
}