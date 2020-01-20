import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-payment',
  templateUrl: './admin-payment.component.html',
  styleUrls: ['./admin-payment.component.css']
})
export class AdminPaymentComponent implements OnInit {

  public paymentList = [
    {
      PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
      statusPayment:"openPayment",
      openPaymentDay:"Wed Jan 01 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
      inPaymentDay:"Fri Jan 31 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
      receivedPaymentDay:"Fri Feb 07 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
      latePaymentDay:"Sat Feb 15 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
      listStore:[
        {
          PRIMARY_KEY:"dfFF567BVNnnfk95Bt"
        }
      ],
      value:"0",
      openPaymentStore:"0",
      receivedPaymentStore:"0",
      InPaymentStore:"0",
      latePaymentStore:"0",
    }
  ]

  public loading:boolean = true

  constructor() { }

  ngOnInit() {

      var curr = new Date;
      var first = curr.getDate() - curr.getDay();
      var last = first + 30;
      var last1 = last + 15;

      var firstday = new Date(curr.setDate(first)).toUTCString();
      var lastday = new Date(curr.setDate(last)).toUTCString();
      var lastday1 = new Date(curr.setDate(last1)).toUTCString();

      console.log(firstday)
      console.log(lastday)
      console.log(lastday1)

      console.log(first)
      console.log(curr.getDate())
      console.log(curr.getDay())
  }

  public startNewOpen(){
     
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

}
