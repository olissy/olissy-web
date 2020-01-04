import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Injectable()
export class PushNotificationService {

  messaging = firebase.messaging()

  private unsubscribe$ = new Subject();

  constructor(private db: AngularFirestore, 
              private afAuth: AngularFireAuth) {}

  updateToken(token) {
    this.afAuth.authState.pipe(take(1)).pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (!user) return;
      
      this.getByFOREIGN_KEY('user', user.uid).subscribe((user:any)=>{
        if(user[0].TokenWebPushNotification == token) return;

        this.update('user',user[0].PRIMARY_KEY,{ TokenWebPushNotification : token })
      })
    })
  }



  public getByFOREIGN_KEY(collection, FOREIGN_KEY) {
    return this.db.collection(collection, ref =>ref.where('FOREIGN_KEY', '==', FOREIGN_KEY)).valueChanges();
  }

  public update(collection, pk, data: any) {
    return this.db.collection(collection).doc(pk).update(data);
  }

  getPermission() {
    this.afAuth.authState.pipe(take(1)).pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (!user) return;
      
      this.messaging.requestPermission()
      .then(() => {
        console.log('Permissão de notificação concedida.');
        return this.messaging.getToken()
      })
      .then(token => {
        this.updateToken(token)
      })
      .catch((err) => {
        console.log('Não foi possível obter permissão para notificar.', err);
      });
    })
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}