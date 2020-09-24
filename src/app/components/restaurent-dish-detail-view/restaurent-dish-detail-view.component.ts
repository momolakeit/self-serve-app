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
  nombreDeMinuteRestant = 30;
  nombreDeMinutesSur100 = 100;
  isReady = false
  imgUrl: string;
  ngOnInit(): void {
    console.log(this.isReady);
    this.imgUrl = environment.baseImgPath;
    this.setUpTimeout();
    this.changeOrderStatus();
  }
  setUpTimeout = function (): void {
    var source = timer(1000, 1000).subscribe(val => {
      if (this.nombreDeMinuteRestant == 0) {
        source.unsubscribe();
      }
      else {
        this.nombreDeMinuteRestant = this.nombreDeMinuteRestant - 1;
        this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
      }
    });
  
  }
  addTime = function (): void {
    console.log(this.nombreDeMinuteRestant);
    console.log(this.nombreDeMinuteRequis);
    if (this.nombreDeMinuteRestant >= this.nombreDeMinuteRequis) {
      this.nombreDeMinuteRestant = this.nombreDeMinuteRequis;
    }
    else {
      this.nombreDeMinuteRestant = this.nombreDeMinuteRestant + 5;
    }
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
