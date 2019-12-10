import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})

export class StoreCommentService {

  constructor(private db: AngularFirestore){}

  public getReviewsByFOREIGN_KEY(FOREIGN_KEY_STORE, LIMIT){
    return this.db.collection('commentStore', ref => ref.where("FOREIGN_KEY_STORE", "==", FOREIGN_KEY_STORE).limit(LIMIT)).valueChanges()
  }
}
