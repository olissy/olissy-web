import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  }  from '@angular/forms';
import {AdminPaymentService } from './admin-payment.service'

@Component({
  selector: 'app-admin-payment',
  templateUrl: './admin-payment.component.html',
  styleUrls: ['./admin-payment.component.css']
})
export class AdminPaymentComponent implements OnInit {

  public clock = {
    data:"dd/mm/yyyy",
    time:"00:00:00"
  }

  public createOnePaymentByDate:boolean = true
  public lateOnePaymentByDate:boolean = true

  public paymentList:any = []

  public formPayment: FormGroup = new FormGroup({
    'PRIMARY_KEY':new FormControl(null),
    'indexDay':new FormControl(null),
    'statusPayment':new FormControl('openPayment'),
    'openPaymentDay':new FormControl(null),
    'closedPaymentDay':new FormControl(null),
    'inPaymentDay': new FormControl(null),
    'receivedPaymentDay': new FormControl(null),
    'latePaymentDay': new FormControl(null),
    'listStore': new FormControl([]),
    'value': new FormControl(0),
    'openPaymentStore':new FormControl(0),
    'receivedPaymentStore':new FormControl(0),
    'InPaymentStore':new FormControl(0),
    'latePaymentStore':new FormControl(0),
  })

  public loading:boolean = true

  constructor(private adminPaymentService:AdminPaymentService) {
    setInterval(() => {
      this.setClock()
      this.createNewPayment()
      this.periodPayment()
    },1000)
  }

  ngOnInit() {
    this.setFormPayment()
    this.adminPaymentService.getAdminPayment().subscribe((payment:any)=>{
      this.paymentList = payment
      console.log(payment)
    })
  }

  public createNewPayment(){
    if(Object.keys(this.paymentList).length != 0){
      if(new Date() > new Date(this.paymentList[0].closedPaymentDay) && this.createOnePaymentByDate && this.paymentList[0].statusPayment == "openPayment"){
        this.createOnePaymentByDate = false
        this.setFormPayment()
        this.adminPaymentService.updateStatusPayment(this.paymentList[0].PRIMARY_KEY, {statusPayment:'inPayment'}).then((payment:any)=>{
          this.adminPaymentService.setAdminPayment(this.formPayment.value).then((payment:any)=>{
            console.log(payment)
            this.createOnePaymentByDate = true
          })
        })
      }
    }
  }

  public periodPayment(){
    if(Object.keys(this.paymentList).length != 0){
      if(new Date() > new Date(this.paymentList[1].latePaymentDay) && this.lateOnePaymentByDate && this.paymentList[1].statusPayment == "inPayment"){
        this.lateOnePaymentByDate = false
        this.adminPaymentService.updateStatusPayment(this.paymentList[1].PRIMARY_KEY, {statusPayment:'latePayment'}).then((payment:any)=>{
          this.lateOnePaymentByDate = false
        })
      }
    }
  }

  startPrimaryPayment(){
    this.adminPaymentService.setAdminPayment(this.formPayment.value)
  }

  public setFormPayment(){
    var date = new Date();
    var nextMonth = new Date();

    var openPaymentDay:any = new Date(date.getFullYear(), date.getMonth(), 1);
    var closedPaymentDay:any = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var inPaymentDay:any = null
    const latePaymentDay = new Date(date.setDate(46));

    if(nextMonth.getMonth() == 11){
      inPaymentDay = new Date(nextMonth.getFullYear() + 1, 0, 1);
    }else{
      inPaymentDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1);
    }

    this.formPayment.patchValue({
      openPaymentDay:openPaymentDay.toString(),
      closedPaymentDay:closedPaymentDay.toString(),
      inPaymentDay: inPaymentDay.toString(),
      latePaymentDay: latePaymentDay.toString(),
      indexDay: new Date()
    })


  }

  public formatterDateForPayment(date){
    var data = new Date(date),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear(),
        formatter = diaF+"/"+mesF+"/"+anoF;

    return formatter
  }

  public loadingPlusPayment(){
    this.loading = false
      setTimeout(() => {
        this.loading = true
      }, 1000);
  }

  public setClock() {
    var time = new Date();
    var data = new Date();

    var dia  = data.getDate().toString();
    var diaF = (dia.length == 1) ? '0'+dia : dia;
    var mes  = (data.getMonth()+1).toString();
    var mesF = (mes.length == 1) ? '0'+mes : mes;
    var anoF = data.getFullYear();

    var hours = time.getHours().toString();
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();

    this.clock.data = diaF+"/"+mesF+"/"+anoF;
    this.clock.time = hours+":"+minutes+":"+seconds;
  }

}
