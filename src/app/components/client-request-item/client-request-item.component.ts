import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderItemDTO } from '../../models/order-item-dto'
import { timer } from 'rxjs';

@Component({
  selector: 'app-client-request-item',
  templateUrl: './client-request-item.component.html',
  styleUrls: ['./client-request-item.component.css']
})
export class ClientRequestItemComponent implements OnInit {

  @Input() orderItemDTO: OrderItemDTO
  @Output() orderItemDetailChanged: EventEmitter<OrderItemDTO> = new EventEmitter();
  constructor() { }
  nombreDeMinuteRequis = 30;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;

  ngOnInit(): void {
    this.setUpTimeout();
    if (localStorage.getItem(this.orderItemDTO.id.toString()) == null) {
      localStorage.setItem(this.orderItemDTO.id.toString(), this.orderItemDTO.product.tempsDePreparation.toString());
    }
  }

  setUpTimeout = function (): void {
    var source = timer(1000, 1000).subscribe(val => {
      if (JSON.parse(localStorage.getItem(this.orderItemDTO.id.toString())) == 0) {
        this.nombreDeMinutesSur100 = 0;
        source.unsubscribe();
      }
      else {
        this.nombreDeMinuteRestant = localStorage.getItem(this.orderItemDTO.id.toString());
        this.nombreDeMinuteRestant = this.nombreDeMinuteRestant - 1;
        this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
        localStorage.setItem(this.orderItemDTO.id.toString(), this.nombreDeMinuteRestant.toString());
      }
    });
  }
  sendOrderItemToDetail = function (): void {
    this.orderItemDetailChanged.emit(this.orderItemDTO);
  }

}
