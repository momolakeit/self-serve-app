import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderItemDTO } from '../../models/order-item-dto'
import { timer } from 'rxjs';
import { BillService } from 'src/app/services/bill.service';

@Component({
  selector: 'app-client-request-item',
  templateUrl: './client-request-item.component.html',
  styleUrls: ['./client-request-item.component.css']
})
export class ClientRequestItemComponent implements OnInit {
  nombreDeMinuteRequis = 30;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;

  @Input() orderItemDTO: OrderItemDTO
  @Output() orderItemDetailChanged: EventEmitter<OrderItemDTO> = new EventEmitter();
  constructor(private billService: BillService) { }

  ngOnInit(): void {
    this.setUpTimeout();
  }

  setUpTimeout = () => {
    var today = new Date();

    this.nombreDeMinuteRequis = this.orderItemDTO.product.tempsDePreparation;
    this.nombreDeMinuteRestant = Math.round((Date.parse(this.orderItemDTO.tempsDePreparation.toString()) - today.getTime()) / 60000);

    if (this.nombreDeMinuteRestant > 0) {
      this.nombreDeMinuteRestant = this.nombreDeMinuteRestant - 1;
      this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
      localStorage.setItem(this.orderItemDTO.id.toString(), this.nombreDeMinuteRestant.toString());
    }
    else {
      this.nombreDeMinuteRestant = 0;
      this.nombreDeMinutesSur100 = 0;
    }

  }
  sendOrderItemToDetail = () => {
    this.orderItemDetailChanged.emit(this.orderItemDTO);
  }

}
