import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientHeaderComponent } from './client-header.component';
import { SearchInputModule } from '../search-input/search-input.module';

@NgModule({
  declarations: [ClientHeaderComponent],
  imports: [
    CommonModule,
    SearchInputModule
  ]
})
export class ClientHeaderModule {}
