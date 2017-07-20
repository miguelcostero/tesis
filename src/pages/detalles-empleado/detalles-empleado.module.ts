import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallesEmpleadoPage } from './detalles-empleado';

@NgModule({
  declarations: [
    DetallesEmpleadoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallesEmpleadoPage),
  ],
  exports: [
    DetallesEmpleadoPage
  ]
})
export class DetallesEmpleadoPageModule {}
