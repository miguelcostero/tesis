import { Component, OnInit } from '@angular/core'
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController, Events } from 'ionic-angular'
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms'
import { Storage } from '@ionic/storage'

import { EventosProvider } from '../../providers/eventos/eventos'

import { Evento } from '../../interfaces/evento'

import * as iconos from '../../enviroment/iconos'

import { SeleccionarClienteEventoComponent } from '../../components/seleccionar-cliente-evento/seleccionar-cliente-evento'
import { SeleccionarEstadoEventoComponent } from '../../components/seleccionar-estado-evento/seleccionar-estado-evento'
import { SeleccionarLocacionEventoComponent } from '../../components/seleccionar-locacion-evento/seleccionar-locacion-evento'
import { SeleccionarTipoEventoComponent } from '../../components/seleccionar-tipo-evento/seleccionar-tipo-evento'
import { SeleccionarTalentoEventoComponent } from '../../components/seleccionar-talento-evento/seleccionar-talento-evento'

import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-editar-evento',
  templateUrl: 'editar-evento.html',
})
export class EditarEventoPage implements OnInit {
  private evento: Evento
  private editarEventoForm: FormGroup
  private submitted: boolean
  private iconos: Array<string>
  private today: string

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private eventosProvider: EventosProvider,
    private _fb: FormBuilder,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private events: Events
  ) {
    this.evento = this.navParams.get('evento')
    this.iconos = iconos.default
    this.today = moment().format('YYYY-MM-DD')
  }

  editar (model: Evento, isValid: boolean) {
    this.submitted = true
    if (isValid) {
      let loading = this.loadingCtrl.create()
      loading.present()
      this.storage.get('auth').then(auth => {
        this.eventosProvider.editEvento(model, auth.token).subscribe(res => {
          let eventoEditado = res.json()
          this.events.publish('eventos:edited', eventoEditado, Date.now())
          this.presentToast(`Evento ${eventoEditado.id} actualizado correctamente`)
          this.navCtrl.pop()
        }, err => {
          loading.dismissAll()
          this.presentToast(`Ha ocurrido un error procesando su solicitud`);
          console.log('ERROR', err)
        }, () => {
          loading.dismissAll()
        })
      })
    } else {
      this.presentToast(`Complete todos los campos de manera válida`)
    }
  }

  initCronograma () {
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
        if (this.evento.talentos.length > 0) {
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
            const control = <FormArray>this.editarEventoForm.controls['talentos']
            control.push(this.initTalentos(res.id))
            this.evento.talentos.push(res)
          }
        } else {
          this.evento.talentos.push(res)
          const control = <FormArray>this.editarEventoForm.controls['talentos']
          control.push(this.initTalentos(res.id))
        }
      }
    })
  }

  addToCronograma () {
    const control = <FormArray>this.editarEventoForm.controls['cronograma']
    control.push(this.initCronograma())
  }

  selectCliente (cliente) {
    let modal = this.modalCtrl.create(SeleccionarClienteEventoComponent, { cliente })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.cliente = res
      this.cambiarIdOnSeleccionar('cliente', res.id)
    })
  }

  selectLocacion (locacion) {
    let modal = this.modalCtrl.create(SeleccionarLocacionEventoComponent, { locacion })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.locacion = res
      this.cambiarIdOnSeleccionar('locacion', res.id)
    })

  }

  selectEstadoEvento (estado_evento) {
    let modal = this.modalCtrl.create(SeleccionarEstadoEventoComponent, { estado_evento })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.estado_evento.nombre = res.nombre
      this.cambiarIdOnSeleccionar('estado_evento', res.id)
    })

  }

  selectTipoEvento (tipo_evento) {
    let modal = this.modalCtrl.create(SeleccionarTipoEventoComponent, { tipo_evento })
    modal.present()
    modal.onDidDismiss(res => {
      this.evento.tipo_evento.nombre = res.nombre
      this.cambiarIdOnSeleccionar('tipo_evento', res.id)
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
            const control = <FormArray>this.editarEventoForm.controls['cronograma']
            control.removeAt(i)
          }
        }
      ]
    })
    alert.present()
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
            const control = <FormArray>this.editarEventoForm.controls['talentos']
            control.removeAt(i)
            this.evento.talentos.splice(i, 1)
          }
        }
      ]
    })
    alert.present()
  }

  ngOnInit () {
    let cronograma = []
    let talentos = []

    if (this.evento.cronograma) {
      this.evento.cronograma.forEach(ev => {
        cronograma.push(this._fb.group({
          id: [ev.id, [
            <any>Validators.required
          ]],
          descripcion: [ev.descripcion, [
            <any>Validators.required,
            <any>Validators.maxLength(150),
            <any>Validators.minLength(10)
          ]],
          fecha: [ev.fecha, [
            <any>Validators.required
          ]],
          hora: [ev.hora, [
            <any>Validators.required
          ]],
          notas: [ev.notas, [
            <any>Validators.minLength(10)
          ]]
        }))
      })
    } else {
      cronograma.push(this.initCronograma())
    }

    if (this.evento.talentos) {
      this.evento.talentos.forEach(t => {
        talentos.push(this.initTalentos(t.id))
      })
    }

    this.editarEventoForm = this._fb.group({
      id: [this.evento.id, [
        <any>Validators.required
      ]],
      nombre: [this.evento.nombre, [
        <any>Validators.required, 
        <any>Validators.minLength(5),
        <any>Validators.maxLength(100)
      ]],
      descripcion: [this.evento.descripcion, [
        <any>Validators.required,
        <any>Validators.minLength(15),
        <any>Validators.maxLength(150)
      ]],
      icono: [this.evento.icono, [
        <any>Validators.required,
        <any>Validators.minLength(3),
        <any>Validators.maxLength(60)
      ]],
      invitados: [this.evento.invitados, [
        <any>Validators.required
      ]],
      tipo_evento: this._fb.group({
        id: [this.evento.tipo_evento.id, [
          <any>Validators.required
        ]]
      }),
      locacion: this._fb.group({
        id: [this.evento.locacion.id, [
          <any>Validators.required
        ]]
      }),
      cliente: this._fb.group({
        id: [this.evento.cliente.id, [
          <any>Validators.required
        ]]
      }),
      estado_evento: this._fb.group({
        id: [this.evento.estado_evento.id, [
          <any>Validators.required
        ]]
      }),
      cronograma: this._fb.array(cronograma),
      talentos: this._fb.array(talentos)
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
    const controlGroup = <FormGroup>this.editarEventoForm.controls[group]
    const control = <FormControl>controlGroup.controls['id']
    control.setValue(id)
  }

}
