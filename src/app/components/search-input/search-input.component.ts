import { Component, OnInit, OnDestroy, Output,Input, EventEmitter } from '@angular/core'
import { FormGroup, FormControl  }  from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { AppService } from '../../app.service'
import { SearchInputService } from './search-input.service'
declare var $ :any

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

  public wordSearchByTyping = []

  suggestionssw

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
      this.produto = false
      this.digite = false
      this.desculpe = false
      this.aguarde = true
      this.debounceTime()
    }else{
      this.digite = true
    }
    
  }

  public debounceTime(){
    var timer;
    var self = this;
    $('#input-buscar-produto').keyup(function(){
        clearTimeout(timer)
        if ($('#input-buscar-produto').val) {
            timer = setTimeout(function(){
                 var suggestion = $("#input-buscar-produto").val()    
                 if(this.suggestionssw != suggestion){
                  this.suggestionssw = suggestion
                  console.log(suggestion)
                  var arrayWordSuggestion = suggestion.split(" ")
                  console.log(arrayWordSuggestion)
                  self.sendSearch(arrayWordSuggestion)
                 }
            }, 1000);
        }
    });
  }

  public sendSearch(arrayWordSuggestion){
    this.suggestedProductList = []
    for (const word of arrayWordSuggestion) {
       this.pesquisaService.searchProductsByRegex(word).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
          if(Object.keys(resposta).length != 0){
            this.suggestedProductList.push(resposta[0])
            this.aguarde = false
            this.produto = true
          }else{
            this.desculpe = true
          }
       })
    }
  }

  public selectSuggestion(select){
    this.pesquisaService.getSuggestion(select.PRIMARY_KEY).subscribe((product)=>{
      console.log(product)
    })
  }

  public searchByTyping(typedSearch){
    console.log(typedSearch)
    this.desculpe = false
    this.aguarde = true
    let arrayWord = typedSearch.split(" ")
    this.resultSearchByTyping(arrayWord)
  }
  
  public resultSearchByTyping(arrayWord){
    this.wordSearchByTyping = []
    for (const word of arrayWord) {
       console.log(word)
       this.pesquisaService.searchProductsByRegex(word).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
          this.wordSearchByTyping.push(resposta[0])
          console.log(this.wordSearchByTyping)
       })
    }
  }

  ngOnDestroy(){
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}
