import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  }  from '@angular/forms';
import {PaymentListService } from './payment-list.service'
import { AppService } from '../../app.service'

import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService  } from '../../AuthService';


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {

  private unsubscribe$ = new Subject();

  public paymentList = []

  public formPayment: FormGroup = new FormGroup({
    'PRIMARY_KEY' :new FormControl(null),
    'indexDay' :new FormControl(null),
    'statusPayment' :new FormControl('openPayment'),
    'openPaymentDay' :new FormControl(null),
    'closedPaymentDay' :new FormControl(null),
    'inPaymentDay' : new FormControl(null),
    'receivedPaymentDay' : new FormControl(null),
    'latePaymentDay' : new FormControl(null),
    'client' : new FormControl([]),
    'totalPayment' : new FormControl('0.00'),
    'storeName' : new FormControl(null),
    'imageUrlStore' : new FormControl(null),
    'storeCity' : new FormControl(null),
    'storeStreet' : new FormControl(null),
    'storeNeighborhood' : new FormControl(null),
    'storeCellPhone' : new FormControl(null),
    'storeEmail' : new FormControl(null),
    'plataformaName' : new FormControl('olissy.com'),
    'plataformaCity' : new FormControl('Vitoria'),
    'bank': new FormControl('Bradesco'),
    'agency': new FormControl('00000-01'),
    'account': new FormControl('123456'),
    'plataformaStreet' : new FormControl('av.Vitoria'),
    'plataformaNeighborhood' : new FormControl('Vitoria-Brasil'),
    'plataformaCellPhone' : new FormControl('27 99904-1192'),
    'plataformaEmail' : new FormControl('olissy.app@gmail.com')
  })
 
  public loading:boolean = true

  constructor(private authService: AuthService, private paymentListService:PaymentListService) { }

  public ngOnInit() {

    
    this.getInfoAdminPayment()
    this.getInfoStore()

    this.paymentListService.getClientPayment().subscribe((payment:any)=>{
      if(Object.keys(payment).length == 0 && this.formPayment.get('openPaymentDay').value != null && this.formPayment.get('storeName').value != null){
        this.createClientPayment()
      }else{
        this.paymentList = payment
        console.log(payment)
      }
    })

  }

  public createClientPayment(){
    this.formPayment.patchValue({ indexDay : new Date() })
    this.paymentListService.setClientPayment(this.formPayment.value)
  }

  public getInfoAdminPayment(){
    this.paymentListService.getAdminPayment().subscribe((payment:any)=>{
      this.formPayment.patchValue({
        openPaymentDay : payment[0].openPaymentDay,
        closedPaymentDay : payment[0].closedPaymentDay,
        inPaymentDay : payment[0].inPaymentDay,
        receivedPaymentDay : payment[0].receivedPaymentDay,
        latePaymentDay : payment[0].latePaymentDay
      })
    })
  }

  public getInfoStore(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((token:any)=>{
      this.paymentListService.getByFOREIGN_KEY('store', token.uid).subscribe((store:any)=>{
        this.formPayment.patchValue({
          storeName : store[0].storeName,
          imageUrlStore : store[0].storeImageUrl,
          storeCity : store[0].storeCity,
          storeStreet : store[0].storeStreet,
          storeNeighborhood : store[0].storeNeighborhood,
          storeCellPhone : store[0].storeCellPhone,
          storeEmail : store[0].storeEmail
        })
      })
    })
  }

  public formatterDateForPayment(date){
    var data = new Date(date),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        formatter = diaF+"/"+mesF

    return formatter
  }

  public loadingPlusPayment(){
    this.loading = false
      setTimeout(() => {
        this.loading = true
      }, 1000);
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
