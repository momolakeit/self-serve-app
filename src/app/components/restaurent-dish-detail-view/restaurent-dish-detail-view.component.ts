import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { OrderStatus } from 'src/app/models/order-status.enum';
import { KitchenService } from 'src/app/services/kitchen.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-restaurent-dish-detail-view',
  templateUrl: './restaurent-dish-detail-view.component.html',
  styleUrls: ['./restaurent-dish-detail-view.component.css']
})
export class RestaurentDishDetailViewComponent implements OnInit {

  @Input() orderItem: OrderItemDTO;
  @Output() countChanged: EventEmitter<number> = new EventEmitter();
  nombreDeMinuteRequis: number = 0;
  nombreDeMinuteRestant: number = 0;
  nombreDeMinutesSur100: number = 100;
  isReady: boolean = false
  imgUrl: string;

  constructor(private kitchenService: KitchenService, private authService: AuthService) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath;
    var today = new Date();
    this.nombreDeMinuteRequis = this.orderItem.product.tempsDePreparation;
    this.nombreDeMinuteRestant = Math.round((Date.parse(this.orderItem.tempsDePreparation.toString()) - today.getTime()) / 60000);
    if (this.nombreDeMinuteRestant > 0) {
      this.setUpProgressbar();
    }
    else {
      this.nombreDeMinuteRestant = 0;
      this.nombreDeMinutesSur100 = 0;
    }
  }

  setUpProgressbar() {
    this.nombreDeMinuteRestant -= 1;
    this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
  }

  handleTime() {
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

  addTime() {
    const minAdded = 5;
    this.kitchenService.postMoreTimeForOrder(this.orderItem, minAdded).subscribe();
    this.nombreDeMinuteRestant += minAdded;
    this.setUpProgressbar();
  }

  terminerCommande(orderItem: OrderItemDTO) {
    this.nombreDeMinutesSur100++;
    if (this.authService.isWaiter()) {
      orderItem.orderStatus = OrderStatus.COMPLETED;
    }
    else {
      orderItem.orderStatus = OrderStatus.READY;
    }
    this.kitchenService.updateOrderItem(orderItem).subscribe();
    this.countChanged.emit(this.nombreDeMinutesSur100);

  }

}
