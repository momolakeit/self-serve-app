import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderItemDTO } from '../../models/order-item-dto'

@Component({
  selector: 'app-client-request-item-detail',
  templateUrl: './client-request-item-detail.component.html',
  styleUrls: ['./client-request-item-detail.component.css']
})
export class ClientRequestItemDetailComponent implements OnInit {
  nombreDeMinuteRequis = 0;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;
  isReady = false
  imgUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: OrderItemDTO, public dialogRef: MatDialogRef<ClientRequestItemDetailComponent>) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath;
    var today = new Date();
    this.nombreDeMinuteRequis = this.data.product.tempsDePreparation;
    this.nombreDeMinuteRestant = Math.round((Date.parse(this.data.tempsDePreparation.toString()) - today.getTime()) / 60000);
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
    this.nombreDeMinuteRequis = this.data.product.tempsDePreparation;
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

  onNoClick() {
    this.dialogRef.close();
  }

  changeOrderStatus = function (): void {
    if (this.data.orderStatus.toString() == "READY") {
      this.isReady = true;
    }
    if (this.data.orderStatus.toString() == "PROGRESS") {
      this.isReady = false;
    }
  }

}
