import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})

export class ProductService {

  constructor(private db: AngularFirestore){}

  public productDataBase(PRIMARY_KEY) {
    return this.db.collection('productDataBase', ref => ref.where("PRIMARY_KEY", "==", PRIMARY_KEY)).valueChanges();
  }
  
  public product(LIMIT) {
    return this.db.collection('product', ref => ref.limit(LIMIT).where("productQuantities", ">", 0).where("productForSale", "==", "sim")).valueChanges();
  }
  
  public store(FOREIGN_KEY) {
    return this.db.collection('store', ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY).where("authorizationOpenStore", "==", true)).valueChanges();
  }

  public productSuggested(PRIMARY_KEY) {
    return this.db.collection('product', ref => ref.where('PRIMARY_KEY_PRODUCT_DB', "==", PRIMARY_KEY).limit(50).where("productQuantities", ">", 0).where("productForSale", "==", "sim")).valueChanges()
  }

  public storeSuggested(FOREIGN_KEY) {
    return this.db.collection('store', ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY).where("authorizationOpenStore", "==", true)).valueChanges();
  }



}
