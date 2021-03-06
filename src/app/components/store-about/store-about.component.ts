import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators  }  from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../AuthService'
import { StoreAboutService } from './store-about.service'

@Component({
  selector: 'app-store-about',
  templateUrl: './store-about.component.html',
  styleUrls: ['./store-about.component.css']
})

export class StoreAboutComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public quantityOfProducts = 0

  public quantiyOfSales = 0

  public FOREIGN_KEY_STORE:any = ''

  public formStores: FormGroup = new FormGroup({
    'FOREIGN_KEY':new FormControl(null),
    'PRIMARY_KEY':new FormControl(null),
    'storeRating':new FormControl(0),
    'follow':new FormControl(0),
    'storeImagePath': new FormControl(null),
    'storeImageUrl': new FormControl(null),
    'imageDisplay': new FormControl(null),
    'imageNew': new FormControl(null,Validators.required),
    'storeName': new FormControl(null,Validators.required),
    'storeHours':new FormControl(null,Validators.required),
    'storeDeliveryEstimate':new FormControl(null,Validators.required),
    'storeCategory':new FormControl(null,Validators.required),
    'storeAbout':new FormControl(null,Validators.required),
    'storeCity':new FormControl(null,Validators.required),
    'storeNeighborhood':new FormControl(null,Validators.required),
    'storeStreet':new FormControl(null,Validators.required),
    'storeCellPhone':new FormControl(null,Validators.required),
    'storeEmail':new FormControl(null),
    'storeTelephone':new FormControl(null,Validators.required),
  })

  constructor(private comercioSobreService: StoreAboutService,
              private authService:AuthService) {}

  ngOnInit() {
    this.authService.isLogged().subscribe((res:any)=>{
      this.comercioSobreService.getByFOREIGN_KEY('store', res.uid).pipe(takeUntil(this.unsubscribe$)).subscribe((user:any)=>{
        this.formStores.patchValue({
          FOREIGN_KEY: user[0].FOREIGN_KEY,
          PRIMARY_KEY: user[0].PRIMARY_KEY,
          imageDisplay: user[0].storeImageUrl,
          imageNew: user[0].storeImageUrl,
          storeImagePath: user[0].storeImagePath,
          storeImageUrl: user[0].storeImageUrl,
          storeAbout: user[0].storeAbout,
          storeCategory: user[0].storeCategory,
          storeCellPhone: user[0].storeCellPhone,
          storeCity: user[0].storeCity,
          storeDeliveryEstimate: user[0].storeDeliveryEstimate,
          storeEmail: user[0].storeEmail,
          storeHours: user[0].storeHours,
          storeName: user[0].storeName,
          storeNeighborhood: user[0].storeNeighborhood,
          storeRating: user[0].storeRating,
          follow: user[0].follow,
          storeStreet: user[0].storeStreet,
          storeTelephone: user[0].storeTelephone,
        })
      })

      this.comercioSobreService.getByFOREIGN_KEY('product', res.uid).pipe(takeUntil(this.unsubscribe$)).subscribe((user:any)=>{
        this.quantityOfProducts = user.length;
        this.quantiyOfSales = this.TotalQuantiyOfSales(user)
      })

    })
  }

  public TotalQuantiyOfSales(sales){
    return sales.reduce( (sum, item:any)=>{
      return new Number(sum).valueOf() + new Number(item.sale).valueOf()
    },0)
  }

  public historyNavigateBack(){
    window.history.back();
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
