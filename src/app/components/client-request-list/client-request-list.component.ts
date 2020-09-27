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

  constructor(private billService: BillService) { }
  billDTO: BillDTO
  orderItemToPassToModal: OrderItemDTO
  listeTempsRestant = [];


  ngOnInit(): void {
    this.setUpTimeout();
  }

  setUpTimeout = function (): void {
    var source = timer(1000, 50000).subscribe(val => {
      var billDTO = JSON.parse(localStorage.getItem("ongoingBill"));
      this.billService.getBill(billDTO).subscribe(data => {
        this.billDTO = data;
        console.log(data);
        console.log(this.billDTO);
      })
    });
  }

  changeOrderItemToPassToModal = function (orderItemDTO: OrderItemDTO): void {
    console.log("/***************************************salope*********************************************/");
    console.log(orderItemDTO);
    this.orderItemToPassToModal = orderItemDTO;

  }

}
