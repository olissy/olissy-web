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
    return this.db.collection('adminPayment', ref => ref.orderBy("indexDay").limit(5)).valueChanges()
  }

  public async updateStatusPayment(pk:string, data:any) {
    var res:any = false
    await this.db.collection('adminPayment').doc(pk).update(data).then( r =>{
      res = r
    })
    return res
  }
}
