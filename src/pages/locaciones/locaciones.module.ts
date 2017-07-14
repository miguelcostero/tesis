import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocacionesPage } from './locaciones';

@NgModule({
  declarations: [
    LocacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(LocacionesPage),
  ],
  exports: [
    LocacionesPage
  ]
})
export class LocacionesPageModule {}
