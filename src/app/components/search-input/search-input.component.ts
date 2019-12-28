import { Component, OnInit, OnDestroy, Output,Input, EventEmitter  } from '@angular/core'
import { Router } from '@angular/router'
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

  public wordDoDeepSearch

  public wordDoDeepSearchStatus:boolean = true

  public digite = true

  public enter = false

  public aguarde = false

  public desculpe = false

  public produto = false

  public suggestedProductList = []

  public TypingProductList = []

  public loadingSuggested:boolean = false

  constructor(private pesquisaService:SearchInputService, private router: Router) {}

  ngOnInit() {
    this.clearTextSearch()
  }

  public clearTextSearchCaracter(){

    $("#input-buscar-produto").focus()
    $('#input-buscar-produto').val('')

    this.Digite_tres_ou_mais_caracteres_total = 3

    this.loadingSuggested = false

    this.digite = true
      
    this.aguarde = false

    this.desculpe = false

    this.produto = false

    this.suggestedProductList = []

    this.TypingProductList = []

  }

  public clearTextSearch(){
    
    $(".clearable").each(function() {

      $("#input-buscar-produto").focus()
      
      var $inp = $(this).find("input:text")

      var  $cle = $(this).find(".clearable__clear");
    
      $inp.on("input", function(){
        $cle.toggle(!!this.value);
      });
      
      $cle.on("touchstart click", function(e) {
        e.preventDefault();
        $inp.val("").trigger("input");
      });
      
    });
  }

  public SearchBySuggestions(suggestion, event){
  
    if(event.key != 'Enter' && event.key != 'Backspace' && this.Digite_tres_ou_mais_caracteres_total <= 3 && this.Digite_tres_ou_mais_caracteres_total > 0){
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

    if(this.Digite_tres_ou_mais_caracteres_total <= 0 && suggestion.length >= 2){
      this.produto  = false
      this.digite   = false
      this.desculpe = false
      this.aguarde  = true
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
          if(this.suggestion != suggestion && suggestion.length >= 3){
            this.suggestion = suggestion
            var wordSuggestion = suggestion.split(" ")

            var wordSuggestionFilter = wordSuggestion.filter(function (el) {
              return el != null && el != "";
            });

            self.sendSearchSuggestion(wordSuggestionFilter)

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

    
          if(this.enter){
            if(Object.keys(resposta).length != 0){
              for (const product of resposta){
                this.suggestedProductList.push(product)
              }
              this.searchProductDB_Output.emit({search:'typing', product:this.suggestedProductList})
              this.produto = true
              this.aguarde = false
              this.enter = false
              this.desculpe = false
            }
          } 

          if(Object.keys(resposta).length != 0){
            
            for (const product of resposta) {
              this.suggestedProductList.push(product)
            }
            this.produto = true
            this.aguarde = false
            this.enter = false
            this.desculpe = false
            $("#input-buscar-produto").blur();
          }else{
            this.desculpe = true
            this.aguarde = false
            this.enter = false
          }

          if(wordSuggestion.length == cont){
            this.loadingSuggested = false
          }
          
          cont++
       })
    }
  }

  public selectSuggestion(suggestion){
    this.router.navigate(['/'])
    this.searchProductDB_Output.emit({search:'suggestion', product:suggestion})
  }

  public searchByTyping(suggestion, event){
    if(this.Digite_tres_ou_mais_caracteres_total <= 0 && suggestion.length >= 2){
      this.desculpe = false
      this.aguarde = false
      $("#input-buscar-produto").blur(); 
      
      if(this.suggestedProductList.length >= 1){
        this.router.navigate(['/'])
        this.searchProductDB_Output.emit({search:'typing', product:this.suggestedProductList})
      }else{
        this.enter = true
        var wordSuggestion = suggestion.split(" ")

        var wordSuggestionFilter = wordSuggestion.filter(function (el) {
          return el != null && el != "";
        });
        this.router.navigate(['/'])
        this.sendSearchSuggestion(wordSuggestionFilter)
      }
    }
  }

  ngOnDestroy(){
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}
