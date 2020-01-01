import { Injectable }          from '@angular/core';
//import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth }     from '@angular/fire/auth';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs'
import { take } from 'rxjs/operators';


@Injectable()
export class MessagingService {

  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(private db: AngularFirestore, 
              private afAuth: AngularFireAuth) {}

  updateToken(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (!user) return;

      const data = { [user.uid]: token }
      console.log(data) 
      this.db.collection("push").valueChanges()
      //this.db.collection("push").add(data)
    })
  }

  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        console.log('Permissão de notificação concedida.');
        return this.messaging.getToken()
      })
      .then(token => {
        console.log(token)
        this.updateToken(token)
      })
      .catch((err) => {
        console.log('Não foi possível obter permissão para notificar.', err);
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
        console.log("Mensagem recebida. ", payload);
        this.currentMessage.next(payload)
      });

    }
}