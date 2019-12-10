import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators  }  from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StoreProductRegistrationService } from './store-product-registration.service';
import { AuthService  } from '../../AuthService';
import productDataBaseObject from '../product-crud-database/productDataBase'
import { Observable } from 'rxjs';
declare var $ :any;

@Component({
  selector: 'app-store-product-registration',
  templateUrl: './store-product-registration.component.html',
  styleUrls: ['./store-product-registration.component.css']
})

export class StoreProductRegistrationComponent implements OnInit, OnDestroy {

  public loading:boolean = true

  public LIMIT:number = 5

  private unsubscribe$ = new Subject();

  public token:any = ""

  public emVendas = ['sim','nao'];

  public productSession = []

  public productCategory = []

  public productType = []

  public providerListRegistered: Observable<any[]>

  public productDatabase = []

  public andGeneric = ['Sim','Não'];

  public produtoSelecionadoParaCadastar

  public currencyMask : any = {
    mask: '$num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: ' '
      }
    }
  };

  public formularioCadastro: FormGroup = new FormGroup({
    'PRIMARY_KEY_PRODUCT_DB':new FormControl(null),
    'PRIMARY_KEY_STORE':new FormControl(null),
    'FOREIGN_KEY':new FormControl(null, Validators.required),
    'PRIMARY_KEY':new FormControl(null),
    'productPrice':new FormControl(null, Validators.required),
    'productForSale':new FormControl(null, Validators.required),
    'productDateRegister':new FormControl(`${new Date()}`),
    'productQuantities':new FormControl(0),
    'love':new FormControl(0),
    'sale':new FormControl(0),
    'view':new FormControl(0),
  })

  public formularioBuscarProdutoCadastrar: FormGroup = new FormGroup({
    'productSession':new FormControl(null),
    'productCategory':new FormControl(null),
    'productType':new FormControl(null),
    'andGeneric':new FormControl(null, Validators.required),
    'provider':new FormControl(null, Validators.required),
  })

  public result = { store : null, product : null, productDataBase : [], limit : 10, offset : 0, size : 0  }


  constructor(private comercioService:StoreProductRegistrationService,
              private storeProductRegistrationService:StoreProductRegistrationService,
              private authService: AuthService) {}

  ngOnInit() {
    this.getToken()
    this.getProductSession()
    this.getAllProvider()
    this.productDataBase()
  }

  public getToken(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).pipe(takeUntil(this.unsubscribe$)).subscribe((res:any)=>{
      this.token = res
      this.getStore(this.token.uid)
    })
  }

  public productDataBase(){
    this.storeProductRegistrationService.productDataBase(this.result.limit).pipe(takeUntil(this.unsubscribe$)).subscribe((productDataBase:any)=>{
      this.result.size = productDataBase.length
      this.result.productDataBase = productDataBase
      this.product()
      this.enableScroll()
    })
  }

  public product(){
    for(let index in this.result.productDataBase){
      this.result.productDataBase[index].registration = false
      this.storeProductRegistrationService.product(this.token.uid, this.result.productDataBase[index].PRIMARY_KEY).subscribe((product:any)=>{
        if(Object.keys(product).length != 0 ){
          this.result.productDataBase[index].registration = true
        }
      })
    }
  }

  public getStore(FOREIGN_KEY){
    this.comercioService.getStoreByFOREIGN_KEY(FOREIGN_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((store:any)=>{
      this.formularioCadastro.patchValue({
        PRIMARY_KEY_STORE:store[0].PRIMARY_KEY
      })
    })
  }

  public getProductSession(){
    for (const session in productDataBaseObject.product){
      this.productSession.push({
        productSessionIndece:session,
        productSession:Object.keys(productDataBaseObject.product[session])[0]
      })
    }
  }

  public getAllProvider(){
    this.providerListRegistered = this.comercioService.getAllProvider()
  }

  public loadingPlusProduct(){
    this.loading = false
    this.disableScroll()
    setTimeout(() => {
      this.result.limit = this.result.limit * 10
      this.productDataBase()
      this.loading = true
    }, 1000);
  }

  public selecionadoProdutoCadastrar(PRODUCT){
    this.produtoSelecionadoParaCadastar = PRODUCT
    this.formularioCadastro.patchValue({
      PRIMARY_KEY_PRODUCT_DB:PRODUCT.PRIMARY_KEY,
      FOREIGN_KEY: this.token.uid,
      productPrice:PRODUCT.productPrice,
      love: 0,
      sale: 0,
      view: 0,
      productDateRegister: `${new Date()}`,
    })
  }

  public cadastraProduto(){
    this.formularioCadastro.get('productPrice').markAsTouched()
    this.formularioCadastro.get('productForSale').markAsTouched()
    this.formularioCadastro.get('productQuantities').markAsTouched()

    if(this.formularioCadastro.status === "VALID"){
      this.comercioService.createProduct(this.formularioCadastro.value)
      this.formularioCadastro.reset()
      $('#selecionadoProdutoCadastrar').modal('hide')
    } 
  }

  public cancelarCadastraProduto(){
    this.formularioCadastro.reset()
  }

  public setProductSession(value){
    let productSession = value.substring(0,value.indexOf(","))
    let productSessionIndece = value.replace(`${productSession},`,"")
    this.getProductCategory(productSession, parseInt(productSessionIndece))
  }

  public getProductCategory(productSession, productSessionIndece){
    this.productCategory = []
    for (const category in productDataBaseObject.product[productSessionIndece][productSession]){
      this.productCategory.push({
        productCategoryIndece:category,
        productCategory:Object.keys(productDataBaseObject.product[productSessionIndece][productSession][category])[0]
      })
    }
  }

  public setProductCategory(value){
    console.log(value)
    let productCategory = value.substring(0,value.indexOf(","))
    let productCategoryIndece = value.replace(`${productCategory},`,"")
 
    let productSessionValue =  this.formularioBuscarProdutoCadastrar.get('productSession').value
    let productSession = productSessionValue.substring(0,productSessionValue.indexOf(","))
    let productSessionIndece = productSessionValue.replace(`${productSession},`,"")
 
    this.getProductType(productSessionIndece, productSession, productCategoryIndece, productCategory)
  }
 
  public getProductType(productSessionIndece:number, productSession:string, productCategoryIndece:number, productCategory:string){
    this.productType = []
     for (const type of productDataBaseObject.product[productSessionIndece][productSession][productCategoryIndece][productCategory]){
      this.productType.push(type)
    }
  }

  public buscarProdutoCadastrar(){
    this.formularioBuscarProdutoCadastrar.get('andGeneric').markAsTouched()
    this.formularioBuscarProdutoCadastrar.get('productCategory').markAsTouched()
    this.formularioBuscarProdutoCadastrar.get('productType').markAsTouched()
    this.formularioBuscarProdutoCadastrar.get('productSession').markAsTouched()
    this.formularioBuscarProdutoCadastrar.get('provider').markAsTouched()
    if(this.formularioBuscarProdutoCadastrar.valid){
      let andGeneric =  this.formularioBuscarProdutoCadastrar.get('andGeneric').value

      let productCategory =  this.formularioBuscarProdutoCadastrar.get('productCategory').value
          productCategory = productCategory.substring(0,productCategory.indexOf(","))

      let productType =  this.formularioBuscarProdutoCadastrar.get('productType').value

      let productSession =  this.formularioBuscarProdutoCadastrar.get('productSession').value
          productSession = productSession.substring(0,productSession.indexOf(","))

      let provider =  this.formularioBuscarProdutoCadastrar.get('provider').value

      this.comercioService.getProductDatabase(productSession, productCategory, productType, andGeneric, provider).pipe(takeUntil(this.unsubscribe$)).subscribe((product:any)=>{
        this.result.productDataBase = product
        this.product()
      })
      $('#buscarProdutoCadastrar').modal('hide')
    }
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

  public cancelarBuscarProdutoCadastrar(){
    this.formularioBuscarProdutoCadastrar.reset()
  }

  public cancelarCadastroProduto(){
    this.formularioCadastro.reset()
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}