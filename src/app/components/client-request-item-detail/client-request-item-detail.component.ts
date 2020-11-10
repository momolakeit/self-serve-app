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
  nombreDeMinuteRequis = 30;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;
  isReady = false
  imgUrl: string;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: OrderItemDTO,public dialogRef: MatDialogRef<ClientRequestItemDetailComponent>) { }

  ngOnInit(): void {
  }

  getImage(imageId:number){
    return environment.baseImgPath + imageId;
  }

  ngOnChanges(): void {
    if (this.data != null) {

      if (localStorage.getItem(this.data.id.toString()) == null) 
        localStorage.setItem(this.data.id.toString(), this.nombreDeMinuteRequis.toString());
      
      this.nombreDeMinuteRestant = JSON.parse(localStorage.getItem(this.data.id.toString()));
      this.setUpTimeout();
      this.changeOrderStatus();
    }
  }

  setUpTimeout() {
    var source = timer(1000, 1000).subscribe(() => {
      if (parseInt(localStorage.getItem(this.data.id.toString())) == 0) {
        this.nombreDeMinutesSur100 = 0;
        source.unsubscribe();
      }
      else {
        this.nombreDeMinuteRestant = parseInt(localStorage.getItem(this.data.id.toString()));
        this.nombreDeMinutesSur100 = (this.nombreDeMinuteRestant * 100) / this.nombreDeMinuteRequis;
        localStorage.setItem(this.data.id.toString(), this.nombreDeMinuteRestant.toString());
      }
    });
  }

  addTime() {
    this.nombreDeMinuteRestant = parseInt(localStorage.getItem(this.data.id.toString()));
   
    if (this.nombreDeMinuteRestant >= this.nombreDeMinuteRequis) 
      this.nombreDeMinuteRestant = this.nombreDeMinuteRequis;
    else 
      this.nombreDeMinuteRestant += 5;
    
    localStorage.setItem(this.data.id.toString(), this.nombreDeMinuteRestant.toString());
  }

  changeOrderStatus() {
    if (this.data.orderStatus.toString() == "READY") 
      this.isReady = false;

    if (this.data.orderStatus.toString() == "PROGRESS") 
      this.isReady = true;
  }

  onNoClick(){
    this.dialogRef.close();
  }

}
