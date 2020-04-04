import { Component } from '@angular/core';
import { AppService } from './app.service';
import { AuthService } from './AuthService';
import { user } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent {

  public tela: string;

  public message:any;

  public url:boolean = false

  constructor(private appService: AppService,
              private authService: AuthService
              ) {}

  ngOnInit() {
    this.tela = this.appService.router_app_componet;
    this.token()
    this.getRouterPage()
  }

  public getRouterPage(){
    let router = window.location.href.split('/' ) 
    if(router[3]  == 'login' || router[3]  == 'register'){
      this.url = true
    }else{
      this.url = false
    }
  }

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
    this.getRouterPage()
  }
}
