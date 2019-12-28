import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { AppService } from '../../app.service'
import { ProductService } from './product.service'
import { DataService } from "../../data.service";
declare var $ :any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  private unsubscribe$ = new Subject();

  public loading:boolean = true

  public displayStoreInfo:any

  public FOREIGN_KEY_STORE_ORDER_CART

  public result = { store : [], product : null, productDataBase : [], limit : 10, offset : 0, size : 0  }



  constructor(private productService:ProductService, 
              private appService:AppService,
              private data: DataService,
              private metaTagService: Meta,
              private titleService: Title,) { }

  ngOnInit(){ 
    console.log(window.location.href)
    this.searchEngineOptimization()
    this.haveOrderOpen()
    this.product()
    this.data.getProductDB.pipe(takeUntil(this.unsubscribe$)).subscribe(productDB =>this.searchProductDB(productDB))
  }

  public searchEngineOptimization(){
    this.metaTagService.addTags([
      { name: 'keywords', content: 'olissy, olissy farmacia, delivery de farmacia em guarapari, farmacia em guarapari, farmacia guarapari' },
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' }
    ]);
    this.titleService.setTitle('olissy');
    this.metaTagService.updateTag(
      { name: 'description', content: 'A olissy delivery trata-se de uma Marketplace local de compras e vendas de produtos. No ambiente online isso se traduz em um espaço virtual onde a farmacia empresa permite que outros lojistas anunciem seus produtos e serviços através da plataforma da olissy.' }
    );
  }

  searchProductDB(ProductDB){
    if(ProductDB.search == "suggestion"){
      this.searchProductDBSuggested(ProductDB.product)
    }
    if(ProductDB.search == "typing"){
      this.searchProductDBTyping(ProductDB.product)
    }
  }

  searchProductDBSuggested(ProductDB){
    this.result.productDataBase = []
    this.result.product = []
    this.result.store = []
    this.result.productDataBase.push( ProductDB )
    this.productService.productSuggested(ProductDB.PRIMARY_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((product:any)=>{
      this.result.product = product
       console.log(this.result)
       this.store()
    })
  }

  searchProductDBTyping(ProductDB){
    this.result.productDataBase = []
    this.result.product = []
    this.result.store = []
    for (const index in ProductDB){
      this.productService.productSuggested(ProductDB[index].PRIMARY_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((product:any)=>{
        this.result.productDataBase.push( ProductDB[index] )
        this.result.product.push( product[0] )
         console.log(this.result)
         this.store()
      })
    }
  }



  public product(){
    this.loading = false
    this.productService.product(this.result.limit).pipe(takeUntil(this.unsubscribe$)).subscribe((product:any)=>{
      this.loading = true
      this.result.product = product
      this.result.size = product.length
      this.store()
      this.productDataBase()
      this.enableScroll()
    })
  } 

  public store(){
    for(let index in this.result.product){
      this.productService.store(this.result.product[index].FOREIGN_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((store:any)=>{
        let storeNotDuplicate 
        if(Object.keys(store).length != 0){
          storeNotDuplicate = this.filterRemoveDuplicateStore(store[0].PRIMARY_KEY)
        }
        if(storeNotDuplicate == false){
          this.result.store.push( store[0] )
        }
      })
    }
  }

  public productDataBase(){
    for(let index in this.result.product){
      this.productService.productDataBase(this.result.product[index].PRIMARY_KEY_PRODUCT_DB).pipe(takeUntil(this.unsubscribe$)).subscribe((productDataBase:any)=>{
            
        let storeNotDuplicate = this.filterRemoveDuplicateProductDataBase(productDataBase[0].PRIMARY_KEY)
        
        if(storeNotDuplicate == false){
          this.result.productDataBase.push( productDataBase[0] )
        }

      })
    }
  }

  public filterRemoveDuplicateStore(PRIMARY_KEY):boolean{
    for (const key in this.result.store) {
      if(this.result.store[key].PRIMARY_KEY == PRIMARY_KEY){
       return true
      }
    }
    return false
  }

  public filterRemoveDuplicateProductDataBase(PRIMARY_KEY):boolean{
    for (const key in this.result.productDataBase) {
      if(this.result.productDataBase[key].PRIMARY_KEY == PRIMARY_KEY){
      return true
      }
    }
    return false
  }

  public selectDisplayStoreInfo(store){
    this.displayStoreInfo = store
  }

  public haveOrderOpen(){
    if(Object.keys(this.appService.pedido).length != 0){
      this.FOREIGN_KEY_STORE_ORDER_CART = this.appService.pedido.FOREIGN_KEY_STORE
     $('#displayShoppingCart').modal('show'); 
    }
  }

  public  loadingPlusProduct(){
    this.loading = false
    this.disableScroll()
    setTimeout(() => {
      this.result.limit = this.result.limit * 10
      this.product()
    }, 1000);
  }

  public disableScroll(){ 
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop; 
    let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
    window.onscroll = function() { 
      window.scrollTo(scrollLeft, scrollTop); 
    }; 
  }

  public enableScroll(){ 
    setTimeout(() => {
      window.onscroll = function() {}; 
    }, 3000);
  }
 
  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
