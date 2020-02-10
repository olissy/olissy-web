import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { firebase } from '@firebase/app';


@Injectable({
  providedIn: 'root',
})

export class ClientOrderService {

  constructor(private db: AngularFirestore){}

  public async update(collection:string, pk:string, data:any) {
    var res:any = false

    await this.db.collection(collection).doc(pk).update(data).then( r =>{
      res = r
    })
    return res
  }

  public getByFOREIGN_KEY(collection, FOREIGN_KEY, limit){
    return this.db.collection(collection, ref => ref.where("FOREIGN_KEY", "==", FOREIGN_KEY).limit(limit)).valueChanges()
  }

  public getByPedidoFOREIGN_KEY(collection, FOREIGN_KEY, order){
    return this.db.collection(collection, ref => ref.where("FOREIGN_KEY_CLIENT", "==", FOREIGN_KEY).orderBy("indexDay", "desc")).valueChanges()
  }

  public async marcarMensagemComoVisualizadaComercio(collection, pk, data){
    var res:any = false
    await this.db.collection(collection).doc(pk).update(data).then( r =>{
      res = r
    })
    return res
  }

  public async enviarMensagemNoPedido(collection, pk, data:any){
    var res:any = false
    await this.db.collection(collection).doc(pk).update({'message':firebase.firestore.FieldValue.arrayUnion(data)}).then( r =>{
      res = r
    })
    return res
  }

}
