import { Component, OnInit, OnDestroy, Output,Input, EventEmitter  } from '@angular/core'
import { Router } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { SearchStoreProductRecordService } from './search-store-product-record.service'
import { AuthService  } from '../../AuthService';
declare var $ :any

@Component({
  selector: 'search-store-product-record',
  templateUrl: './search-store-product-record.component.html',
  styleUrls: ['./search-store-product-record.component.css']
})
export class SearchStoreProductRecordComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject()

  @Output() searchProductDB_Output:any = new EventEmitter()

  @Input() boscar_por:string

  public Digite_tres_ou_mais_caracteres_total = 3

  public wordDoDeepSearch

  public wordDoDeepSearchStatus:boolean = true

  public digite = true

  public suggestion:string = "name-suggestion"

  public searchRepeated = []

  public enter = false

  public aguarde = false

  public desculpe = false

  public produto = false

  public suggestedProductList = []

  public TypingProductList = []

  public loadingSuggested:boolean = false

  public token:any = ""

  constructor(private search:SearchStoreProductRecordService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.clearTextSearch()
    this.toke()
  }

  public clearTextSearchCaracter(){

    $("#search-store-product-record").focus()
    $('#search-store-product-record').val('')

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

      $("#search-store-product-record").focus()
      
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
    $('#search-store-product-record').keyup(function(){
      clearTimeout(timer)
      
      if ($('#search-store-product-record').val) {
        timer = setTimeout(function(){
          var suggestion = $("#search-store-product-record").val() 
          
          if(self.suggestion != suggestion && suggestion.length >= 3){

            self.suggestion = suggestion
            var wordSuggestion = suggestion.split(" ")

            var wordSuggestionFilter = wordSuggestion.filter(function (el) {
              return el != null && el != "";
            });

            self.sendSearchSuggestion(wordSuggestionFilter)

          }else if(Object.keys(self.searchRepeated).length != 0){
            self.suggestedProductList = []
            for (const product of self.searchRepeated){
              self.suggestedProductList.push(product)
            }
            self.produto = true
            self.aguarde = false
            self.enter = false
            self.desculpe = false
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
        this.search.searchProductsByRegex(word).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
          
          if(this.enter && Object.keys(resposta).length != 0){
            for (const productDB of resposta){
              this.search.productForProductDB(this.token.uid, productDB.PRIMARY_KEY).subscribe((product:any)=>{
                if(Object.keys(product).length != 0 ){
                  this.searchRepeated.push(productDB)
                  this.suggestedProductList = []
                  this.suggestedProductList.push(productDB)
                  this.searchProductDB_Output.emit({search:'typing', product:this.suggestedProductList})
                }
              })
            }
            
            this.produto = true
            this.aguarde = false
            this.enter = false
            this.desculpe = false
            
          }else{

            if(Object.keys(resposta).length != 0){
              for(let index in resposta){
                this.search.productForProductDB(this.token.uid, resposta[index].PRIMARY_KEY).subscribe((product:any)=>{
                  if(Object.keys(product).length != 0 ){
                    this.searchRepeated.push(resposta[index])
                    this.suggestedProductList = []
                    this.suggestedProductList.push(resposta[index])
                  }
                })
              }

              this.produto = true
              this.aguarde = false
              this.enter = false
              this.desculpe = false
              $("#search-store-product-record").blur();
            }else{
              this.desculpe = true
              this.aguarde = false
              this.enter = false
            }
          }

          if(wordSuggestion.length == cont){
            this.loadingSuggested = false
          }
          
          cont++
       })
    }
  }

  public selectSuggestion(suggestion){
    this.router.navigate(['/store-product-record'])
    this.searchProductDB_Output.emit({search:'suggestion', product:suggestion})
  }

  public searchByTyping(suggestion, event){
    if(this.Digite_tres_ou_mais_caracteres_total <= 0 && suggestion.length >= 2){
      this.desculpe = false
      this.aguarde = false
      $("#search-store-product-record").blur(); 
      
      if(this.suggestedProductList.length >= 1){
        this.router.navigate(['/store-product-record'])
        this.searchProductDB_Output.emit({search:'typing', product:this.suggestedProductList})
      }else{
        this.enter = true
        var wordSuggestion = suggestion.split(" ")

        var wordSuggestionFilter = wordSuggestion.filter(function (el) {
          return el != null && el != "";
        });
        this.router.navigate(['/store-product-record'])
        this.sendSearchSuggestion(wordSuggestionFilter)
      }
    }
  }

  
  public toke(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe(async (res:any)=>{
      this.token = await res
    })
  }


  ngOnDestroy(){
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

}
