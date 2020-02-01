import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { firebase } from '@firebase/app';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentListService {

  constructor(private db: AngularFirestore, private http: HttpClient){}

  public AddStoreListStatePayment(store){
    return this.db.collection('storeListStatePayment').add(store).then(res => {
      this.db.collection('storeListStatePayment').doc(res.id).update({ PRIMARY_KEY:res.id })
    })
  }

  public getStoreListStatePayment(PRIMARY_KEY_ADMIN_PAYMENT, FOREIGN_KEY_STORE){
    return this.db.collection('storeListStatePayment', ref => ref.where("PRIMARY_KEY_ADMIN_PAYMENT", "==", PRIMARY_KEY_ADMIN_PAYMENT)
                                                                 .where("FOREIGN_KEY_STORE", "==", FOREIGN_KEY_STORE).limit(1)).valueChanges()
  }

  public getAdminPayment(){
    return this.db.collection('adminPayment', ref => ref.orderBy("indexDay", "desc").limit(1)).valueChanges()
  }

  public getByFOREIGN_KEY(collection, FOREIGN_KEY){
    return this.db.collection(collection, ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY)).valueChanges()
  }

  async setStorePayment(payment){
    return await this.db.collection('storePayment').add(payment).then(res => {
      this.db.collection('storePayment').doc(res.id).update({ PRIMARY_KEY:res.id })
    })
  }

  public getStorePayment(FOREIGN_KEY_STORE){
    return this.db.collection('storePayment', ref => ref.where("FOREIGN_KEY_STORE", "==", FOREIGN_KEY_STORE).orderBy("indexDay", "desc").limit(10)).valueChanges()
  }

  public async updateStatusPayment(pk:string, data:any){
    return await this.db.collection('storePayment').doc(pk).update(data)
  }

  public async AddStoreListPayment(PRIMARY_KEY, data) {
    await this.db.collection("storePayment").doc(PRIMARY_KEY).update({'client':firebase.firestore.FieldValue.arrayUnion(data)})
    
    const increment = firebase.firestore.FieldValue.increment(0.25);
    await this.db.collection('storePayment').doc(PRIMARY_KEY).update({ totalPayment: increment })
  }

  public async addTaxingAdmin(PRIMARY_KEY){
    const increment = firebase.firestore.FieldValue.increment(0.25);
    await this.db.collection('adminPayment').doc(PRIMARY_KEY).update({ value: increment })
  }

  public getTimeZone() {
    return this.http.get<any[]>("http://worldtimeapi.org/api/timezone/America/Sao_Paulo");
  }

}
