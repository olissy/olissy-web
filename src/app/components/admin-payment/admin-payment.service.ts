import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { firebase } from '@firebase/app';
import '@firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class AdminPaymentService {

  constructor(private db: AngularFirestore){}

  async setAdminPayment(payment){
    return await this.db.collection('adminPayment').add(payment).then(res => {
      this.db.collection('adminPayment').doc(res.id).update({ PRIMARY_KEY:res.id })
    })
  }

  getAdminPayment(){
    return this.db.collection('adminPayment', ref => ref.orderBy("indexDay", "desc").limit(10)).valueChanges()
  }

  public async updateStatusPayment(pk:string, data:any){
    return await this.db.collection('adminPayment').doc(pk).update(data)
  } 

  public getStoreListStatePayment(PRIMARY_KEY_KEY_ADMIN_PAYMENT, statusPayment){
    return this.db.collection('storeListStatePayment', ref => ref.where("PRIMARY_KEY_KEY_ADMIN_PAYMENT", "==", PRIMARY_KEY_KEY_ADMIN_PAYMENT).where("statusPayment", "==", statusPayment)).valueChanges()
  }

}
