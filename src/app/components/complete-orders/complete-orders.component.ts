import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormControl, Validators }  from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from '../../app.service'
import { AuthService  } from '../../AuthService';
import { CompleteOrdersService  } from './complete-orders.service';
declare var $ :any;


@Component({
  selector: 'app-complete-orders',
  templateUrl: './complete-orders.component.html',
  styleUrls: ['./complete-orders.component.css']
})
export class CompleteOrdersComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public produtos:any[] = []

  public ID:any = ""

  public comercio_FOREIGN_KEY = 0

  private newContact = {
    PRIMARY_KEY : "",

    FOREIGN_KEY_CLIENT : "",
    photoClient : "",
    nameClient : "",
    viewClient : true,

    FOREIGN_KEY_STORE : "",
    nameStore : "",
    photoStore : "",
    viewStore : false,

    message:[{
      FOREIGN_KEY:"",
      data:"",
      text:"",
      name:"",
      photo:"",
      view:false
      }
    ]
  }

  public FormaPagamento = [
    "Dinheiro",
    "Cartão de Crédito",
    "Cartão de Débito"
  ]

  public cellPhoneMask: any = {
    mask: '(00) 0 0000-0000',
    lazy: false
  };

  public data = new Date();

  public formularioPedido: FormGroup = new FormGroup({
    "PRIMARY_KEY": new FormControl(null),
    "FOREIGN_KEY_STORE": new FormControl(null),
    "FOREIGN_KEY_CLIENT":new FormControl(null),
    "storeViewedTheOrder": new FormControl(false),
    "storeImageUrl": new FormControl(null),
    "storeName": new FormControl(null),
    "storeNeighborhood": new FormControl(null),
    "storeStreet": new FormControl(null),
    "storeCellPhone": new FormControl(null),
    "storeCity": new FormControl(null),
    "storeCNPJ": new FormControl(null),
    "storeEmail": new FormControl(null),
    "storeHours": new FormControl(null),
    "storeDeliveryEstimate": new FormControl(null),
    "clientAddressFull": new FormControl(null, Validators.required),
    "clientCellPhone": new FormControl(null, Validators.required),
    "clientMethodPayment": new FormControl(null, Validators.required),
    'clientImageUrl':new FormControl(null),
    "clientName": new FormControl(null),
    "clientLastName": new FormControl(null),
    "clientCity": new FormControl(null),
    "clientNeighborhood": new FormControl(null),
    "clientStreet": new FormControl(null),
    "clientEmail": new FormControl(null),
    "taxing": new FormControl('0.25'),
    "totalOrderValue": new FormControl(null),
    "orderDate": new FormControl(`${new Date()}`),
    "orderState": new FormControl("Enviado"),
    "message": new FormControl(null),
  })

  constructor(private Appservice: AppService,
              private pedidoService:CompleteOrdersService,
              private router_navigator: Router,
              private route:ActivatedRoute,
              private authService: AuthService) {}

  ngOnInit() {
    this.scrollToTop()
    this.returnOrderNull()
    this.authToken()
    this.setIdComercioPedido()
    this.popularProdutos()
    this.setImagePathEndNameFormulario()
    this.popularformularioPedidoCliente()
    this.popularformularioPedidoMensagemMensagem()
    this.popularformularioPedidoAdcional()
    this.autoFocus()
  }

  public scrollToTop(){
    $('html, body').animate({scrollTop:0}, 'slow');
  }

  public async authToken(){
    this.authService.isLogged().subscribe((res:any)=>{
      if(res != null){
        this.ID = res.uid
      }
    })
  }

  public returnOrderNull(){
    if(this.Appservice.produtos.length == 0){
      this.router_navigator.navigate([`/store-page/${this.route.snapshot.params['id']}`])
    }
  }

  public historyNavigateBack(){
    window.history.back();
  }

  public setIdComercioPedido(){
    this.formularioPedido.patchValue({
      FOREIGN_KEY_STORE : this.route.snapshot.params['id']
    })
  }

  public popularProdutos(){
    this.produtos = this.Appservice.produtos
  }

  public popularformularioPedidoCliente(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((res:any)=>{
      if(res != null){
        this.pedidoService.getByFOREIGN_KEY('client', res.uid).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
          this.formularioPedido.patchValue({
            clientImageUrl:resposta[0].clientImageUrl,
            FOREIGN_KEY_CLIENT: resposta[0].FOREIGN_KEY,
            clientName: resposta[0].clientName,
            clientLastName: resposta[0].clientLastName,
            clientCity: resposta[0].clientCity,
            clientNeighborhood: resposta[0].clientNeighborhood,
            clientStreet: resposta[0].clientStreet,
            clientEmail: resposta[0].clientEmail,
          })
        })
      }
    })
  }

  public popularformularioPedidoAdcional(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((res:any)=>{
      if(res != null){
        this.pedidoService.getPedido().pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
          if(Object.keys(resposta).length != 0){
            this.formularioPedido.patchValue({
              clientAddressFull: resposta.clientAddressFull,
              clientCellPhone: resposta.clientCellPhone,
              clientMethodPayment: resposta.clientMethodPayment
            })
          }
        })
      }
    })
  }

  public popularformularioPedidoMensagemMensagem(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((res:any)=>{
      if(res != null){
        this.pedidoService.getPedido().pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
          if(resposta != ""){
            if(Object.keys(resposta.message).length != 0){
              this.formularioPedido.patchValue({
                message: resposta.message
              })
            }
          }
        })
      }
    })
  }

  public setImagePathEndNameFormulario(){
    this.pedidoService.getByFOREIGN_KEY('store', this.route.snapshot.params['id']).pipe(takeUntil(this.unsubscribe$)).subscribe((resposta:any)=>{
      this.formularioPedido.patchValue({
        storeImageUrl: resposta[0].storeImageUrl,
        storeName : resposta[0].storeName,
        storeNeighborhood : resposta[0].storeNeighborhood,
        storeStreet : resposta[0].storeStreet,
        storeCellPhone : resposta[0].storeCellPhone,
        storeCity : resposta[0].storeCity,
        storeCNPJ : resposta[0].storeCNPJ,
        storeEmail : resposta[0].storeEmail,
        storeHours : resposta[0].storeHours,
        storeDeliveryEstimate : resposta[0].storeDeliveryEstimate
      })
    })
  }

  public TotalValorDoPedido(){
    return this.produtos.reduce( (sum, item:any)=>{
      return new Number(sum).valueOf() + new Number(item.productPrice).valueOf() 
    },0) + new Number(this.formularioPedido.get('taxing').value)
  }

  public removerItem(indice){
     this.Appservice.produtos.splice(indice,1)
     this.returnOrderNull()
  }

  public aumentartem(item:any){
    let foundItem = this.Appservice.produtos.find( (items)=> items.productName ===  item.productName)
      if( item.quantities < item.productQuantities ){
        foundItem.quantities++;
        foundItem.productPrice = foundItem.productPriceOrigin * foundItem.quantities;
      }
  }

  public diminuirItem(item:any){
    let foundItem = this.Appservice.produtos.find( (items)=> items.productName ===  item.productName)
    if(foundItem.quantities == 1){

    }else{
      foundItem.quantities = foundItem.quantities - 1
      foundItem.productPrice = foundItem.productPrice - foundItem.productPriceOrigin
    }
  }

  public autoFocus(){
    document.getElementById("clientAddressFull").focus();
  }

  public concluirPedido(){
    this.formularioPedido.get('clientAddressFull').markAsTouched()
    this.formularioPedido.get('clientCellPhone').markAsTouched()
    this.formularioPedido.get('clientMethodPayment').markAsTouched()

    if( this.formularioPedido.get('clientAddressFull').valid == false ){
      document.getElementById("clientAddressFull").focus();
    }
    if( this.formularioPedido.get('clientCellPhone').valid == false ){
      document.getElementById("clientCellPhone").focus();
    }
    if( this.formularioPedido.get('clientMethodPayment').valid == false ){
      document.getElementById("clientMethodPayment").focus();
    }

    if(this.formularioPedido.valid){
      if(this.ID){
        if(this.formularioPedido.get('message').value != null && this.formularioPedido.get('message').value != ""){
          this.startOrderEndSendMensage(this.formularioPedido.get('FOREIGN_KEY_STORE').value, this.formularioPedido.get('message').value)
        }else{
          this.cadastraPedido()
        }
      }else{
        this.GuaradarPedido_LogarUsuarioParaParaCadastrarPedido()
      }
    }else{
      console.log("formulario invalido")
    }
  }

  public cadastraPedido(){
    let pedido:any = []
    let FOREIGN_KEY_STORE = this.formularioPedido.get('FOREIGN_KEY_STORE').value
    pedido = this.formularioPedido.value
    pedido.product = this.produtos
    pedido.totalOrderValue = this.TotalValorDoPedido()

    for (const key of pedido.product) {
      this.pedidoService.decrementProductQuantities(key.PRIMARY_KEY, key.quantities)
    }

    this.pedidoService.criarPedido("order", pedido).then((res:any)=>{
      this.Appservice.pedido = []
      this.formularioPedido.reset
      this.produtos = []
      this.Appservice.produtos = []
    }) 
    
    this.router_navigator.navigate([`/evaluate-store/${FOREIGN_KEY_STORE}`])
    
  }

  public GuaradarPedido_LogarUsuarioParaParaCadastrarPedido(){
    let pedido:any = []
        pedido = this.formularioPedido.value
        pedido.product = this.produtos
        pedido.totalOrderValue = this.TotalValorDoPedido()

    this.pedidoService.setPedido(pedido).pipe(takeUntil(this.unsubscribe$)).subscribe(retorno=>{
      if(retorno){
        this.router_navigator.navigate(['/login'])
      }
    })
  }

  public startOrderEndSendMensage(FOREIGN_KEY_STORE, message){
    this.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe( (isLogged:any)=>{
      if(isLogged === null){}else{
        let FOREIGN_KEY_CLIENT = isLogged.uid
        this.newContact.message[0].text = message
        let asyncExistContactStoreEndClient:boolean = true
        this.pedidoService.existContactStoreEndClient(FOREIGN_KEY_CLIENT, FOREIGN_KEY_STORE).pipe(takeUntil(this.unsubscribe$)).subscribe( (existContact:any)=>{
          if(Object.keys(existContact).length == 0){
             asyncExistContactStoreEndClient = false
            this.getStoreClientOrder(FOREIGN_KEY_CLIENT, FOREIGN_KEY_STORE)
          }
          if(Object.keys(existContact).length != 0 && asyncExistContactStoreEndClient == true){
            asyncExistContactStoreEndClient = false
            this.getClientOrder(FOREIGN_KEY_CLIENT, existContact[0].PRIMARY_KEY)
          }
        }) 
      }
    })
  }

  public getStoreClientOrder(FOREIGN_KEY_CLIENT, FOREIGN_KEY_STORE){
    this.pedidoService.getByFOREIGN_KEY("client", FOREIGN_KEY_CLIENT).pipe(takeUntil(this.unsubscribe$)).subscribe( (client:any)=>{
      this.newContact.FOREIGN_KEY_CLIENT = client[0].FOREIGN_KEY
      this.newContact.nameClient = client[0].clientName +" "+ client[0].clientLastName
      this.newContact.photoClient = client[0].clientImageUrl
      this.pedidoService.getByFOREIGN_KEY("store", FOREIGN_KEY_STORE).pipe(takeUntil(this.unsubscribe$)).subscribe( (store:any)=>{
        this.newContact.FOREIGN_KEY_STORE = store[0].FOREIGN_KEY
        this.newContact.nameStore = store[0].storeName
        this.newContact.photoStore = store[0].storeImageUrl
        this.newContact.message[0].FOREIGN_KEY = client[0].FOREIGN_KEY
        this.newContact.message[0].data = `${new Date()}`,
        this.newContact.message[0].name = client[0].clientName +" "+ client[0].clientLastName
        this.newContact.message[0].photo = client[0].clientImageUrl
        this.newContact.message[0].view = false
        this.pedidoService.criarContactInOrder(this.newContact).then((res:any)=>{
          this.pedidoService.update("contact", res.id, {PRIMARY_KEY : res.id}).then(()=>{
            this.cadastraPedido()
          })
        })
      })
    }) 
  }

  public getClientOrder(FOREIGN_KEY_CLIENT, PRIMARY_KEY){
    this.pedidoService.getByFOREIGN_KEY("client",  FOREIGN_KEY_CLIENT).pipe(takeUntil(this.unsubscribe$)).subscribe( (client:any)=>{
      this.newContact.message[0].FOREIGN_KEY = client[0].FOREIGN_KEY
      this.newContact.message[0].data = `${new Date()}`,
      this.newContact.message[0].name = client[0].clientName +" "+ client[0].clientLastName
      this.newContact.message[0].photo = client[0].clientImageUrl
      this.newContact.message[0].view = false
      console.log(typeof PRIMARY_KEY.trim() === 'string' && PRIMARY_KEY.length > 1,PRIMARY_KEY)
      if(typeof PRIMARY_KEY.trim() === 'string' && PRIMARY_KEY.length > 1){
        this.pedidoService.sendMessage(PRIMARY_KEY, this.newContact.message[0]).then(()=>{
          this.pedidoService.markMessageHowViewed(PRIMARY_KEY).then(()=>{
            this.cadastraPedido()
          })
        })
      }
    })
  }

  public isLogged() {
    return  this.authService.isLogged()
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

