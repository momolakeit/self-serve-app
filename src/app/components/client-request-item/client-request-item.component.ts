import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderItemDTO } from '../../models/order-item-dto'
import { MatDialog } from '@angular/material/dialog';
import { ClientRequestItemDetailComponent } from '../client-request-item-detail/client-request-item-detail.component';

@Component({
  selector: 'app-client-request-item',
  templateUrl: './client-request-item.component.html',
  styleUrls: ['./client-request-item.component.css']
})
export class ClientRequestItemComponent implements OnInit {
  nombreDeMinuteRequis = 30;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;
  isReady = false;

  @Input() orderItemDTO: OrderItemDTO
  @Output() orderItemDetailChanged: EventEmitter<OrderItemDTO> = new EventEmitter();
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.setUpTimeout();
    this.checkIfReady();
  }
  checkIfReady(){
    if(this.orderItemDTO.orderStatus.toString() == "READY"){
      this.isReady =true;
    }
  }

  setUpTimeout() {
    var today = new Date();

    this.nombreDeMinuteRequis = this.orderItemDTO.product.tempsDePreparation;
    this.nombreDeMinuteRestant = Math.round((Date.parse(this.orderItemDTO.tempsDePreparation.toString()) - today.getTime()) / 60000);

    if (this.nombreDeMinuteRestant > 0) {
      this.nombreDeMinuteRestant--;
      this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
      localStorage.setItem(this.orderItemDTO.id.toString(), this.nombreDeMinuteRestant.toString());
    }
    else {
      this.nombreDeMinuteRestant = 0;
      this.nombreDeMinutesSur100 = 0;
    }

  }

  openDialog() {
    const dialogRef = this.dialog.open(ClientRequestItemDetailComponent, {
      data: this.orderItemDTO,
      maxHeight:'600px',
    });

  }
}
