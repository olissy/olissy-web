import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreProductRecordRoute } from './store-product-record.route';
import { StoreProductRecordComponent } from './store-product-record.component';
import { NgxMaskModule } from 'ngx-mask';
import { IMaskModule} from 'angular-imask';
import { SearchInputModule } from '../search-input/search-input.module';

@NgModule({
  imports: [
    CommonModule,
    StoreProductRecordRoute,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    NgxMaskModule,
    SearchInputModule
  ],
  declarations: [
    StoreProductRecordComponent
  ]
})

export class StoreProductRecordModule { }

