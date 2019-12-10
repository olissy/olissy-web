import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl  }  from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService  } from '../../AuthService';
import { order } from '../../interfaces';
import { ClientOrderService } from './client-order.service'

@Component({
  selector: 'app-client-order',
  templateUrl: './client-order.component.html',
  styleUrls: ['./client-order.component.css']
})

export class ClientOrderComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public PopularOrder:any = ""

  public order:order

  public token:any = ""

  public formularioMensagem: FormGroup = new FormGroup({
    'FOREIGN_KEY': new FormControl(null),
    'messageImageUrl': new FormControl(null),
    'messageName': new FormControl(null),
    'messageLastName': new FormControl(null),
    'message': new FormControl(null),
    'messageViewed': new FormControl(false),
    'messageDate': new FormControl(`${new Date()}`)
  })

  constructor(private clienteService:ClientOrderService,
              private authService: AuthService) {}

  ngOnInit() {
    this.buscarTodosPedidos()
  }

  public async buscarTodosPedidos(){
    this.authService.isLogged().pipe(takeUntil(this.unsubscribe$)).subscribe((user:any)=>{
      this.token = user
        this.clienteService.getByPedidoFOREIGN_KEY("order", this.token.uid, 'orderDate').pipe(takeUntil(this.unsubscribe$)).subscribe((order:any)=>{
          this.PopularOrder = order
        })
    })
  }

  public pedidoSelecionado(order){
    console.log(order)
    this.order = order
    this.atualizarformularioMensagem(order)
    this.marcarMensagemComoVisualizada()
  }

  public SomarQuantidadeProduto(){
    return this.order.product.reduce((a, b) => a + (b['quantities'] || 0), 0);
  }

  public macarComoFinalizado(){
    this.clienteService.update('order',this.order.PRIMARY_KEY, {orderState: 'Finalizado'})
  }

  public RemoverPedido(){
    this.clienteService.update('order',this.order.PRIMARY_KEY, {orderState: 'Desistência'})
  }

  public enviarMensagem(){
    let menssage = this.formularioMensagem.value
    if(menssage.message === null || menssage.message === "" || menssage.message.trim() === ""){
      this.formularioMensagem.reset()
    }else{
      this.clienteService.enviarMensagemNoPedido('order', this.order.PRIMARY_KEY,  menssage ).then(a=>{
        this.formularioMensagem.reset()
      })
    }
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
    this.clienteService.marcarMensagemComoVisualizadaComercio('order', this.order.PRIMARY_KEY, {'message':newMensagens} )
  }

  public atualizarformularioMensagem(message){
    console.log(message)
   this.formularioMensagem.patchValue({
      FOREIGN_KEY: message.FOREIGN_KEY_CLIENT,
      messageImageUrl:message.clientImageUrl,
      messageName: message.clientName,
      messageLastName: message.clientLastName,
      messageViewed: false,
      messageDate: `${new Date()}`
    })
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
