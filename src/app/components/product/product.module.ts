
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoute } from './product.route';
import { ProductComponent } from './product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { IMaskModule} from 'angular-imask';
import { SearchInputModule } from '../search-input/search-input.module';

@NgModule({
  imports: [
    CommonModule,
    ProductRoute,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,
    IMaskModule, 
    SearchInputModule
  ],
  declarations: [ProductComponent,]

})

export class ProductModule { }

