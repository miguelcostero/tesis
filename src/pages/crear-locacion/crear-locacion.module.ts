import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearLocacionPage } from './crear-locacion';

@NgModule({
  declarations: [
    CrearLocacionPage,
  ],
  imports: [
    IonicPageModule.forChild(CrearLocacionPage),
  ],
  exports: [
    CrearLocacionPage
  ]
})
export class CrearLocacionPageModule {}
