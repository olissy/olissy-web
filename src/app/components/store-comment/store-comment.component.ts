import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { StoreCommentService } from './store-comment.service'

@Component({
  selector: 'app-store-comment',
  templateUrl: './store-comment.component.html',
  styleUrls: ['./store-comment.component.css']
})

export class StoreCommentComponent implements OnInit, OnDestroy {

  public comentarios = []

  private unsubscribe$ = new Subject();

  public loading:boolean = true

  public LIMIT:number = 10

  constructor(private comentarioService: StoreCommentService,
              private route:ActivatedRoute) {}

  ngOnInit() {
    this.comentarioService.getReviewsByFOREIGN_KEY(this.route.parent.snapshot.params['id'], this.LIMIT).pipe(takeUntil(this.unsubscribe$)).subscribe(comment=>{
      this.comentarios = comment
    })
  }

  public loadingPlusProduct(){
    this.loading = false
    this.comentarioService.getReviewsByFOREIGN_KEY(this.route.parent.snapshot.params['id'], (this.LIMIT++)*5).subscribe(comment=>{
      setTimeout(() => {
        this.comentarios = comment
        this.loading = true
      }, 1000);
    })
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
