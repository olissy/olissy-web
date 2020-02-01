import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";


@Injectable({
  providedIn: 'root'
})
export class AdminPaymentListDetailService {

  constructor(private db: AngularFirestore){}

  public getStorePayment(PRIMARY_KEY){
    return this.db.collection('storePayment', ref => ref.where("PRIMARY_KEY", "==", PRIMARY_KEY).limit(1)).valueChanges()
  }

  public async AddRegisterPayment(PRIMARY_KEY){
    return await this.db.collection('storePayment').doc(PRIMARY_KEY).update({statusPayment:"receivedPayment"})
  }

  public async AddInPayment(PRIMARY_KEY){
    return await this.db.collection('storePayment').doc(PRIMARY_KEY).update({statusPayment:"inPayment"})
  }

  public async AddLatePayment(PRIMARY_KEY){
    return await this.db.collection('storePayment').doc(PRIMARY_KEY).update({statusPayment:"latePayment"})
  }
  
  public async AddOpenPayment(PRIMARY_KEY){
    return await this.db.collection('storePayment').doc(PRIMARY_KEY).update({statusPayment:"openPayment"})
  }
}
