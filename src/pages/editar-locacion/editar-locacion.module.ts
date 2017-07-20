import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarLocacionPage } from './editar-locacion';

@NgModule({
  declarations: [
    EditarLocacionPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarLocacionPage),
  ],
  exports: [
    EditarLocacionPage
  ]
})
export class EditarLocacionPageModule {}
