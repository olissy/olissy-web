import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { AppService } from '../../app.service'
import { StorePageService } from './store-page.service'
import { AuthService } from '../../AuthService';
import { Router } from '@angular/router'
declare var $ :any;
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.css']
})

export class StorePageComponent implements OnInit {

  public store

  public reactStatus:boolean = true

  private unsubscribe$ = new Subject();

  public categoria:string = 'store'
  
  public quantiyOfSales:number = 0 

  public TaxaDelivery = [{ description:'', rule:false },{ description:'', rule:false },{ description:'', rule:false },{ description:'', rule:false }];

  public displayStoreInfo:any

  public react:any = { status:false, store:[] }

  private newContact = {
    PRIMARY_KEY : "",

    FOREIGN_KEY_CLIENT : "",
    photoClient : "",
    nameClient : "",
    viewClient : false,

    FOREIGN_KEY_STORE : "",
    nameStore : "",
    photoStore : "",
    viewStore : false,

    message:[{
      FOREIGN_KEY:"",
      data:"",
      text:"",
      name:"",
      photo:"",
      view:false
      }
    ]
  }

  constructor(private metaTagService: Meta, 
              private titleService: Title,
              private appService:AppService,
              private comercioPaginaService:StorePageService,
              private route:ActivatedRoute,
              private authService:AuthService,
              private router_navigator: Router) { }

  ngOnInit() {
    this.scrollToTop()
    this.appService.produtos = []//remover produtos do carrinho
    this.comercioPaginaService.store('store', this.route.snapshot.params['id']).pipe(takeUntil(this.unsubscribe$)).subscribe((store:any)=>{
      this.store = store
      this.getReact()
      this.searchEngineOptimization(store[0].storeCategory, store[0].storeCity, store[0].storeNeighborhood, store[0].storeName, store[0].storeAbout)
    })
    
  }

  public searchEngineOptimization(keywords1, keywords2, keywords3, title, description){
    this.metaTagService.addTags([
      { name: 'keywords', content: `olissy, olissy farmacia, olissy delivery, ${keywords1}, olissy ${keywords2}, olissy ${keywords3}` },
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' }
    ]);
    this.titleService.setTitle(`${title}`);
    this.metaTagService.updateTag(
      { name: 'description', content: `${description}` }
    );
  }

  public scrollToTop(){
    $('html, body').animate({scrollTop:0}, 'slow');
  }

  public historyNavigateBack(){
    window.history.back();
  }

  public isLogged() {
    return  this.authService.isLogged()
  }

  public adicionarItemCarrinho(item){
    let foundItem:any = this.appService.produtos.find( (items)=> items.PRIMARY_KEY ===  item.PRIMARY_KEY)
    if(foundItem){
      if(foundItem.quantidade == null){
        foundItem.quantidade = 1
      }
      foundItem.quantidade = foundItem.quantidade + 1
      foundItem.price = foundItem.priceOrigin * foundItem.quantidade
    }else{
      item.quantidade = 1
      item.priceOrigin = item.price
      this.appService.produtos.push(item)
    }
  }

  public message(){
    this.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe( (isLogged:any)=>{
      if(isLogged === null){

      }else{
        let FOREIGN_KEY_CLIENT = isLogged.uid
        let FOREIGN_KEY_STORE = this.route.snapshot.params['id']
        this.comercioPaginaService.existContactStoreEndClient(FOREIGN_KEY_CLIENT, FOREIGN_KEY_STORE).pipe(takeUntil(this.unsubscribe$)).subscribe( (existContact:any)=>{
          
          if(Object.keys(existContact).length == 0){//existe contato entre loja e cliente
            this.getStoreClient(FOREIGN_KEY_CLIENT, FOREIGN_KEY_STORE)
          }else{
            this.router_navigator.navigate([`/client-message-text/${existContact[0].PRIMARY_KEY}`])
          }
        }) 
      }
    })
  }

