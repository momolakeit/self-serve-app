import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { KitchenService } from 'src/app/services/kitchen.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-restaurent-dish-detail-view',
  templateUrl: './restaurent-dish-detail-view.component.html',
  styleUrls: ['./restaurent-dish-detail-view.component.css']
})
export class RestaurentDishDetailViewComponent implements OnInit {

  @Input() orderItem: OrderItemDTO;
  @Output() countChanged: EventEmitter<number> = new EventEmitter();
  constructor(private kitchenService: KitchenService) { }
  nombreDeMinuteRequis = 30;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;
  isReady = false
  imgUrl: string;
  ngOnInit(): void {
    console.log(this.isReady);
    this.imgUrl = environment.baseImgPath;
    var today = new Date();
    console.log(today.getTime());
    console.log(this.nombreDeMinuteRequis);
    localStorage.setItem(this.orderItem.id.toString(),Math.round((Date.parse(this.orderItem.tempsDePreparation.toString())-today.getTime())/60000).toString());
    this.nombreDeMinuteRequis = this.orderItem.product.tempsDePreparation;
    if(localStorage.getItem(this.orderItem.id.toString())==null){
      console.log(Math.round((Date.parse(this.orderItem.tempsDePreparation.toString())-today.getTime())/60000).toString())
      this.nombreDeMinuteRequis = parseInt(localStorage.getItem(this.orderItem.id.toString()));
      console.log(this.nombreDeMinuteRequis);
     // localStorage.setItem(this.orderItem.id.toString(),this.nombreDeMinuteRequis.toString());
    }
    this.setUpTimeout();
    this.changeOrderStatus();
  }
  setUpTimeout = function (): void {
    var source = timer(1000, 1000).subscribe(val => {
      if (parseInt(localStorage.getItem(this.orderItem.id.toString())) == 0) {
        this.nombreDeMinutesSur100 =0;
        this.nombreDeMinuteRestant =0;
        source.unsubscribe();
      }
      else {
        this.nombreDeMinuteRestant =  parseInt(localStorage.getItem(this.orderItem.id.toString()));
        this.nombreDeMinuteRestant = this.nombreDeMinuteRestant - 1;
        this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
        localStorage.setItem(this.orderItem.id.toString(),this.nombreDeMinuteRestant.toString());
      }
    });
  
  }
  addTime = function (): void {
    this.nombreDeMinuteRestant =  parseInt(localStorage.getItem(this.orderItem.id.toString()));
    this.kitchenService.postMoreTimeForOrder(this.orderItem,5).subscribe();
    if (this.nombreDeMinuteRestant >= this.nombreDeMinuteRequis) {
      this.nombreDeMinuteRestant = this.nombreDeMinuteRequis;
    }
    else {
      this.nombreDeMinuteRestant = this.nombreDeMinuteRestant + 5;
    }
    localStorage.setItem(this.orderItem.id.toString(),this.nombreDeMinuteRestant.toString());
  }
  terminerCommande = function (orderItem: OrderItemDTO): void {
    console.log(this.kitchenService);
    this.nombreDeMinutesSur100++;
    this.kitchenService.setOrderItemReady(orderItem).subscribe(data => {
      this.orderItem = data;
      console.log("emit")
      this.countChanged.emit(this.nombreDeMinutesSur100);
      this.changeOrderStatus();
    });
  }
  changeOrderStatus = function (): void {
    if (this.orderItem.orderStatus == "READY") {
      console.log(this.orderItem.orderStatus);
      console.log(this.isReady);
      this.isReady = false;
    }
    if (this.orderItem.orderStatus == "PROGRESS") {
      this.isReady = true;
    }
  }

}
