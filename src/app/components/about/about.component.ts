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
      { name: 'keywords', content: 'olissy, Sebre Olissy Delivery'},
      { name: 'robots', content: 'index, follow' },
      { charset: 'UTF-8' }
    ]);
    this.titleService.setTitle('Sobre Olissy Delivery');
    this.metaTagService.updateTag(
      { name: 'description', content: 'A olissy trata-se de uma Marketplace local de compras e vendas de produtos. No ambiente online isso se traduz em um espaço virtual onde a farmacia empresa permite que outros lojistas anunciem seus produtos e serviços através da plataforma da olissy.' }
    );
  }

}
