import { Component, OnInit, OnDestroy, Output,Input, EventEmitter } from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { SearchInputService } from './search-input.service'
declare var $ :any

@Component({
  selector: 'mt-pesquisa',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})

export class SearchInputComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject()

  @Output() searchProductDB_Output:any = new EventEmitter()

  @Input() boscar_por:string

  public Digite_tres_ou_mais_caracteres_total = 3

  public digite = true

  public aguarde = false

  public desculpe = false

  public produto = false

  public suggestedProductList = []

  public TypingProductList = []

  public loadingSuggested:boolean = false

  constructor(private pesquisaService:SearchInputService) {}

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
      this.debounceTimeSuggestion()
    }else{
      this.digite = true
    }
    
  }

  public debounceTimeSuggestion(){
    var timer;
    var self = this;
    $('#input-buscar-produto').keyup(function(){
      clearTimeout(timer)
      if ($('#input-buscar-produto').val) {
        timer = setTimeout(function(){
          var suggestion = $("#input-buscar-produto").val()    
          if(this.suggestionssw != suggestion){
            this.suggestionssw = suggestion
            var wordSuggestion = suggestion.split(" ")
            self.sendSearchSuggestion(wordSuggestion)
          }
        }, 1000);
      }
    });
  }

  public sendSearchSuggestion(wordSuggestion){
    this.suggestedProductList = []
    let cont = 1
    for (const word of wordSuggestion) {
      this.loadingSuggested = true
       this.pesquisaService.searchProductsByRegex(word).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
         console.log("ppppsppppppppppppp")
          if(Object.keys(resposta).length != 0){
            this.suggestedProductList.push(resposta[0])
            this.aguarde = false
            this.produto = true
          }else{
            this.desculpe = true
          }
          console.log(wordSuggestion.length, cont)
          if(wordSuggestion.length == cont){
            this.loadingSuggested = false
            console.log(this.loadingSuggested )
          }
          cont++
       })
    }
  }

  public selectSuggestion(suggestion){
    this.searchProductDB_Output.emit({search:'suggestion', product:suggestion})
  }

  public searchByTyping(){
    this.desculpe = false
    this.aguarde = false
    $("#input-buscar-produto").blur(); 
    this.searchProductDB_Output.emit({search:'typing', product:this.suggestedProductList})
  }

  searchByClick(suggestion, event){
    if(suggestion.length >= 2){
      console.log(suggestion)
      var wordSuggestion = suggestion.split(" ")
      this.sendSearchSuggestion(wordSuggestion)
    }
  }

  ngOnDestroy(){
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}
