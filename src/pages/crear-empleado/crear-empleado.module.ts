import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearEmpleadoPage } from './crear-empleado';

@NgModule({
  declarations: [
    CrearEmpleadoPage,
  ],
  imports: [
    IonicPageModule.forChild(CrearEmpleadoPage),
  ],
  exports: [
    CrearEmpleadoPage
  ]
})
export class CrearEmpleadoPageModule {}
