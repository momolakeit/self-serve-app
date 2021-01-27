import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { MenuType } from 'src/app/models/menu-type.enum';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { OrderStatus } from 'src/app/models/order-status.enum';
import { BillDTO } from '../../models/bill-dto'
import { BillService } from '../../services/bill.service'
import { Router } from '@angular/router';
import { RestaurantType } from 'src/app/models/restaurant-type.enum';
import { KitchenService } from 'src/app/services/kitchen.service';
import { BillStatus } from 'src/app/models/bill-status.enum';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-client-request-list',
  templateUrl: './client-request-list.component.html',
  styleUrls: ['./client-request-list.component.css']
})
export class ClientRequestListComponent implements OnInit {

  billDTO: BillDTO
  orderItemToPassToModal: OrderItemDTO
  listeTempsRestant = [];
  loading = true;
  isBillPayed = false;

  constructor(private billService: BillService, private router: Router, private kitchenService: KitchenService, private authentificationService: AuthentificationService) { }

  ngOnInit(): void {
    this.setUpTimeout();
    this.billDTO = this.getBill();
    this.loading = false;
  }

  setUpTimeout() {
    var source = timer(1000, 50000).subscribe(val => {

      this.billService.getBill(this.billDTO).subscribe(data => {
        this.billDTO = data;
        this.isBillPayed = (this.billDTO.billStatus == BillStatus.PAYED);
      })
    });
  }

  changeOrderItemToPassToModal(orderItemDTO: OrderItemDTO) {
    this.orderItemToPassToModal = orderItemDTO;
  }

  changeBillTipPercentage(value: number) {
    this.changeBillTipValue((value * this.billDTO.prix) / 100);
  }
  changeBillTipValue(value: number) {
    this.billDTO.tips = parseFloat(value.toFixed(2));
    this.billDTO.prixTotal = this.billDTO.prix + this.billDTO.tips;
  }

  initBillValues() {
    this.changeBillTipValue(parseFloat(this.billDTO.tips.toString()))
  }

  isWaiterProduct(orderItem: OrderItemDTO): boolean {
    return orderItem.menuType ? orderItem.menuType != MenuType.WAITERCALL && orderItem.menuType != MenuType.WAITERREQUEST : false;
  }

  isAllOrdersCompleted(): boolean {
    return this.billDTO.orderItems ? !this.billDTO.orderItems.some(orderItem => orderItem.orderStatus != OrderStatus.COMPLETED) : false;
  }
  getBill(): BillDTO {
    return JSON.parse(localStorage.getItem("ongoingBill"));
  }
  payNow() {
    this.loading = true;
    this.billService.updateBill(this.billDTO).subscribe(data => {
      localStorage.setItem("ongoingBill", JSON.stringify(data))
      this.router.navigateByUrl("/paymentChoice")
    })
  }
  isRestaurantDineIn(): boolean {
    return this.kitchenService.isRestaurantDineIn();;
  }
  isRestaurantFastFood(): boolean {
    return this.kitchenService.isRestaurantFastFood();;
  }
  close() {
    this.authentificationService.logoutAction();
  }
}
