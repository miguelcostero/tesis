import { Component } from '@angular/core'
import { IonicPage, NavController, LoadingController, AlertController, ToastController, Platform, Events } from 'ionic-angular'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms'
import { Storage } from '@ionic/storage'
import { Camera, CameraOptions } from '@ionic-native/camera'
import * as moment from 'moment'
import * as firebase from 'firebase'
import * as md5 from 'md5'

import { Empleado } from '../../interfaces/empleado'

import { EmpleadosProvider } from '../../providers/empleados/empleados'

import { PasswordValidation } from '../../validators/password/password'
import { FechaNacimientoValidator } from '../../validators/fecha_nacimiento/fecha_nacimiento'
import { NumberValidator } from '../../validators/number/number'

import * as countries from '../../enviroment/countries'

@IonicPage()
@Component({
  selector: 'page-crear-empleado',
  templateUrl: 'crear-empleado.html',
})
export class CrearEmpleadoPage {
  private crearEmpleadoForm: FormGroup
	private submitted: boolean
	private countries: Array<{name:string; code:string;}>
	private maxAge
  private roles: Array<{ id: number; nombre: string; }>
	
	constructor(
		private navCtrl: NavController, 
		private empleadosProvider: EmpleadosProvider,
		private storage: Storage,
		private _fb: FormBuilder,
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		private toast: ToastController,
		private platform: Platform,
		private camera: Camera,
		private events: Events
	) {
		this.countries = countries.default
    this.maxAge = moment().subtract(18, 'years').format('YYYY-MM-DD')
    this.roles = [
      {
        id: 1,
        nombre: 'Empleado'
      },
      {
        id: 2,
        nombre: 'Administrador'
      },
      {
        id: 3,
        nombre: 'Desarrollador'
      }
    ]
  }
  
	submit (isValid: boolean) {
		if (isValid) {
      this.submitted = true
			let loading = this.loadingCtrl.create()
      loading.present().then(() => {
        this.storage.get('auth').then(auth => {
					const model: Empleado = this.crearEmpleadoForm.value
					
					if (model.password) {
						const control = <FormControl>this.crearEmpleadoForm.controls['password']
						control.setValue(md5(model.password))
					}
          
          this.empleadosProvider.createEmpleado(model, auth.token).subscribe(res => {
            this.events.publish('empleado:created', Date.now())
            this.presentToast('Empleado creado satisfactoriamente')
            this.navCtrl.pop()
          }, err => {
            this.submitted = false
            loading.dismiss()					
            console.log('ERROR', err)
            this.presentToast(JSON.parse(err._body).error ? JSON.parse(err._body).error.message : 'Ha ocurrido un error inesperado')
          }, () => loading.dismiss())
        })
      })
		} else {
			this.presentToast('Complete todos los campos de manera correcta')
		}
  }
  
	ngOnInit () {
		this.crearEmpleadoForm = this._fb.group({
			email: ['', [
				<any>Validators.required,
				<any>Validators.email
			]],
			password: ['', [
        <any>Validators.required,
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
			fecha_nacimiento: [this.maxAge, [
				<any>Validators.required,
				<any>FechaNacimientoValidator.Min18YeardOld
			]],
			img_perfil: [
        'https://firebasestorage.googleapis.com/v0/b/tesis-7ffec.appspot.com/o/images%2Fdefault.jpg?alt=media&token=b8df4b4f-f263-446d-b7b9-fc6b76ac6972', 
        [
          <any>Validators.required
        ]
      ],
      role: this._fb.group({
        id: ['', [
          <any>Validators.required
        ]]
      }),
			telefonos: this._fb.array([])
		})
	}
  
	ionViewDidLoad () {}
  
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
  
  addToTelefonos () {
    const control = <FormArray>this.crearEmpleadoForm.controls['telefonos']
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
						const control = <FormArray>this.crearEmpleadoForm.controls['telefonos']
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
	
	abrirGaleria () {
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
							const control = <FormControl>this.crearEmpleadoForm.controls['img_perfil']
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
  
	abrirCamara () {
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
							const control = <FormControl>this.crearEmpleadoForm.controls['img_perfil']
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
