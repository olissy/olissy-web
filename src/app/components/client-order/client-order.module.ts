import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientOrderRoute } from './client-order.route';
import { ClientOrderComponent } from './client-order.component';
@NgModule({
  imports: [
    CommonModule,
    ClientOrderRoute,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ 
    ClientOrderComponent
  ]
})
export class ClientOrderModule { }
