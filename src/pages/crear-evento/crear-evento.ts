import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, ToastController, LoadingController, AlertController, Events, ModalController } from 'ionic-angular'
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms'
import { Storage } from '@ionic/storage'

import { Evento } from '../../interfaces/evento'
import { Cliente } from '../../interfaces/cliente'
import { TipoEvento } from '../../interfaces/tipo_evento'
import { EstadoEvento } from '../../interfaces/estado_evento'
import { Locacion } from '../../interfaces/locacion'
import { Talento } from '../../interfaces/talento'

import { EventosProvider } from '../../providers/eventos/eventos'

import * as iconos from '../../enviroment/iconos'

import { SeleccionarClienteEventoComponent } from '../../components/seleccionar-cliente-evento/seleccionar-cliente-evento'
import { SeleccionarEstadoEventoComponent } from '../../components/seleccionar-estado-evento/seleccionar-estado-evento'
import { SeleccionarLocacionEventoComponent } from '../../components/seleccionar-locacion-evento/seleccionar-locacion-evento'
import { SeleccionarTipoEventoComponent } from '../../components/seleccionar-tipo-evento/seleccionar-tipo-evento'
import { SeleccionarTalentoEventoComponent } from '../../components/seleccionar-talento-evento/seleccionar-talento-evento'

import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-crear-evento',
  templateUrl: 'crear-evento.html',
})
export class CrearEventoPage implements OnInit {
  private crearEventoForm: FormGroup
  private submitted: boolean
  private iconos: Array<string>
  private today: string
  private evento: {
    cliente: Cliente;
    tipo_evento: TipoEvento;
    estado_evento: EstadoEvento;
    locacion: Locacion;
    icono: string;
    talentos: Talento[];
  } = {
    cliente: null,
    tipo_evento: null,
    estado_evento: null,
    locacion: null,
    icono: 'coffee',
    talentos: []
  }

  constructor(
    private navCtrl: NavController,
    private eventosProvider: EventosProvider,
    private _fb: FormBuilder,
    private storage: Storage,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private events: Events,
    private modalCtrl: ModalController
  ) {
    this.iconos = iconos.default
    this.today = moment().format('YYYY-MM-DD')
  }

  submit (isValid: boolean) {
    this.submitted = true
    this.storage.get('auth').then(auth => {

      const controlGroup = <FormGroup>this.crearEventoForm.controls['empleado']
      const control = <FormControl>controlGroup.controls['id']
      control.setValue(auth.id)

      if (isValid) {
        let loading = this.loadingCtrl.create()
        loading.present()
          
        this.eventosProvider.createEvento(this.crearEventoForm.value, auth.token).subscribe(res => {
          let evento = res.json().evento
          this.events.publish('eventos:added', evento.id, Date.now())
          this.presentToast(`Evento ${evento.id} creado satisfactoriamente`)
          this.navCtrl.pop()
        }, err => {
          loading.dismissAll()
          this.presentToast(`Ha ocurrido un error procesando su solicitud`);
          console.log('ERROR', err)
        }, () => {
          loading.dismissAll()
        })
      } else {
        this.presentToast(`Complete todos los campos de manera válida`)
      }
    })
  }

  ngOnInit () {
    this.crearEventoForm = this._fb.group({
      nombre: ['', [
        <any>Validators.required, 
        <any>Validators.minLength(5),
        <any>Validators.maxLength(100)
      ]],
      descripcion: ['', [
        <any>Validators.required,
        <any>Validators.minLength(15),
        <any>Validators.maxLength(150)
      ]],
      icono: ['', [
        <any>Validators.required,
        <any>Validators.minLength(3),
        <any>Validators.maxLength(60)
      ]],
      invitados: ['', [
        <any>Validators.required
      ]],
      tipo_evento: this._fb.group({
        id: ['', [
          <any>Validators.required
        ]]
      }),
      locacion: this._fb.group({
         id: ['', [
        <any>Validators.required
        ]]
      }),
      cliente: this._fb.group({
        id: ['', [
          <any>Validators.required
        ]]
      }),
      estado_evento: this._fb.group({
        id: ['', [
          <any>Validators.required
        ]]
      }),
      cronograma: this._fb.array([
        this.initCronograma()
      ]),
      empleado: this._fb.group({
        id: ['']
      }),
      talentos: this._fb.array([])
    })
  }

