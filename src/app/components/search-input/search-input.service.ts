import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';


@Injectable({
  providedIn: 'root',
})

export class SearchInputService implements OnDestroy {

  private unsubscribe$ = new Subject();

  constructor(private db: AngularFirestore){}

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

  public getByStoreFOREIGN_KEY(FOREIGN_KEY){
    return this.db.collection('store', ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY)).valueChanges()
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
