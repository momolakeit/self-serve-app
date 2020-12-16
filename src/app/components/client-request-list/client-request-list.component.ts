import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { MenuType } from 'src/app/models/menu-type.enum';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { OrderStatus } from 'src/app/models/order-status.enum';
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
    
    return orderItem.menuType!=MenuType.WAITERCALL&& orderItem.menuType!=MenuType.WAITERREQUEST;
  }
  isAllOrdersCompleted():boolean{
    var returnValue= true;
    this.billDTO.orderItems.forEach(oItem=>{
      if(oItem.orderStatus!=OrderStatus.COMPLETED){
        returnValue = false;
      }
    })
    return returnValue;
  }

}
