import { Component, Input, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-restaurent-dish-detail-view',
  templateUrl: './restaurent-dish-detail-view.component.html',
  styleUrls: ['./restaurent-dish-detail-view.component.css']
})
export class RestaurentDishDetailViewComponent implements OnInit {

  @Input () orderItem:OrderItemDTO;
  constructor() { }
  nombreDeMinuteRequis =30;
  nombreDeMinuteRestant =30;
  nombreDeMinutesSur100 =100;
  imgUrl: string;
  ngOnInit(): void {
    console.log(this.orderItem);
    this.imgUrl = environment.baseImgPath;
    this.setUpTimeout();
  }
  setUpTimeout = function(): void{
    const source = timer(1000,1000);
    source.subscribe(val=>{this.nombreDeMinuteRestant=this.nombreDeMinuteRestant -1;
                           this.nombreDeMinutesSur100 =(this.nombreDeMinuteRestant *100 ) /this.nombreDeMinuteRequis ;
                          });
  }
  addTime = function (): void{
    this.nombreDeMinuteRestant= this.nombreDeMinuteRestant +5;
  }
}
