import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl }  from '@angular/forms';
import { PaymentListService } from './payment-list.service'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService  } from '../../AuthService';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})

export class PaymentListComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public createOnePaymentByDate:boolean = true

  public token

  public PRIMARY_KEY_ADMIN_PAYMENT = null

  public paymentList = []

  public loading:boolean = true

  public loadingPayment:boolean = true

  public lateOnePaymentByDate:boolean = true

  public formStoreListStatePayment: FormGroup = new FormGroup({
    'PRIMARY_KEY' :new FormControl(null),
    'FOREIGN_KEY_STORE' :new FormControl(null),
    'PRIMARY_KEY_ADMIN_PAYMENT' :new FormControl(null),
    'statusPayment' :new FormControl('openPayment')
  })

  public formPayment: FormGroup = new FormGroup({
    'PRIMARY_KEY' :new FormControl(null),
    'PRIMARY_KEY_ADMIN_PAYMENT' :new FormControl(null),
    'FOREIGN_KEY_STORE' :new FormControl(null),
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
 
  constructor(private authService: AuthService, private paymentListService:PaymentListService) { 
    setInterval(() => {
      this.createNewPayment()
      this.periodPayment()
    },1000)
  }

  public ngOnInit() {
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((token:any)=>{
      this.getPayment(token.uid)
      this.setInfoAdminPayment()
      this.setInfoStore(token.uid)
      this.loadingPayment = false
    })
  }

  public getPayment(token){
    this.paymentListService.getStorePayment(token).subscribe((payment:any)=>{
      if(Object.keys(payment).length == 0 && this.formPayment.get('openPaymentDay').value != null && this.formPayment.get('storeName').value != null){
        this.createClientPayment()
      }else{
        this.paymentList = payment
      }
    })
  }

  public createClientPayment(){
    this.paymentListService.setStorePayment(this.formPayment.value)
  }

  public createNewPayment(){
    if(Object.keys(this.paymentList).length != 0){
      if(new Date() > new Date(this.paymentList[0].closedPaymentDay) && this.createOnePaymentByDate && this.paymentList[0].statusPayment == "openPayment"){
        this.createOnePaymentByDate = false
        this.paymentListService.getAdminPayment().subscribe((payment:any)=>{
          this.setFormPayment(payment)
          console.log(this.formPayment.value)
          console.log(this.paymentList[0])
          
          this.paymentListService.updateStatusPayment(this.paymentList[0].PRIMARY_KEY, {statusPayment:'inPayment'}).then((payment:any)=>{
            this.paymentListService.setStorePayment(this.formPayment.value).then((payment:any)=>{
              this.createOnePaymentByDate = true
            })
          })
          
        })
      }
    }
  }

  public periodPayment(){
    if(this.paymentList[1]){
      if(new Date() > new Date(this.paymentList[1].latePaymentDay) && this.lateOnePaymentByDate && this.paymentList[1].statusPayment == "inPayment"){
        this.lateOnePaymentByDate = false
        this.paymentListService.updateStatusPayment(this.paymentList[1].PRIMARY_KEY, {statusPayment:'latePayment'}).then((payment:any)=>{
          this.lateOnePaymentByDate = false
        })
      }
    }
  }

  public setInfoAdminPayment(){
    this.paymentListService.getAdminPayment().subscribe((payment:any)=>{
      this.PRIMARY_KEY_ADMIN_PAYMENT = payment[0].PRIMARY_KEY

      this.formStoreListStatePayment.patchValue({
        PRIMARY_KEY_ADMIN_PAYMENT : payment[0].PRIMARY_KEY,
      })

      this.formPayment.patchValue({
        PRIMARY_KEY_ADMIN_PAYMENT : payment[0].PRIMARY_KEY,
        openPaymentDay : payment[0].openPaymentDay,
        closedPaymentDay : payment[0].closedPaymentDay,
        inPaymentDay : payment[0].inPaymentDay,
        receivedPaymentDay : payment[0].receivedPaymentDay,
        latePaymentDay : payment[0].latePaymentDay,
        indexDay : new Date()
      })
    })
  }

  public setInfoStore(token){
    this.paymentListService.getByFOREIGN_KEY('store', token).subscribe((store:any)=>{
      
      this.formStoreListStatePayment.patchValue({
        FOREIGN_KEY_STORE : store[0].FOREIGN_KEY,
      })

      this.formPayment.patchValue({
        storeName : store[0].storeName,
        imageUrlStore : store[0].storeImageUrl,
        storeCity : store[0].storeCity,
        storeStreet : store[0].storeStreet,
        storeNeighborhood : store[0].storeNeighborhood,
        storeCellPhone : store[0].storeCellPhone,
        storeEmail : store[0].storeEmail,
        FOREIGN_KEY_STORE : store[0].FOREIGN_KEY
      })
    })
  }

  public formatterDateForPayment(date){
    let data = new Date(date),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        formatter = diaF+"/"+mesF

    return formatter
  }

  public setFormPayment(payment){
    this.formPayment.patchValue({
      PRIMARY_KEY_ADMIN_PAYMENT : payment[0].PRIMARY_KEY,
      openPaymentDay : payment[0].openPaymentDay,
      closedPaymentDay : payment[0].closedPaymentDay,
      inPaymentDay : payment[0].inPaymentDay,
      receivedPaymentDay : payment[0].receivedPaymentDay,
      latePaymentDay : payment[0].latePaymentDay,
      indexDay : new Date()
    })
  }

  public loadingPlusPayment(){
    this.loading = false
      setTimeout(() => {
        this.loading = true
      }, 1000);
  }

  public addPayment(PRIMARY_KEY_INVOICE, name, price){

    let store = {
      PRIMARY_KEY_INVOICE : PRIMARY_KEY_INVOICE,
      data : new Date().toString(),
      name : name,
      price : price
    }

    this.paymentListService.AddStoreListPayment(this.paymentList[0].PRIMARY_KEY, store) 

    this.paymentListService.addTaxingAdmin(this.PRIMARY_KEY_ADMIN_PAYMENT)


    //Pagina administrador, para contar as lojas por perildo em "/admin-payment"
    this.paymentListService.getStoreListStatePayment(this.formStoreListStatePayment.get('PRIMARY_KEY_ADMIN_PAYMENT').value, 
                                                    this.formStoreListStatePayment.get('FOREIGN_KEY_STORE').value).subscribe((store:any)=>{
       if(Object.keys(store).length == 0){
        console.log('cadastar historico de pagamento da loja', this.formStoreListStatePayment.value)
        this.paymentListService.AddStoreListStatePayment(this.formStoreListStatePayment.value)
       }else{
        console.log(store)
       }
    })
  }

  public getTimeZone(){
    this.paymentListService.getTimeZone().subscribe((times:any)=>{
      let data = new Date(times.datetime)
      return data
    })
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
