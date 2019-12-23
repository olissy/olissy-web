import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private productDBSource = new BehaviorSubject('false');
  getProductDB = this.productDBSource.asObservable();

  constructor() { }

  setProductDB(message: any) {
    this.productDBSource.next(message)
  }

}