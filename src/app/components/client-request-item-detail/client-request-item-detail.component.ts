import { Component, Input, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderItemDTO } from '../../models/order-item-dto'

@Component({
  selector: 'app-client-request-item-detail',
  templateUrl: './client-request-item-detail.component.html',
  styleUrls: ['./client-request-item-detail.component.css']
})
export class ClientRequestItemDetailComponent implements OnInit {
  @Input() orderItemDTO: OrderItemDTO
  constructor() { }
  nombreDeMinuteRequis = 30;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;
  isReady = false
  imgUrl: string;

  ngOnInit(): void {
  }
  ngOnChanges() :void {
    if (this.orderItemDTO != null) {
      this.imgUrl = environment.baseImgPath;
      console.log(this.orderItemDTO);
      console.log(environment.baseImgPath);
      if (localStorage.getItem(this.orderItemDTO.id.toString()) == null) {
        localStorage.setItem(this.orderItemDTO.id.toString(), this.nombreDeMinuteRequis.toString());
      }
      this.nombreDeMinuteRestant =JSON.parse(localStorage.getItem(this.orderItemDTO.id.toString()));
      this.setUpTimeout();
      this.changeOrderStatus();
    }
  }
  setUpTimeout = function (): void {
    var source = timer(1000, 1000).subscribe(val => {
      if (parseInt(localStorage.getItem(this.orderItemDTO.id.toString())) == 0) {
        this.nombreDeMinutesSur100 = 0;
        source.unsubscribe();
      }
      else {
        this.nombreDeMinuteRestant = parseInt(localStorage.getItem(this.orderItemDTO.id.toString()));
        this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
        localStorage.setItem(this.orderItemDTO.id.toString(), this.nombreDeMinuteRestant.toString());
      }
    });

  }
  addTime = function (): void {
    this.nombreDeMinuteRestant = parseInt(localStorage.getItem(this.orderItemDTO.id.toString()));
    if (this.nombreDeMinuteRestant >= this.nombreDeMinuteRequis) {
      this.nombreDeMinuteRestant = this.nombreDeMinuteRequis;
    }
    else {
      this.nombreDeMinuteRestant = this.nombreDeMinuteRestant + 5;
    }
    localStorage.setItem(this.orderItemDTO.id.toString(), this.nombreDeMinuteRestant.toString());
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
    if (this.orderItemDTO.orderStatus == "READY") {
      this.isReady = false;
    }
    if (this.orderItemDTO.orderStatus == "PROGRESS") {
      this.isReady = true;
    }
  }

}
