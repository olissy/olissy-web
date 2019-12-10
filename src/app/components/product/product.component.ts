import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { AppService } from '../../app.service'
import { ProductService } from './product.service'
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

  constructor(private productService:ProductService, private appService:AppService) { }

  ngOnInit(){
    this.haveOrderOpen()
    this.product()
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
