import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
declare var $ :any;
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})

export class UserHeaderComponent implements OnInit {
  

  search = false


  constructor(private data: DataService, private router: Router  ) {
    //router.events.subscribe((val) => {
      //console.log(window.location.href) 
      //console.log(true) 
  //});
  }

  ngOnInit(){ 
    console.log(window.location.href)
  }

  searchProductDB_Output(productDB){
    $('#displaySearch').modal('hide'); 
    this.data.setProductDB(productDB)
  }
}
