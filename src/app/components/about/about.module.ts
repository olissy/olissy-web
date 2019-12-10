import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutRoute } from './about.route'
import { AboutComponent } from './about.component'

@NgModule({
  imports: [
    CommonModule,
    AboutRoute,
  ],
  declarations: [AboutComponent]
})

export class AboutModule {}