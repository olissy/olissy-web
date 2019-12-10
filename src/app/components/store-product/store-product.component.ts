import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { StoreProductService } from './store-product.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-store-product',
  templateUrl: './store-product.component.html',
  styleUrls: ['./store-product.component.css']
})
export class StoreProductComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public loading:boolean = true;

  public result = { store : null, product : null, productDataBase : [], limit : 10, offset : 0, size : 0  }

  constructor(private appService: AppService,
              private storeProductService: StoreProductService,
              private route: ActivatedRoute) {}

  public ngOnInit() {
    this.product()
  }
  
  public product() {
    this.loading = false
    this.storeProductService.store(this.route.parent.snapshot.params.id).pipe(takeUntil(this.unsubscribe$)).subscribe((store:any)=>{
      if(Object.keys(store).length != 0){
        this.storeProductService.product(this.route.parent.snapshot.params.id, this.result.limit).pipe(takeUntil(this.unsubscribe$)).subscribe((product:any)=>{
          this.loading = true
          this.result.product = product
          this.result.size = product.length
          this.productDataBase()
        })
      }
    })
  }

  public productDataBase(){
    for(let index in this.result.product){
      this.storeProductService.productDataBase(this.result.product[index].PRIMARY_KEY_PRODUCT_DB).pipe(takeUntil(this.unsubscribe$)).subscribe((productDataBase:any)=>{
        let storeNotDuplicate = this.filterRemoveDuplicateProductDataBase(productDataBase[0].PRIMARY_KEY)
        if(storeNotDuplicate == false){
          this.result.productDataBase.push( productDataBase[0] )
        }  
      })
    }
  }
  
  public filterRemoveDuplicateProductDataBase(PRIMARY_KEY):boolean{
    for (const key in this.result.productDataBase) {
      if(this.result.productDataBase[key].PRIMARY_KEY == PRIMARY_KEY){
        return true
      }
    }
    return false
  }

  public  loadingPlusProduct(){
    this.loading = false
    setTimeout(() => {
      this.result.limit = this.result.limit * 10
      this.product()
    }, 1000);
  }

  public filterRemoveDuplicate(product):boolean{
    for (const key in this.result.product) {
      if(this.result.product[key].PRIMARY_KEY == product){
       return true
      }
    }
    return false
  }

  public ngAfterContentChecked() {
    if (Object.keys(this.appService.ListaProdutosPesquisado).length != 0) {
      this.result.product = this.appService.ListaProdutosPesquisado;
    }
  }

  public incrementarItemCarrinho(product, productDB) {
    let item = product
        item.productName = productDB.productName
    const foundItem: any = this.appService.produtos.find(items => items.PRIMARY_KEY === item.PRIMARY_KEY);
    if(foundItem){
      if( item.quantities < item.productQuantities ){
        foundItem.quantities++;
        foundItem.productPrice = foundItem.productPriceOrigin * foundItem.quantities;
      }
    }else{
      item.quantities = 1;
      item.productPriceOrigin = new Number(item.productPrice).valueOf();
      this.appService.produtos.push(item);
    }
  }

  public TotalValorDoPedido(){
    return this.appService.produtos.reduce( (sum, item:any)=>{
      return new Number(sum).valueOf() + new Number(item.productPrice).valueOf()
    },0)
  }

  public TotalProdutoCarrinho(){
    return this.appService.produtos.length
  }

  public decrementarItemCarrinho(item){
    for (const key in this.result.product) {
      if(this.result.product[key].PRIMARY_KEY == item.PRIMARY_KEY){
      this.result.product[key].quantities--
      }
      this.removerItemCarrinho(this.result.product[key].PRIMARY_KEY, item.PRIMARY_KEY, this.result.product[key].quantities)
    }
  }

  public removerItemCarrinho(menu_PRIMARY_KEY, itemDecrement_PRIMARY_KEY, quantities ){
    if(menu_PRIMARY_KEY == itemDecrement_PRIMARY_KEY && quantities == 0){
      for (const index in this.appService.produtos) {
        if(this.appService.produtos[index].PRIMARY_KEY == itemDecrement_PRIMARY_KEY){
          this.appService.produtos.splice(Number(index), 1)
        }
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
 