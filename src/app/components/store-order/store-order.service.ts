
import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { firebase } from '@firebase/app';

@Injectable({
  providedIn: 'root',
})
export class StoreOrderService {

  constructor(private db: AngularFirestore){}

  public async enviarMensagemNoPedido(collection, pk, data:any){
    //https://firebase.googleblog.com/2018/08/better-arrays-in-cloud-firestore.html
    var res:any = false
    await this.db.collection(collection).doc(pk).update({'message':firebase.firestore.FieldValue.arrayUnion(data)}).then( r =>{
      res = r
    })
    return res
  }

  public async deleterCollectionStorage(collection, pk) {
    let res:any = false
    await this.db.collection(collection).doc(pk).delete().then( function(r){
      res = r
    })
    return res
  }

  public async update(collection:string, pk:string, data:any) {
    var res:any = false
    await this.db.collection(collection).doc(pk).update(data).then( r =>{
      res = r
    })
    return res
  }

  public async updateSales(pk:string) {
    var res:any = false
    const increment = firebase.firestore.FieldValue.increment(1);
    await this.db.collection('product').doc(pk).update({ sale: increment }).then( r =>{
      res = r
    })
    return res
  }

  public getOrderByFOREIGN_KEY(collection, FOREIGN_KEY_STORE){
    return this.db.collection(collection, ref => ref.where("FOREIGN_KEY_STORE", "==", FOREIGN_KEY_STORE)).valueChanges()
  }

  public getReactionsProduct(FOREIGN_KEY_CLIENT, FOREIGN_KEY_PRODUCT){
    return this.db.collection('reactionsProduct', ref => ref.where("FOREIGN_KEY_CLIENT", "==", FOREIGN_KEY_CLIENT)
                                                            .where("FOREIGN_KEY_PRODUCT", "==", FOREIGN_KEY_PRODUCT))
                                                            .valueChanges()
  }

  public async marcarMensagemComoVisualizadaComercio(collection, pk, data){
    var res:any = false
    await this.db.collection(collection).doc(pk).update(data).then( r =>{
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

}
