import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private metaTagService: Meta, private titleService: Title) {}

  ngOnInit() {
    this.searchEngineOptimization()
  }

  public searchEngineOptimization(){
    this.metaTagService.addTags([
      { name: 'keywords', content: 'olissy, Sebre Olissy'},
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' }
    ]);
    this.titleService.setTitle('Sobre Olissy');
    this.metaTagService.updateTag(
      { name: 'description', content: ' Olissy trata-se de uma Marketplace, local de compras e vendas de produtos, no ambiente online, isso se traduz em um espaço virtual, aonde a olissy permite que farmácias e drogarias anunciem seus produtos e serviços através da plataforma da olissy. Assim, a olissy, é como se fosse um shopping center virtual, onde vários lojistas vendem seus produtos e serviços diretamente aos consumidores.' }
    );
  }

}
