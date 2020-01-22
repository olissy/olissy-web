import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class PaymentListService {

  constructor(private db: AngularFirestore){}

  public getAdminPayment(){
    return this.db.collection('adminPayment', ref => ref.orderBy("indexDay", "desc").limit(1)).valueChanges()
  }

  public getByFOREIGN_KEY(collection, FOREIGN_KEY){
    return this.db.collection(collection, ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY)).valueChanges()
  }

  async setClientPayment(payment){
    return await this.db.collection('clientPayment').add(payment).then(res => {
      this.db.collection('clientPayment').doc(res.id).update({ PRIMARY_KEY:res.id })
    })
  }

  public getClientPayment(){
    return this.db.collection('clientPayment', ref => ref.orderBy("indexDay", "desc").limit(1)).valueChanges()
  }

  /*

  public getByOrderFOREIGN_KEY(PRIMARY_KEY){
    return this.db.collection('order', ref => ref.where("PRIMARY_KEY", "==", PRIMARY_KEY)).valueChanges()
  }

  public getProductDataBase(PRIMARY_KEY_PRODUCT_DB){
    return this.db.collection('productDataBase', ref => ref.where("PRIMARY_KEY", "==", PRIMARY_KEY_PRODUCT_DB)).valueChanges()
  }

  public getByClientFOREIGN_KEY(FOREIGN_KEY){
    return this.db.collection('user', ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY)).valueChanges()
  }

  public async update(collection:string, pk:string, data:any) {
    await this.db.collection(collection).doc(pk).update(data)
  }

  public async updateSales(pk:string) {
    var res:any = false
    const increment = firebase.firestore.FieldValue.increment(1);
    await this.db.collection('product').doc(pk).update({ sale: increment }).then( r =>{
      res = r
    })
    return res
  }

  public getReactionsProduct(FOREIGN_KEY_CLIENT, FOREIGN_KEY_PRODUCT){
    return this.db.collection('reactionsProduct', ref => ref.where("FOREIGN_KEY_CLIENT", "==", FOREIGN_KEY_CLIENT)
                                                            .where("FOREIGN_KEY_PRODUCT", "==", FOREIGN_KEY_PRODUCT))
                                                            .valueChanges()
  }

  public async deleterCollectionStorage(collection, pk) {
    let res:any = false
    await this.db.collection(collection).doc(pk).delete().then( function(r){
      res = r
    })
    return res
  }

  public async createInvoice(data) {
    var res:any = false
    await this.db.collection('invoice').add(data).then(res => {
      this.update('invoice', res.id, { PRIMARY_KEY:res.id })
    })
    return res
  }

  public async incrementProductQuantities(pk, quantities){
    var res:any = false
    const increment = firebase.firestore.FieldValue.increment(quantities);
    await this.db.collection('product').doc(pk).update({ productQuantities: increment }).then( r =>{
      res = r
    })
    return res
  }
  */
}
