import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Platform, Events, Loading } from 'ionic-angular'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms'
import { Storage } from '@ionic/storage'
import { Camera, CameraOptions } from '@ionic-native/camera'
import * as moment from 'moment'
import * as firebase from 'firebase'

import { Empleado } from '../../interfaces/empleado'

import { EmpleadosProvider } from '../../providers/empleados/empleados'
import { TelefonosProvider } from '../../providers/telefonos/telefonos'

import { FechaNacimientoValidator } from '../../validators/fecha_nacimiento/fecha_nacimiento'
import { NumberValidator } from '../../validators/number/number'
import { TextValidator } from '../../validators/text/text'

import * as countries from '../../enviroment/countries'

@IonicPage()
@Component({
  selector: 'page-editar-empleado',
  templateUrl: 'editar-empleado.html',
})
export class EditarEmpleadoPage {
  private editarEmpleadoForm: FormGroup
	private empleado: Empleado
	private submitted: boolean
	private countries: Array<{name:string; code:string;}>
	private maxAge
  private roles: Array<{ id: number; nombre: string; }>
  private loading: Loading
	
	constructor(
		private navCtrl: NavController, 
		private empleadosProvider: EmpleadosProvider,
		private storage: Storage,
		private _fb: FormBuilder,
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		private toast: ToastController,
		private platform: Platform,
    public navParams: NavParams,
    private telefonosProvider: TelefonosProvider,
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
          const model: Empleado = this.editarEmpleadoForm.value
          
          this.empleadosProvider.updateEmpleado(model, auth.token).subscribe(res => {
            this.events.publish('empleado:updated', Date.now())
            this.presentToast('Empleado actualizado satisfactoriamente')
            this.navCtrl.pop()
          }, err => {
            this.submitted = false
            loading.dismiss()					
            console.log('ERROR', err)
            this.presentToast(err._body.error ? JSON.parse(err._body).error.message : 'Ha ocurrido un error inesperado')
          }, () => loading.dismiss())
        })
      })
		} else {
			this.presentToast('Complete todos los campos de manera correcta')
		}
  }
  
	ngOnInit () {
		this.editarEmpleadoForm = this._fb.group({
      id: [null, [
        <any>Validators.required,
        <any>NumberValidator.isValid
      ]],
			email: ['', [
				<any>Validators.required,
				<any>Validators.email
			]],
			nombre: ['', [
				<any>Validators.required,
				<any>Validators.minLength(3),
				<any>Validators.maxLength(50),
				<any>TextValidator.isValid
			]],
			apellido: ['', [
				<any>Validators.required,
				<any>Validators.minLength(3),
				<any>Validators.maxLength(60),
				<any>TextValidator.isValid
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
  
	ionViewDidLoad () {
    this.empleado = this.navParams.get('empleado')

    this.editarEmpleadoForm.controls['id'].setValue(this.empleado.id)
    this.editarEmpleadoForm.controls['nombre'].setValue(this.empleado.nombre)
    this.editarEmpleadoForm.controls['apellido'].setValue(this.empleado.apellido)
    this.editarEmpleadoForm.controls['email'].setValue(this.empleado.email)
    this.editarEmpleadoForm.controls['fecha_nacimiento'].setValue(this.empleado.fecha_nacimiento)
    this.editarEmpleadoForm.controls['img_perfil'].setValue(this.empleado.img_perfil)
    const group = <FormGroup>this.editarEmpleadoForm.controls['role']
    const control = <FormControl>group.controls['id']
    control.setValue(this.empleado.role.id)

    if (this.empleado.telefonos) {
      this.empleado.telefonos.forEach(t => {
        const telefonos = <FormArray>this.editarEmpleadoForm.controls['telefonos']
				telefonos.push(this.initTelefono(t.id, t.numero, t.prefijo, t.pais))
      })
    }
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
  
  addToTelefonos () {
    const control = <FormArray>this.editarEmpleadoForm.controls['telefonos']
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
            const telefono = this.editarEmpleadoForm.value.telefonos[i]
						if (!isNaN(telefono.id) && telefono.id !== null) {
              this.createLoader()
              this.loading.present().then(() => {
                this.storage.get('auth').then(auth => {
                  this.telefonosProvider.deteleTelefono(telefono.id, auth.token, 'empleado').subscribe(res => {
                    const control = <FormArray>this.editarEmpleadoForm.controls['telefonos']
                    control.removeAt(i)
                    this.presentToast(`Número de teléfono ${telefono.id} ha sido eliminado satisfactoriamente`)
                    this.events.publish('empleado:updated', this.editarEmpleadoForm.value.id, Date.now())
                  }, err => {
                    console.log('ERROR', err)
                    this.loading.dismiss()
                    this.presentToast('No se ha podido eliminar su número de teléfono')
                  }, () => this.loading.dismiss())
                })
              })
						} else {
							const control = <FormArray>this.editarEmpleadoForm.controls['telefonos']
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
							const control = <FormControl>this.editarEmpleadoForm.controls['img_perfil']
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
							const control = <FormControl>this.editarEmpleadoForm.controls['img_perfil']
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
  
  private createLoader (message: string = '') {
    this.loading = this.loadingCtrl.create({
      content: message
    })
  }

}
