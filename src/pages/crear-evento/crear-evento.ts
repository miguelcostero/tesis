import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, ToastController, LoadingController, AlertController, Events, ModalController } from 'ionic-angular'
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms'
import { Storage } from '@ionic/storage'

import { Evento } from '../../interfaces/evento'
import { Cliente } from '../../interfaces/cliente'
import { TipoEvento } from '../../interfaces/tipo_evento'
import { EstadoEvento } from '../../interfaces/estado_evento'
import { Locacion } from '../../interfaces/locacion'

import { EventosProvider } from '../../providers/eventos/eventos'

import * as iconos from '../../enviroment/iconos'

import { SeleccionarClienteEventoComponent } from '../../components/seleccionar-cliente-evento/seleccionar-cliente-evento'
import { SeleccionarEstadoEventoComponent } from '../../components/seleccionar-estado-evento/seleccionar-estado-evento'
import { SeleccionarLocacionEventoComponent } from '../../components/seleccionar-locacion-evento/seleccionar-locacion-evento'
import { SeleccionarTipoEventoComponent } from '../../components/seleccionar-tipo-evento/seleccionar-tipo-evento'

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
  private today: string = moment().format('YYYY-MM-DD')
  private evento: {
    cliente: Cliente;
    tipo_evento: TipoEvento;
    estado_evento: EstadoEvento;
    locacion: Locacion;
    icono: string;
  } = {
    cliente: null,
    tipo_evento: null,
    estado_evento: null,
    locacion: null,
    icono: 'coffee'
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
      })
    })
  }

  private removeFromCronograma (i: number) {
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

  private selectCliente (cliente) {
    let modal = this.modalCtrl.create(SeleccionarClienteEventoComponent, { cliente })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.cliente = res
      if (res) {
        this.cambiarIdOnSeleccionar('cliente', res.id)
      }
    })

  }

  private selectLocacion (locacion) {
    let modal = this.modalCtrl.create(SeleccionarLocacionEventoComponent, { locacion })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.locacion = res
      if (res) {
        this.cambiarIdOnSeleccionar('locacion', res.id)        
      }
    })

  }

  private selectEstadoEvento (estado_evento) {
    let modal = this.modalCtrl.create(SeleccionarEstadoEventoComponent, { estado_evento })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.estado_evento = res
      if (res) {
        this.cambiarIdOnSeleccionar('estado_evento', res.id)        
      }
    })

  }

  private selectTipoEvento (tipo_evento) {
    let modal = this.modalCtrl.create(SeleccionarTipoEventoComponent, { tipo_evento })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.tipo_evento = res
      if (res) {
        this.cambiarIdOnSeleccionar('tipo_evento', res.id)
      }
    })
  }

  private addToCronograma () {
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
