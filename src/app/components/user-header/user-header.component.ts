import { Component, OnInit } from '@angular/core';
import { DataService } from "../../data.service";
declare var $ :any;

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})

export class UserHeaderComponent {
  
  public search:boolean = false

  constructor(private data: DataService) {}

  public searchProductDB_Output(productDB){
    $('#displaySearch').modal('hide'); 
    this.data.setProductDB(productDB)
  }
}
