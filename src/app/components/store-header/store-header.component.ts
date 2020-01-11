import { Component, OnInit } from '@angular/core'
import { Router, NavigationStart } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StoreHeaderService } from './store-header.service'
import { AppService } from '../../app.service'
import { AuthService  } from '../../AuthService';
import { store } from '../../interfaces';
import { DataService } from "../../data.service";
declare var $ :any;

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

  public url:string = '/'

  constructor(private appservice: AppService,
              private authService: AuthService,
              private storeHeaderService:StoreHeaderService,
              private router:Router,
              private data: DataService) {
                this.getRouter()
              }

  async ngOnInit() {
    await this.obterDadosToken()
    this.getComercio()
    this.getNewMessage()
    this.getRouterReloadPage()
  }

  public getRouterReloadPage(){
    let router = window.location.href.split('/' ) 
    if(router[3]  == 'store-product-registration' || router[3]  == 'store-product-record'){
      this.url = `/${router[3]}` 
    }else{
      this.url = '/'
    }
  }

  public getRouter(){
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe( (event:any) => {
      if(event instanceof NavigationStart) {
        if(event.url == '/store-product-registration' || event.url == '/store-product-record'){
          this.url = event.url 
        }else{
          this.url = '/'
        }
      }
    });
  }

  public searchProductDB_Output(productDB){
    $('#displaySearch-store-product-registration').modal('hide'); 
    $('#displaySearch-store-product-record').modal('hide'); 
    this.data.setProductDB(productDB)
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
    this.router.navigateByUrl('/login')
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
