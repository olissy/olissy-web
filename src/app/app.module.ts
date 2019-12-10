import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';
import { IMaskModule } from 'angular-imask';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AppRoute } from './app.route';
import { AuthService } from './AuthService';

import { ClientColumnComponent } from './components/client-column/client-column.component';
import { ClientHeaderComponent } from './components/client-header/client-header.component';
import { StoreColumnComponent } from './components/store-column/store-column.component';
import { StoreHeaderComponent } from './components/store-header/store-header.component';
import { UserColumnComponent } from './components/user-column/user-column.component';
import { UserHeaderComponent } from './components/user-header/user-header.component';

const olissyWebKey = {
  apiKey: "AIzaSyBTEcMPuVzjYhUDa2drm2Cxco4-vZRfxl4",
  authDomain: "olissy-web.firebaseapp.com",
  databaseURL: "https://olissy-web.firebaseio.com",
  projectId: "olissy-web",
  storageBucket: "olissy-web.appspot.com",
  messagingSenderId: "462995326690",
  appId: "1:462995326690:web:c82e5d6d6590a069fd80bb"
};

@NgModule({
  declarations: [
    AppComponent,
    ClientColumnComponent,
    ClientHeaderComponent,
    StoreColumnComponent,
    StoreHeaderComponent,
    UserColumnComponent,
    UserHeaderComponent
  ],
  imports: [
    NgxMaskModule.forRoot(),
    AngularFireModule.initializeApp(olissyWebKey),
    IMaskModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserModule,
    HttpClientModule,
    AppRoute,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AppService, AngularFirestore, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
