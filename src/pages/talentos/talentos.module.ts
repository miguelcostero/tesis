import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TalentosPage } from './talentos';

@NgModule({
  declarations: [
    TalentosPage,
  ],
  imports: [
    IonicPageModule.forChild(TalentosPage),
  ],
  exports: [
    TalentosPage
  ]
})
export class TalentosPageModule {}
