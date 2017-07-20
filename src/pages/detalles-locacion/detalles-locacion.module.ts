import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallesLocacionPage } from './detalles-locacion';

@NgModule({
  declarations: [
    DetallesLocacionPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallesLocacionPage),
  ],
  exports: [
    DetallesLocacionPage
  ]
})
export class DetallesLocacionPageModule {}
