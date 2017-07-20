import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarTalentoPage } from './editar-talento';

@NgModule({
  declarations: [
    EditarTalentoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarTalentoPage),
  ],
  exports: [
    EditarTalentoPage
  ]
})
export class EditarTalentoPageModule {}
