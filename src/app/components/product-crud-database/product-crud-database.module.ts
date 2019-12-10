
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { IMaskModule} from 'angular-imask';
import { SearchInputModule } from '../search-input/search-input.module';
import { ProductCrudDatabaseRoute } from './product-crud-database.route';
import { ProductCrudDatabaseComponent } from './product-crud-database.component';

@NgModule({
  imports: [
    CommonModule,
    ProductCrudDatabaseRoute,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,
    IMaskModule,
    SearchInputModule
  ],
  declarations: [ProductCrudDatabaseComponent]

})

export class ProductCrudDatabaseModule { }

