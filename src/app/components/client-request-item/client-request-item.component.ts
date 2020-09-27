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

  @Input() orderItemDTO: OrderItemDTO
  @Output() orderItemDetailChanged: EventEmitter<OrderItemDTO> = new EventEmitter();
  constructor(private billService: BillService) { }
  nombreDeMinuteRequis = 30;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;

  ngOnInit(): void {
    console.log(this.orderItemDTO)
    this.setUpTimeout();
  }

  setUpTimeout = function (): void {
    var today = new Date();
    console.log(this.orderItemDTO);
    this.nombreDeMinuteRestant = Math.round((Date.parse(this.orderItemDTO.tempsDePreparation.toString()) - today.getTime()) / 60000);
    this.nombreDeMinuteRestant = this.nombreDeMinuteRestant - 1;
    this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
    localStorage.setItem(this.orderItemDTO.id.toString(), this.nombreDeMinuteRestant.toString());
  }
  sendOrderItemToDetail = function (): void {
    this.orderItemDetailChanged.emit(this.orderItemDTO);
  }

}
