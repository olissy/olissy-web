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
    statusPayment:"openPayment",
    storeName :"ultrafarma",
    imageUrlStore:"/assets/plataform/avatar.png",
    openPaymentDay:"Wed Jan 01 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    inPaymentDay:"Fri Jan 31 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    receivedPaymentDay:"Fri Feb 07 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    latePaymentDay:"Sat Feb 15 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    totalPayment:"945.25",
    storeCity :"guarapari",
    storeStreet :"rua itapemirim",
    storeNeighborhood :"praia do morro",
    storeCellPhone :"27 9 98292939",
    storeEmail :"ultrafarma@mail.com",
    plataformaName :"olissy",
    plataformaCity :"vitoria",
    bank:"Bradesco",
    agency:"0005-13",
    account:"210393029",
    plataformaStreet :"av. princesa isabel",
    plataformaNeighborhood :"praia da costa",
    plataformaCellPhone :"27 33629009",
    plataformaEmail :"contato@olissy.com",
    client:[
      {
        PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "maeli bastista ramos",
        price:"0.25"
      }
    ]
  },
  {
    PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
    statusPayment:"inPayment",
    storeName :"ultrafarma",
    imageUrlStore:"/assets/plataform/avatar.png",
    openPaymentDay:"Wed Jan 01 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    inPaymentDay:"Fri Jan 31 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    receivedPaymentDay:"Fri Feb 07 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    latePaymentDay:"Sat Feb 15 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    totalPayment:"945.25",
    storeCity :"guarapari",
    storeStreet :"rua itapemirim",
    storeNeighborhood :"praia do morro",
    storeCellPhone :"27 9 98292939",
    storeEmail :"ultrafarma@mail.com",
    plataformaName :"olissy",
    plataformaCity :"vitoria",
    bank:"Bradesco",
    agency:"0005-13",
    account:"210393029",
    plataformaStreet :"av. princesa isabel",
    plataformaNeighborhood :"praia da costa",
    plataformaCellPhone :"27 33629009",
    plataformaEmail :"contato@olissy.com",
    client:[
      {
        PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "maeli bastista ramos",
        price:"0.25"
      }
    ]
  },
  {
    PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
    statusPayment:"latePayment",
    storeName :"ultrafarma",
    imageUrlStore:"/assets/plataform/avatar.png",
    openPaymentDay:"Wed Jan 01 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    inPaymentDay:"Fri Jan 31 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    receivedPaymentDay:"Fri Feb 07 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    latePaymentDay:"Sat Feb 15 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    totalPayment:"945.25",
    storeCity :"guarapari",
    storeStreet :"rua itapemirim",
    storeNeighborhood :"praia do morro",
    storeCellPhone :"27 9 98292939",
    storeEmail :"ultrafarma@mail.com",
    plataformaName :"olissy",
    plataformaCity :"vitoria",
    bank:"Bradesco",
    agency:"0005-13",
    account:"210393029",
    plataformaStreet :"av. princesa isabel",
    plataformaNeighborhood :"praia da costa",
    plataformaCellPhone :"27 33629009",
    plataformaEmail :"contato@olissy.com",
    client:[
      {
        PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "maeli bastista ramos",
        price:"0.25"
      }
    ]
  },
  {
    PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
    statusPayment:"receivedPayment",
    storeName :"ultrafarma",
    imageUrlStore:"/assets/plataform/avatar.png",
    openPaymentDay:"Wed Jan 01 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    inPaymentDay:"Fri Jan 31 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    receivedPaymentDay:"Fri Feb 07 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    latePaymentDay:"Sat Feb 15 2020 21:00:00 GMT-0300 (Horário Padrão de Brasília)",
    totalPayment:"945.25",
    storeCity :"guarapari",
    storeStreet :"rua itapemirim",
    storeNeighborhood :"praia do morro",
    storeCellPhone :"27 9 98292939",
    storeEmail :"ultrafarma@mail.com",
    plataformaName :"olissy",
    plataformaCity :"vitoria",
    bank:"Bradesco",
    agency:"0005-13",
    account:"210393029",
    plataformaStreet :"av. princesa isabel",
    plataformaNeighborhood :"praia da costa",
    plataformaCellPhone :"27 33629009",
    plataformaEmail :"contato@olissy.com",
    client:[
      {
        PRIMARY_KEY:"dfFF567BVNnnfk95Bt",
        data:"Tue Jan 14 2020 14:03:46 GMT-0300 (Horário Padrão de Brasília)",
        name: "maeli bastista ramos",
        price:"0.25"
      }
    ]
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
