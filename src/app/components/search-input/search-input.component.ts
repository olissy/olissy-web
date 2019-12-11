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

  public Digite_tres_ou_mais_caracteres_total = 3

  public digite = true

  public aguarde = false

  public desculpe = false

  public produto = false

  public suggestedProductList = []

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

  }

  private pesquisarProduto(suggestion){
    console.log(suggestion)
    this.desculpe = false
    this.aguarde = true
    setTimeout(() => {
      this.sendSearch(suggestion)
    }, 1000);
  }

  public sendSearch(Search){
    this.suggestedProductList = []
    this.pesquisaService.searchProductsByRegex(Search).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
       console.log(resposta)      
       this.suggestedProductList.push(resposta[0])
       this.aguarde = false
      this.produto = true
    })
  }

  public SearchBySuggestions(suggestion, event){
    if(event.key != 'Backspace' && this.Digite_tres_ou_mais_caracteres_total <= 3 && this.Digite_tres_ou_mais_caracteres_total > 0){
      if(suggestion != false){
        this.Digite_tres_ou_mais_caracteres_total --
      }
    }

    if(event.key == 'Backspace' && suggestion.length <= 2 && this.Digite_tres_ou_mais_caracteres_total <= 2 ){
      this.digite = true
      this.aguarde = false
      this.desculpe = false
      this.produto = false
      this.Digite_tres_ou_mais_caracteres_total ++
    }

    if(suggestion.length == 0){
      this.Digite_tres_ou_mais_caracteres_total = 3
    }

    if(this.Digite_tres_ou_mais_caracteres_total <= 0){
      this.digite = false
      this.pesquisarProduto(suggestion)
    }else{
      this.digite = true
    }

  }

  public searchByTyping(typedSearch){
    console.log(typedSearch)
    this.desculpe = false
    this.aguarde = true
    setTimeout(() => {
      this.sendSearch(typedSearch)
    }, 1000);
  }

  public selectSuggestion(select){
    console.log(select)
  }

  ngOnDestroy(){
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}
