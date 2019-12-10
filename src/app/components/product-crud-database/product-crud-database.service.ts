import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { firebase } from '@firebase/app';
import '@firebase/storage';
import '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})

export class ProductCrudDatabaseService {

  constructor(private db: AngularFirestore){}

  public async createNewProvider(provider) {
    await this.db.collection("provider").add(provider)
  }

  public getByNameProvider(provider) {
    return this.db.collection('provider', ref =>ref.where('providerNameQuery', '==', provider)).valueChanges();
  }

  public getAllProvider(){
    return this.db.collection('provider').valueChanges()
  }

  public async sendImagemStorage(imageName, imagem){
    var res:any = false
    await firebase.storage().ref().child(imageName).put(imagem).then(async (r:any) =>{
      res = await this.obterImagemStorage(r.metadata.fullPath)
    })
    return res
  }

  public async obterImagemStorage(path){
    var res:any = false
    await firebase.storage().ref().child(path).getDownloadURL().then( r =>{
      res = r
    })
    return res
  }

  public async createProduto(collection, data) {
    delete data.imageDisplay
    delete data.imageNew
    return await this.db.collection(collection).add(data).then(res => {
      this.update(collection, res.id, { PRIMARY_KEY:res.id }).then(()=>{
         this.productDataBaseQuantity()
      })
    })
  }

  public async update(collection:string, pk:string, data:any) {
    var res:any = false
    await this.db.collection(collection).doc(pk).update(data).then( r =>{
      res = r
    })
    return res
  }

  public async productDataBaseQuantity() {
    const increment = firebase.firestore.FieldValue.increment(1);
    await this.db.collection('countOf').doc("0FPh9yLyy34ldMYC8l8t").update({ productDataBase : increment })
  }
}
