import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomescreenPageRoutingModule } from './homescreen-routing.module';

import { HomescreenPage } from './homescreen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomescreenPageRoutingModule
  ],
  declarations: [HomescreenPage]
})
export class HomescreenPageModule {}