  public getStoreClient(FOREIGN_KEY_CLIENT, FOREIGN_KEY_STORE){
    this.comercioPaginaService.getByFOREIGN_KEY('client', FOREIGN_KEY_CLIENT).pipe(takeUntil(this.unsubscribe$)).subscribe( (client:any)=>{
      this.newContact.FOREIGN_KEY_CLIENT = client[0].FOREIGN_KEY
      this.newContact.nameClient = client[0].clientName +" "+ client[0].clientLastName
      this.newContact.photoClient = client[0].clientImageUrl
      this.comercioPaginaService.getByFOREIGN_KEY('store', FOREIGN_KEY_STORE).pipe(takeUntil(this.unsubscribe$)).subscribe( (store:any)=>{
        this.newContact.FOREIGN_KEY_STORE = store[0].FOREIGN_KEY
        this.newContact.nameStore = store[0].storeName
        this.newContact.photoStore = store[0].storeImageUrl
        this.comercioPaginaService.criarContact(this.newContact).then( async (res:any) => {
        await res
        this.comercioPaginaService.updateContactEndRedirectToMessage("contact", res.id, {PRIMARY_KEY:res.id}).then(()=>{
          this.router_navigator.navigate([`/client-message-text/${res.id}`])
        })
      })
      })
    })
  }

  public selectDisplayStoreInfo(store){
    if(store.negotiateRateLivery.status){
      this.TaxaDelivery[0] = { description:'Negociar taxa de entrega por Telefone', rule:true }
    }

    if(store.onlyInNeighborhood.status){
      this.TaxaDelivery[1] = { description: `Entrega GRÁTIS no bairro ${store.storeNeighborhood}`,  rule:true }
    }

    if(store.deliveryFreeAbove.status){
      this.TaxaDelivery[2] = { description:`Entrega grátis acima de R$${store.deliveryFreeAbove.taxa} por ${store.deliveryFreeAbove.km}/km`, rule:true }
    }

    if(store.deliveryBy.status){
      this.TaxaDelivery[3] = { description: `Entrega por R$${store.deliveryBy.taxa}/KM`, rule:true }
    }

    this.displayStoreInfo = store
  }

  public async getReact(){
    this.authService.isLogged().subscribe((res:any)=>{
      if(res != null){
        this.comercioPaginaService.getReact(res.uid).subscribe((react:any)=>{
          if(Object.keys(react).length != 0){
            this.react = react[0]
            this.reactFilter()
          }else{
            this.comercioPaginaService.react(res.uid)
          }
        })
      }
    })
  }

  public reactFilter(){
    for(let react in this.react.store){
      this.react.status = false
      if(this.react.store[react].FOREIGN_KEY == this.store[0].PRIMARY_KEY &&  this.react.store[react].react == true){ 
        this.react.status = true
      } 
    }  
  }

  public setFollow(product){
    let PRIMARY_KEY = this.react.PRIMARY_KEY
    this.reactStatus = false


    //se nao existir react, adcionar
    if( Object.keys(this.react.store).length == 0 ){
      console.log("a")
      this.comercioPaginaService.setReact(PRIMARY_KEY, { FOREIGN_KEY:product.PRIMARY_KEY, react:true }).then(()=>{
        this.comercioPaginaService.incrementFollowQuantities(product.PRIMARY_KEY).then(()=>{
          this.reactStatus = true
        })
      })
    }else{
      if(this.react.status){
        console.log("b")
        this.comercioPaginaService.delReact(PRIMARY_KEY, { FOREIGN_KEY:product.PRIMARY_KEY, react:true }).then(()=>{
          this.comercioPaginaService.setReact(PRIMARY_KEY, { FOREIGN_KEY:product.PRIMARY_KEY, react:false }).then(()=>{
            this.comercioPaginaService.decrementFollowQuantities(product.PRIMARY_KEY).then(()=>{
              this.reactStatus = true
            })
          })
        })
      }else{
        console.log("c")
        this.comercioPaginaService.delReact(PRIMARY_KEY, { FOREIGN_KEY:product.PRIMARY_KEY, react:false }).then(()=>{
          this.comercioPaginaService.setReact(PRIMARY_KEY, { FOREIGN_KEY:product.PRIMARY_KEY, react:true }).then(()=>{
            this.comercioPaginaService.incrementFollowQuantities(product.PRIMARY_KEY).then(()=>{
              this.reactStatus = true
            })
          })
        })
      }
    }
  }



 
  ngOnDestroy(){
    console.log("store-page destroy")
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
