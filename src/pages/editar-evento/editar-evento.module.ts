import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarEventoPage } from './editar-evento';

@NgModule({
  declarations: [
    EditarEventoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarEventoPage),
  ],
  exports: [
    EditarEventoPage
  ]
})
export class EditarEventoPageModule {}
