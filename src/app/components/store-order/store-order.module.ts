import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreOrderModuleRoute } from './store-order.route';
import { StoreOrderComponent } from './store-order.component';
import { NgxMaskModule } from 'ngx-mask';
import { IMaskModule} from 'angular-imask';

@NgModule({
  imports: [
    CommonModule,
    StoreOrderModuleRoute,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    NgxMaskModule
  ],
  declarations: [
    StoreOrderComponent
  ]
})

export class StoreOrderModule { }
