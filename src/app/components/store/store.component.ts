import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from './store.service'

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})

export class StoreComponent implements OnInit {

  public loading:boolean = true

  public LIMIT:number = 50

  public stores: Observable<any[]>

  constructor(private storeListService:StoreService) {}

  ngOnInit() {
    this.loading = false
    setTimeout(() => {
      this.stores = this.storeListService.obterTodosComercioPorCategoria(this.LIMIT)
      this.loading = true
    }, 1000);
  }

  public loadingPlusProduct(){
    this.loading = false
    setTimeout(() => {
      this.stores = this.storeListService.obterTodosComercioPorCategoria((this.LIMIT++)*2)
      this.loading = true
    }, 1000);
  }

  produtos_Input(){}
}
