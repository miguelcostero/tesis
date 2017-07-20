import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarClientePage } from './editar-cliente';

@NgModule({
  declarations: [
    EditarClientePage,
  ],
  imports: [
    IonicPageModule.forChild(EditarClientePage),
  ],
  exports: [
    EditarClientePage
  ]
})
export class EditarClientePageModule {}
