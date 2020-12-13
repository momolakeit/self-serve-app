import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { OrderStatus } from 'src/app/models/order-status.enum';
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
  nombreDeMinuteRequis = 0;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;
  isReady = false
  imgUrl: string;

  constructor(private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath;
    var today = new Date();
    console.log(this.orderItem);
    this.nombreDeMinuteRequis = this.orderItem.product.tempsDePreparation;
    this.nombreDeMinuteRestant = Math.round((Date.parse(this.orderItem.tempsDePreparation.toString()) - today.getTime()) / 60000);
    if (this.nombreDeMinuteRestant > 0) {
      this.setUpProgressbar();
    }
    else {
      this.nombreDeMinuteRestant = 0;
      this.nombreDeMinutesSur100 = 0;
    }

    this.changeOrderStatus();
  }

  setUpProgressbar() {
    this.nombreDeMinuteRestant = this.nombreDeMinuteRestant - 1;
    this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
  }

  handleTime() {
    var today = new Date();
    this.nombreDeMinuteRequis = this.orderItem.product.tempsDePreparation;
    this.setUpTimeout();
  }

  setUpTimeout = (): void => {
    var source = timer(1000, 1000).subscribe(() => {
      if (this.nombreDeMinuteRestant == 0) {
        this.nombreDeMinutesSur100 = 0;
        source.unsubscribe();
      }
      else {
        this.setUpProgressbar();
      }
    });

  }

  addTime = (): void => {
    this.kitchenService.postMoreTimeForOrder(this.orderItem, 5).subscribe();
    console.log(this.nombreDeMinuteRestant);
    this.nombreDeMinuteRestant = this.nombreDeMinuteRestant + 5;
    console.log(this.nombreDeMinuteRestant);
    this.setUpProgressbar();
  }

  terminerCommande = (orderItem: OrderItemDTO): void => {
    this.nombreDeMinutesSur100++;
    this.kitchenService.setOrderItemReady(orderItem).subscribe(data => {
      this.orderItem = data;
      this.countChanged.emit(this.nombreDeMinutesSur100);
      this.changeOrderStatus();
    });
  }

  changeOrderStatus(): void {
    if (this.orderItem.orderStatus == OrderStatus.READY) {
      console.log(this.orderItem.orderStatus);
      console.log(this.isReady);
      this.isReady = false;
    }
    if (this.orderItem.orderStatus == OrderStatus.PROGRESS) {
      this.isReady = true;
    }
  }

}
