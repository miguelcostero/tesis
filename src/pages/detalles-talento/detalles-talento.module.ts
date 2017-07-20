import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallesTalentoPage } from './detalles-talento';

@NgModule({
  declarations: [
    DetallesTalentoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallesTalentoPage),
  ],
  exports: [
    DetallesTalentoPage
  ]
})
export class DetallesTalentoPageModule {}
