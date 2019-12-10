import { Component, OnInit } from '@angular/core';
import { StoreOrderService } from './store-order.service'
import { FormGroup, FormControl  }  from '@angular/forms';
import { AuthService  } from '../../AuthService';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-store-order',
  templateUrl: './store-order.component.html',
  styleUrls: ['./store-order.component.css']
})
export class StoreOrderComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public PopularOrder:any = ""

  public order;

  public token:any = ""

  public iconeOrder:string = "/assets/plataform/cart.png"

  public formularioMensagem: FormGroup = new FormGroup({
    'FOREIGN_KEY': new FormControl(null),
    'messageImageUrl': new FormControl(null),
    'messageName': new FormControl(null),
    'messageLastName': new FormControl(null),
    'message': new FormControl(null),
    'messageViewed': new FormControl(false),
    'messageDate': new FormControl(`${new Date()}`)
  })

  constructor(private comercioService:StoreOrderService,
              private authService: AuthService) {}

  ngOnInit() {
    this.buscarTodosPedidos()
  }

  public async buscarTodosPedidos(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((user:any)=>{
      this.token = user
      this.comercioService.getOrderByFOREIGN_KEY("order", this.token.uid).pipe(takeUntil(this.unsubscribe$)).subscribe((order:any)=>{
        this.PopularOrder = order
      })
    })
  }

  public pedidoSelecionado(order){
    this.order = order
    this.atualizarformularioMensagem(order)
    this.marcarMensagemComoVisualizada()
    this.macarComoVisto()
  }

  public SomarQuantidadeProduto(){
    return this.order.product.reduce((a, b) => a + (b['quantities'] || 0), 0);
  }

  public macarComoVisto(){
    if(this.order.storeViewedTheOrder == false){
      this.comercioService.update('order',this.order.PRIMARY_KEY, {storeViewedTheOrder: true})
    }
  }

  public macarComoEmProcessamento(){
    this.comercioService.update('order',this.order.PRIMARY_KEY, {orderState: 'Em processamento'})
  }

  public macarComoFinalizado(){
    this.comercioService.update('order',this.order.PRIMARY_KEY, {orderState: 'Finalizado'})
  }

  public macarComoEntregar(){
    this.comercioService.update('order',this.order.PRIMARY_KEY, {orderState: 'Entregando'})
  }

  public async RemoverPedido(order){
    if(order.orderState == 'Desistência'){
      this.comercioService.deleterCollectionStorage('order', this.order.PRIMARY_KEY)
    }
    if(order.orderState == 'Finalizado'){
      delete this.order.message
      delete this.order.storeViewedTheOrder
      await this.salesIncrement().then(()=>{
        this.comercioService.createInvoice(this.order).then(()=>{
        this.comercioService.deleterCollectionStorage('order', this.order.PRIMARY_KEY)
        })
      })
    }
  }

  public async salesIncrement(){
    this.order.product.forEach((element:any) => {
      for (let i = 0; i < element.quantities; i++) {
        this.comercioService.updateSales(element.PRIMARY_KEY )
        console.log( this.order.FOREIGN_KEY_CLIENT, element.PRIMARY_KEY)
        this.comercioService.getReactionsProduct(this.order.FOREIGN_KEY_CLIENT, element.PRIMARY_KEY).subscribe((res:any)=>{
          if(res[0].clientReactionsSale == false){
            this.macarComoComprado(res[0].PRIMARY_KEY)
          }
        })
      }
    })
  }

  public macarComoComprado(PRIMARY_KEY){
    this.comercioService.update('reactionsProduct', PRIMARY_KEY, {clientReactionsSale: true})
  }

  public enviarMensagem(){

    let menssage = this.formularioMensagem.value
    console.log(menssage, this.order.PRIMARY_KEY)
    if(menssage.message === null || menssage.message === "" || menssage.message.trim() === ""){
      this.formularioMensagem.reset()
    }else{
      this.comercioService.enviarMensagemNoPedido('order', this.order.PRIMARY_KEY,  menssage ).then(a=>{
        this.formularioMensagem.reset()
      })
    }
  }

  public atualizarformularioMensagem(message){
    this.formularioMensagem.patchValue({
      FOREIGN_KEY: message.FOREIGN_KEY_STORE,
      messageImageUrl:message.storeImageUrl,
      messageName: message.storeName,
      messageLastName: '',
      messageViewed: false,
      messageDate: `${new Date()}`
    })
  }

  public marcarMensagemComoVisualizada(){
    let newMensagens = []
    for (const m of this.order.message){
      if(m.FOREIGN_KEY != this.token.uid && m.messageViewed == false){
        m.messageViewed = true
        newMensagens.push(m)
      }else{
        newMensagens.push(m)
      }
    }
    this.comercioService.marcarMensagemComoVisualizadaComercio('order', this.order.PRIMARY_KEY, {'message':newMensagens} )
  }

  public formatDataOrderList(d){
    let data = new Date(d);
    let my = data.toLocaleString([], { hour12: true});
    //let my = data.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true});
    return my
  }

  public formatHours(d){
    let data = new Date(d);
    let my = data.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true});
    return my
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}