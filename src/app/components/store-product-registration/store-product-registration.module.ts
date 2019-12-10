import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreProductRegistrationRoute } from './store-product-registration.route';
import { StoreProductRegistrationComponent } from './store-product-registration.component';
import { NgxMaskModule } from 'ngx-mask';
import { IMaskModule} from 'angular-imask';
import { SearchInputModule } from '../search-input/search-input.module';

@NgModule({
  imports: [
    CommonModule,
    StoreProductRegistrationRoute,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    NgxMaskModule,
    SearchInputModule
  ],
  declarations: [
    StoreProductRegistrationComponent
  ]
})

export class StoreProductRegistrationModule { }

