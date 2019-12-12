import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import apiOlissyMongoDB from '../../api'

@Injectable({
  providedIn: 'root',
})

export class SearchInputService implements OnDestroy {

  private unsubscribe$ = new Subject();

  constructor(private db: AngularFirestore, private http: HttpClient){}

  private url = apiOlissyMongoDB
  
  public pesquisaProdutosAll(collection, campo, valor, emVenda, precoMin = 0, precoMax = 0, boscar_por) {
    return this.db.collection(collection, ref => ref.where(campo, ">", valor).where('productForSale', "==", 'sim')).valueChanges()
  }

  public pesquisaProdutosCaterory(collection, campo, valor, emVenda, precoMin = 0, precoMax = 0, boscar_por, id_comercio) {
    return this.db.collection(collection, ref => ref.where(campo, ">", valor).where('productForSale', "==", 'sim')
                                                                             .where('productCategory', "==", boscar_por)).valueChanges()
  }

  public pesquisaProdutosStore(collection, campo, valor, emVenda, precoMin = 0, precoMax = 0, boscar_por, FOREIGN_KEY) {
    return this.db.collection(collection, ref => ref.where(campo, ">", valor).where('productForSale', "==", 'sim')
                                                                             .where('FOREIGN_KEY', "==", FOREIGN_KEY)).valueChanges()
  }

  public getSearchByTyping(PRIMARY_KEY) {
    return this.db.collection('product', ref => ref.where('PRIMARY_KEY_PRODUCT_DB', "==", PRIMARY_KEY).limit(5).where("productQuantities", ">", 0).where("productForSale", "==", "sim")).valueChanges()
  }

  public getSuggestion(PRIMARY_KEY) {
    return this.db.collection('product', ref => ref.where('PRIMARY_KEY_PRODUCT_DB', "==", PRIMARY_KEY).limit(50).where("productQuantities", ">", 0).where("productForSale", "==", "sim")).valueChanges()
  }

  public getByStoreFOREIGN_KEY(FOREIGN_KEY){
    return this.db.collection('store', ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY)).valueChanges()
  }

  public searchProductsByRegex(search: string) {
    return this.http.get<any>(this.url + '/regex/?text=' + search);
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
