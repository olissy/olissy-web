import { Component } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from './AuthService';
import { user } from './interfaces';
//import { MessagingService } from "./messaging.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent {

  public tela: string;

  public message:any;

  constructor(private appService: AppService,
              private authService: AuthService,
              //private msgService: MessagingService
              ) {}

  ngOnInit() {
    this.tela = this.appService.router_app_componet;
    this.token();


    new Notification('Saulo Silva', {
      body: "Obrigado por entra no meu site",
      icon: "http://localhost:4200/assets/logo/logo.png",
      image: "http://localhost:4200/assets/developer/developer.jpg",
      requireInteraction : true,
      vibrate: [200, 100, 200],
      silent: false
    });
  }

  /** Push Notifications 
  getMessage() {
    this.msgService.getPermission()
    this.msgService.receiveMessage()
    this.message = this.msgService.currentMessage
  }
  */


  public token() {
    this.authService.isLogged().subscribe((res: any) => {
      if (res != null){
        this.authService.getByFOREIGN_KEY('user', res.uid).subscribe((user: [user]) => {
          if(Object.keys(user).length == 0){
          }else{
            if (user[0].userType === 1) {
              this.appService.router_app_componet = 'cliente';
            }
            if (user[0].userType === 2) {
              this.appService.router_app_componet = 'comercio';
            }
          }
        });
      }
    });
  }

  ngDoCheck() {
    this.tela = this.appService.router_app_componet;
  }
}
