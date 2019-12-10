import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})
export class StorePageService {

  constructor(private db: AngularFirestore){}

  public store(collection, FOREIGN_KEY){
    return this.db.collection(collection, ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY).where("authorizationOpenStore", "==", true)).valueChanges()
  }
  
  public getByFOREIGN_KEY(collection, FOREIGN_KEY){
    return this.db.collection(collection, ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY)).valueChanges()
  }

  public getContact(FOREIGN_KEY_STORE, FOREIGN_KEY_CLIENT){
    return this.db.collection("message", ref => ref.where("FOREIGN_KEY_CLIENT", "==", FOREIGN_KEY_CLIENT)
                                                   .where("FOREIGN_KEY_STORE", "==", FOREIGN_KEY_STORE)).valueChanges()
  }

  public existContactStoreEndClient(FOREIGN_KEY_CLIENT, FOREIGN_KEY_STORE){
    return this.db.collection("contact", ref => ref.where("FOREIGN_KEY_CLIENT", "==", FOREIGN_KEY_CLIENT)
                                                   .where("FOREIGN_KEY_STORE", "==", FOREIGN_KEY_STORE)).valueChanges()
  }

  public async criarContact(newContact) {
    delete newContact.message
    return this.db.collection("contact").add(newContact)
  }

  public updateContactEndRedirectToMessage(collection, pk, data:any) {
    return this.db.collection(collection).doc(pk).update(data)
  }
}
