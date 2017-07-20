import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearTalentoPage } from './crear-talento';

@NgModule({
  declarations: [
    CrearTalentoPage,
  ],
  imports: [
    IonicPageModule.forChild(CrearTalentoPage),
  ],
  exports: [
    CrearTalentoPage
  ]
})
export class CrearTalentoPageModule {}
