import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {

  public paymentList = [
    {
    PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
    statusPayment:"open",
    dataOpening:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataPayment:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataDue:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    listOrder:[],
    bank:"",
    agency:"",
    account:"",
    value:"945.25",
  },
  {
    PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
    statusPayment:"inPayment",
    dataOpening:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataPayment:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataDue:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    listOrder:[],
    bank:"",
    agency:"",
    account:"",
    value:"945.25",
  },
  {
    PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
    statusPayment:"paid",
    dataOpening:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataPayment:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataDue:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    listOrder:[],
    bank:"",
    agency:"",
    account:"",
    value:"945.25",
  },
  {
    PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
    statusPayment:"delay",
    dataOpening:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataPayment:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataDue:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    listOrder:[],
    bank:"",
    agency:"",
    account:"",
    value:"945.25",
  }]

  public loading:boolean = true

  constructor() { }

  ngOnInit() {

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

}
