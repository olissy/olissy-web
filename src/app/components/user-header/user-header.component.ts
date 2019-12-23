import { Component } from '@angular/core';
import { DataService } from "../../data.service";
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router';
declare var $ :any;

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})

export class UserHeaderComponent {
  

  search = false


  constructor(private data: DataService, private route:ActivatedRoute, private router:Router  ) {

    /*    router.events.subscribe((url:any) => {
      console.log(url.url)
      if(url.url == "/product"){
        this.search = true
      }
    });
    */
  
  }

  searchProductDB_Output(productDB){
    $('#displaySearch').modal('hide'); 
    this.data.setProductDB(productDB)
  }
}
