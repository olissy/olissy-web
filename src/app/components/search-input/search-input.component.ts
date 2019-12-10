import { Component, OnInit, OnDestroy, Output,Input, EventEmitter } from '@angular/core'
import { FormGroup, FormControl  }  from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { AppService } from '../../app.service'
import { SearchInputService } from './search-input.service'

@Component({
  selector: 'mt-pesquisa',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject()

  @Output() produtos_Output:any = new EventEmitter()

  @Input() boscar_por:string

  public id_comercio = ""

  public Digite_tres_ou_mais_caracteres_total = 3

  public digite = true

  public aguarde = false

  public desculpe = false

  public produto = false

  public listProduct = []

  public formularioPesquisa: FormGroup = new FormGroup({
    'pesquisa': new FormControl(null),
    'buscarPor':new FormControl("productName"),
    'precoMin':new FormControl(0.00),
    'precoMax':new FormControl(0.00),
    'categoria':new FormControl(null),
    'emVenda':new FormControl("todos"),
    'sugestoes':new FormControl(true)
  })

  constructor(private appService:AppService,
              private pesquisaService:SearchInputService,
              private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.id_comercio = params.id
   })
  }

  private pesquisarProduto(){
    let buscarPor = this.formularioPesquisa.value.buscarPor
    let pesquisa  = this.formularioPesquisa.value.pesquisa
    let emVenda   = this.formularioPesquisa.value.emVenda
    let precoMin  = this.formularioPesquisa.value.precoMin
    let precoMax  = this.formularioPesquisa.value.precoMax

    this.desculpe = false
    this.aguarde = true

    if(this.boscar_por === 'store'){
      this.pageStore(buscarPor, pesquisa, emVenda, precoMin, precoMax)
    }

    if(this.boscar_por == 'category'){
      this.allCategory(buscarPor, pesquisa, emVenda, precoMin, precoMax)
      console.log('categoria')
    }

    if(this.boscar_por != 'store' && this.boscar_por != 'category'){
      this.pageRegisterProductStore(buscarPor, pesquisa, emVenda, precoMin, precoMax, this.boscar_por)
      console.log('cadastro produto')
    }

  }

  public sendProductSearch(produto){
    this.pesquisaService.getByStoreFOREIGN_KEY(produto.FOREIGN_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
      let product = produto
          product.store =  resposta[0]

      this.appService.ListaProdutosPesquisado = [product]
      this.produtos_Output.emit(true)
    })
  }

  public allCategory(buscarPor, pesquisa, emVenda, precoMin, precoMax){
    this.listProduct = []
    this.pesquisaService.pesquisaProdutosAll("product", buscarPor, pesquisa, emVenda, precoMin, precoMax, this.boscar_por).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
      if(Object.keys(resposta).length != 0){
        resposta.forEach((product , index) => {
          this.pesquisaService.getByStoreFOREIGN_KEY(product.FOREIGN_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((store:any)=>{
            product.store = store[0]
           this.listProduct.push(product)
          })
          if(Object.keys(resposta).length == index+1){
            this.aguarde = false
            this.produto = true
          }
        });
      }else{
        this.desculpe = true
        this.produto = false
      }
    })
  }

  public pageStore(buscarPor, pesquisa, emVenda, precoMin, precoMax){
    this.listProduct = []
    this.pesquisaService.pesquisaProdutosStore("product", buscarPor, pesquisa, emVenda, precoMin, precoMax, this.boscar_por, this.id_comercio).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
      if(Object.keys(resposta).length != 0){
        resposta.forEach((product , index) => {
          this.pesquisaService.getByStoreFOREIGN_KEY(product.FOREIGN_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((store:any)=>{
            product.store = store[0]
           this.listProduct.push(product)
          })
          if(Object.keys(resposta).length == index+1){
            this.aguarde = false
            this.produto = true
          }
        });
      }else{
        this.desculpe = true
        this.produto = false
      }
    })
  }

  public pageRegisterProductStore(buscarPor, pesquisa, emVenda, precoMin, precoMax, FOREIGN_KEY){
    this.listProduct = []
    this.pesquisaService.pesquisaProdutosStore("product", buscarPor, pesquisa, emVenda, precoMin, precoMax, this.boscar_por, FOREIGN_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
      if(Object.keys(resposta).length != 0){
        resposta.forEach((product , index) => {
          this.pesquisaService.getByStoreFOREIGN_KEY(product.FOREIGN_KEY).pipe(takeUntil(this.unsubscribe$)).subscribe((store:any)=>{
            product.store = store[0]
           this.listProduct.push(product)
          })
          if(Object.keys(resposta).length == index+1){
            this.aguarde = false
            this.produto = true
          }
        });
      }else{
        this.desculpe = true
        this.produto = false
      }
    })
  }

  public pesquisarProdutoSugerido(value, event){
    if(event.key != 'Backspace' && this.Digite_tres_ou_mais_caracteres_total <= 3 && this.Digite_tres_ou_mais_caracteres_total > 0){
      if(value != false){
        this.Digite_tres_ou_mais_caracteres_total --
      }
    }

    if(event.key == 'Backspace' && value.length <= 2 && this.Digite_tres_ou_mais_caracteres_total <= 2 ){
      this.digite = true
      this.aguarde = false
      this.desculpe = false
      this.produto = false
      this.Digite_tres_ou_mais_caracteres_total ++
    }

    if(value.length == 0){
      this.Digite_tres_ou_mais_caracteres_total = 3
    }

    if(this.Digite_tres_ou_mais_caracteres_total <= 0){
      this.digite = false
      this.pesquisarProduto()
    }else{
      this.digite = true
    }

  }

  ngOnDestroy(){
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}
