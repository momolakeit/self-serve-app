import { Component, OnInit } from '@angular/core';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { BillDTO} from '../../models/bill-dto'

@Component({
  selector: 'app-client-request-list',
  templateUrl: './client-request-list.component.html',
  styleUrls: ['./client-request-list.component.css']
})
export class ClientRequestListComponent implements OnInit {

  constructor() { }
  billDTO : BillDTO
  orderItemToPassToModal :OrderItemDTO
  listeTempsRestant =[];


  ngOnInit(): void {
    this.billDTO = JSON.parse(localStorage.getItem("ongoingBill"));
    this.billDTO.orderItems.forEach(orderItem =>{
      this.listeTempsRestant.push(orderItem.product.tempsDePreparation);
    });
  }

  changeOrderItemToPassToModal =function (orderItemDTO:OrderItemDTO) : void {
    console.log("/***************************************salope*********************************************/");
    console.log(orderItemDTO);
    this.orderItemToPassToModal = orderItemDTO;

  }

}
