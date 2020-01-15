import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {

  public paymentDetail = {
    PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
    storeName :"ultrafarma",
    statusPayment:"inPayment",
    storeCity :"guarapari",
    storeStreet :"rua itapemirim",
    storeNeighborhood :"praia do morro",
    storeCellPhone :"27 9 98292939",
    storeEmail :"ultrafarma@mail.com",
    plataformaName :"olissy",
    plataformaCity :"vitoria",
    totalPayment:"943.90",
    bank:"Bradesco",
    agency:"0005-13",
    account:"210393029",
    plataformaStreet :"av. princesa isabel",
    plataformaNeighborhood :"praia da costa",
    plataformaCellPhone :"27 33629009",
    plataformaEmail :"contato@olissy.com",
    dataOpening:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataPayment:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    dataDue:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    paid:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
    client:[
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "maeli bastista ramos",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "maikelly bastista ramos",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "gebson bastista ramos",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "larisa ramos",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "paulo bastista",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "kaio",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "jao",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "vitoria",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "maria",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "saulo",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "ricardo",
        price:"0.25"
      },
      {
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "pedro",
        price:"0.25"
      }
    ]
  }

  public listOrderClient = {
    start:0,
    totalOfOrders:0,
    orders:[]
  }
  constructor() { }

  ngOnInit() {
    this.listOrderClient.totalOfOrders = this.paymentDetail.client.length
    this.showMoreOrders()
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

  public showMoreOrders(){
    if(this.listOrderClient.start <= this.listOrderClient.totalOfOrders){
      this.listOrderClient.start = this.listOrderClient.start + 2
      this.listOrderClient.orders = []
      for (const key in this.paymentDetail.client) {
        if( this.listOrderClient.start >= parseInt(key) ){
          this.listOrderClient.orders.push(this.paymentDetail.client[key])
        }
      }
      if(this.listOrderClient.start >= this.listOrderClient.totalOfOrders){
        this.listOrderClient.start = this.listOrderClient.totalOfOrders - 1
      }
    }
  }

}