  removeFromCronograma (i: number) {
    let alert = this.alertCtrl.create({
      title: `¿Desea eliminar evento interno?`,
      message: 'Este evento interno no podrá ser recuperado',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Eliminar',
          handler: () => {
            const control = <FormArray>this.crearEventoForm.controls['cronograma']
            control.removeAt(i)
          }
        }
      ]
    })
    alert.present()
  }

  initTalentos (id: number = null) {
    return this._fb.group({
      id: [id, [
        <any>Validators.required
      ]]
    })
  }

  selectTalento () {
    let modal = this.modalCtrl.create(SeleccionarTalentoEventoComponent)
    modal.present()
    modal.onDidDismiss(res => {
      if (res) {
        if (this.evento.talentos) {
          console.log('betaaa')
          let existe = false
          this.evento.talentos.forEach(talento => {
            if (talento.id == res.id) {
              existe = true
              let alert = this.alertCtrl.create({
                title: 'Talento incluido en el evento',
                message: 'Este talento ya ha sido incluido en este evento',
                buttons: [ 'Ok' ]
              })
              alert.present()
            }
          })

          if (existe == false) {
            const control = <FormArray>this.crearEventoForm.controls['talentos']
            control.push(this.initTalentos(res.id))
            this.evento.talentos.push(res)
          }
        } else {
          const control = <FormArray>this.crearEventoForm.controls['talentos']
          control.push(this.initTalentos(res.id))
          this.evento.talentos.push(res)
        }
      }
    })
  }

  removeFromTalentos (i: number) {
    let alert = this.alertCtrl.create({
      title: `¿Desea eliminar este talento del evento?`,
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Eliminar',
          handler: () => {
            const control = <FormArray>this.crearEventoForm.controls['talentos']
            control.removeAt(i)
            this.evento.talentos.splice(i, 1)
          }
        }
      ]
    })
    alert.present()
  }

  selectCliente (cliente) {
    let modal = this.modalCtrl.create(SeleccionarClienteEventoComponent, { cliente })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.cliente = res
      if (res) {
        this.cambiarIdOnSeleccionar('cliente', res.id)
      }
    })

  }

  selectLocacion (locacion) {
    let modal = this.modalCtrl.create(SeleccionarLocacionEventoComponent, { locacion })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.locacion = res
      if (res) {
        this.cambiarIdOnSeleccionar('locacion', res.id)        
      }
    })

  }

  selectEstadoEvento (estado_evento) {
    let modal = this.modalCtrl.create(SeleccionarEstadoEventoComponent, { estado_evento })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.estado_evento = res
      if (res) {
        this.cambiarIdOnSeleccionar('estado_evento', res.id)        
      }
    })

  }

  selectTipoEvento (tipo_evento) {
    let modal = this.modalCtrl.create(SeleccionarTipoEventoComponent, { tipo_evento })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.tipo_evento = res
      if (res) {
        this.cambiarIdOnSeleccionar('tipo_evento', res.id)
      }
    })
  }

  addToCronograma () {
    const control = <FormArray>this.crearEventoForm.controls['cronograma']
    control.push(this.initCronograma())
  }

  private initCronograma () {
    return this._fb.group({
      descripcion: ['', [
        <any>Validators.required,
        <any>Validators.maxLength(150),
        <any>Validators.minLength(10)
      ]],
      fecha: ['', [
        <any>Validators.required
      ]],
      hora: ['', [
        <any>Validators.required
      ]],
      notas: ['', [
        <any>Validators.minLength(10)
      ]]
    })
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

  private cambiarIdOnSeleccionar (group: string, id: number) {
    const controlGroup = <FormGroup>this.crearEventoForm.controls[group]
    const control = <FormControl>controlGroup.controls['id']
    control.setValue(id)
  }

}
