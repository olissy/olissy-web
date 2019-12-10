import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators  }  from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../AuthService'
import { ClientOpenYourStoreService } from './client-open-your-store.service'

@Component({
  selector: 'app-client-open-your-store',
  templateUrl: './client-open-your-store.component.html',
  styleUrls: ['./client-open-your-store.component.css']
})

export class ClientOpenYourStoreComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public loading:boolean = false

  public categorias = [];

  public PRIMARY_KEY_USUARIO:string = ""

  public avatar = "/assets/plataform/avatar.png"

  public phoneMask: any = {
    mask: '(00) 0000-0000',
    lazy: false
  };

  public cellPhoneMask: any = {
    mask: '(00) 0 0000-0000',
    lazy: false
  };

  public cnpjMask: any = {
    mask: '00.000.000/0000-00',
    lazy: false
  };

  public formularioAbrirMinhaLoja: FormGroup = new FormGroup({
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
    'storeCategory':new FormControl('farmacia',Validators.required),
    'storeAbout':new FormControl(null,Validators.required),
    'storeCity':new FormControl(null,Validators.required),
    'storeNeighborhood':new FormControl(null,Validators.required),
    'storeStreet':new FormControl(null,Validators.required),
    'storeCellPhone':new FormControl(null,Validators.required),
    'storeEmail':new FormControl(null),
    'storeTelephone':new FormControl(null,Validators.required),
    'storeCNPJ':new FormControl(null,Validators.required),
    'authorizationOpenStore':new FormControl(false,Validators.required),
    'storeOpenOrClosed':new FormControl(true,Validators.required),
  })

  constructor(private authService:AuthService,
              private abrirSuaLojaService:ClientOpenYourStoreService,
              private router_navigator: Router) { }

  ngOnInit() {

    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((res:any)=>{
      this.abrirSuaLojaService.getByFOREIGN_KEY('user', res.uid).pipe(takeUntil(this.unsubscribe$)).subscribe((user:any)=>{
        this.PRIMARY_KEY_USUARIO = user[0].PRIMARY_KEY
      })
    })

    this.formularioAbrirMinhaLoja.patchValue({
      imageDisplay:this.avatar,
    })

    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((res:any)=>{
      this.abrirSuaLojaService.getByFOREIGN_KEY('store', res.uid).pipe(takeUntil(this.unsubscribe$)).subscribe((store:any)=>{
        if(!store[0].PRIMARY_KEY){
          this.setIdDocInformularioCliente(res.uid, res.email)
        }else{
          this.formularioAbrirMinhaLoja.patchValue({
            FOREIGN_KEY:store[0].FOREIGN_KEY,
            PRIMARY_KEY:store[0].PRIMARY_KEY,
            storeImagePath:`user/${store[0].PRIMARY_KEY}.jpg`,
            storeEmail: store[0].storeEmail
          })
        }
      })
    })

  }

  public setIdDocInformularioCliente(FOREIGN_KEY, EMAIL){
    this.abrirSuaLojaService.getIdDocByFOREIGN_KEY("store", FOREIGN_KEY).get().pipe(takeUntil(this.unsubscribe$)).subscribe( (res)=> {
     let PRIMARY_KEY = ""
      res.forEach(function (doc) {
        //console.log(doc.id, ' => ', doc.data());
        PRIMARY_KEY = doc.id
      });
      this.formularioAbrirMinhaLoja.patchValue({
        PRIMARY_KEY:PRIMARY_KEY,
        FOREIGN_KEY:FOREIGN_KEY,
        storeImagePath:`user/${PRIMARY_KEY}.jpg`,
        storeEmail: EMAIL
      })
    })
  }

  public abrirMinhaLoja(){
    this.loading = true
    this.formularioAbrirMinhaLoja.get('imageNew').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeHours').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeName').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeDeliveryEstimate').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeCategory').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeAbout').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeCity').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeNeighborhood').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeStreet').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeCellPhone').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeEmail').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeAbout').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeTelephone').markAsTouched()
    this.formularioAbrirMinhaLoja.get('storeCNPJ').markAsTouched()
    console.log( this.formularioAbrirMinhaLoja.value )
    if(this.formularioAbrirMinhaLoja.status === "VALID"){
      this.abrirSuaLojaService.setImagemStorage(this.formularioAbrirMinhaLoja.get('storeImagePath').value, this.formularioAbrirMinhaLoja.get('imageNew').value).then(async (url:any)=>{
        let storeImageUrl = await url
        this.formularioAbrirMinhaLoja.patchValue({
          storeImageUrl: storeImageUrl,
        })
        this.abrirSuaLojaService.cadastrarLoja(this.formularioAbrirMinhaLoja.value, this.formularioAbrirMinhaLoja.get('PRIMARY_KEY').value, this.PRIMARY_KEY_USUARIO).then((cadastro:any)=>{
          this.router_navigator.navigate(['/store-product-registration']);
        })
      }) 
    }else{
      this.loading = false
    }
  }


  public uploadFileImagem(event: Event){
    this.FileImagem(event)
  }

  public FileImagem(event: Event){
    var file = (<HTMLInputElement>event.target).files[0]
    if ((<HTMLInputElement>event.target).files[0] && (<HTMLInputElement>event.target)) {
      var reader = new FileReader();
      reader.onload = ()=> {
        this.formularioAbrirMinhaLoja.patchValue({
          imageDisplay:reader.result,
          imageNew: file
        })
      }
      reader.readAsDataURL((<HTMLInputElement>event.target).files[0]);
    }
  }

  public uploadFile(event: Event, FORM:number = 0){
    var file = (<HTMLInputElement>event.target).files[0]
    if(file){
      this.ImageBase64Reduse(file, 100, 100, FORM).then(blob => {
        URL.createObjectURL(blob);
      }, err => {
        console.error("Photo error", err);
      });
    }
  }

  public ImageBase64Reduse(FILE:File, MAX_WIDTH:number, MAX_HEIGHT:number, FORM:number) :Promise<Blob> {
    return new Promise((resolve, reject) => {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var maxW = MAX_WIDTH;
      var maxH = MAX_HEIGHT;
      var img = new Image();
          img.src = URL.createObjectURL(FILE)

      img.onload = ()=> {
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW / iw), (maxH / ih));
        var iwScaled = iw * scale;
        var ihScaled = ih * scale;

        canvas.width = iwScaled;
        canvas.height = ihScaled;
        context.drawImage(img, 0, 0, iwScaled, ihScaled);

        var Base64 = canvas.toDataURL("image/png", 1.0)
        var block = Base64.split(";");
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];

        this.b64toBlob(realData, contentType, Base64, FORM)
      }
    });
  }

  public b64toBlob(b64Data, contentType, Base64, FORM:number) {
    contentType = contentType || '';
    let sliceSize =  50;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    this.formularioAbrirMinhaLoja.patchValue({
      imageDisplay:Base64,
      imageNew: blob
    })
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

