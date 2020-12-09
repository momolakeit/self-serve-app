import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { BillDTO } from '../../models/bill-dto'
import { BillService } from '../../services/bill.service'

@Component({
  selector: 'app-client-request-list',
  templateUrl: './client-request-list.component.html',
  styleUrls: ['./client-request-list.component.css']
})
export class ClientRequestListComponent implements OnInit {

  billDTO: BillDTO
  orderItemToPassToModal: OrderItemDTO
  listeTempsRestant = [];

  constructor(private billService: BillService) { }

  ngOnInit(): void {
    this.setUpTimeout();
  }

  setUpTimeout() {
    var source = timer(1000, 50000).subscribe(val => {
      var billDTO = JSON.parse(localStorage.getItem("ongoingBill"));
      
      this.billService.getBill(billDTO).subscribe(data => {
        this.billDTO = data;
      })
    });
  }

  changeOrderItemToPassToModal (orderItemDTO: OrderItemDTO) {
    this.orderItemToPassToModal = orderItemDTO;
  }

  isWaiterProduct(orderItem:OrderItemDTO):boolean{
    if (!orderItem.menuType)
      return false;
    
    return orderItem.menuType.toString()!='WAITERCALL'&& orderItem.menuType.toString()!='WAITERREQUEST';
  }

}
