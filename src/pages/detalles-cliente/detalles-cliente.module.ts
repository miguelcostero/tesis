import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallesClientePage } from './detalles-cliente';

@NgModule({
  declarations: [
    DetallesClientePage,
  ],
  imports: [
    IonicPageModule.forChild(DetallesClientePage),
  ],
  exports: [
    DetallesClientePage
  ]
})
export class DetallesClientePageModule {}
