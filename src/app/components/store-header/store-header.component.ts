import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { StoreHeaderService } from './store-header.service'
import { AppService } from '../../app.service'
import { AuthService  } from '../../AuthService';
import { store } from '../../interfaces';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-store-header',
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.css']
})

export class StoreHeaderComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public store:any = {storeImageUrl :""}

  public newMessage

  public pedidos:any = []

  public PopularUsuario = []

  public token:any = ""

  public quantiyOfSales = 0

  constructor(private appservice: AppService,
              private authService: AuthService,
              private storeHeaderService:StoreHeaderService,
              private router_navigator: Router) { }

  async ngOnInit() {
    await this.obterDadosToken()
    this.getComercio()
    this.getNewMessage()
  }

  soundOfNotification(){
    var audio = new Audio('/assets/sound/notification.mp3');
      audio.play();
  }

  public obterDadosToken(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((user:any)=>{
      this.token = user
    })
  }

  public getComercio(){
    this.storeHeaderService.getStoreByFOREIGN_KEY("store", this.token.uid).pipe(takeUntil(this.unsubscribe$)).subscribe((store:[store])=>{
      this.store = store[0]
    })
    this.storeHeaderService.getOrderByFOREIGN_KEY("order", this.token.uid).pipe(takeUntil(this.unsubscribe$)).subscribe( (dados)=>{
      this.pedidos = dados
    })
  }

  public getNewMessage(){
    this.storeHeaderService.getNewMessageByFOREIGN_KEY(this.token.uid).pipe(takeUntil(this.unsubscribe$)).subscribe((newMessage:any)=>{
      this.newMessage = newMessage
    })
  }

  public countNewMensage(msn:any):number{
    let numberOfNewMessage:number = 0
    for (const key of msn) {
      if(key.FOREIGN_KEY != this.token.uid && key.view == false){
        numberOfNewMessage++
      }
    }
    return numberOfNewMessage
  }

  public showLestNewMensage(msn:any):string{
    let LestMensage:string
    for (const key of msn) {
      if(key.FOREIGN_KEY != this.token.uid && key.view == false){
        LestMensage = key.text
      }
    }
    return LestMensage
  }

  public SignOut(){
    this.appservice.router_app_componet = 'usuario'
    this.authService.logout()
    this.router_navigator.navigateByUrl('/login')
  }

  public formatHours(d){
    let data = new Date(d);
    let my = data.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true});
    return my
  }

  storeOpenOrClosed(){
    console.log( this.store )
    this.storeHeaderService.storeOpenOrClosed(this.store.PRIMARY_KEY, !this.store.storeOpenOrClosed)
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
