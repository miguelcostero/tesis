import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventoDetallesPage } from './evento-detalles';

@NgModule({
  declarations: [
    EventoDetallesPage,
  ],
  imports: [
    IonicPageModule.forChild(EventoDetallesPage),
  ],
  exports: [
    EventoDetallesPage
  ]
})
export class EventoDetallesPageModule {}
