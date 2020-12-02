import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../../services/kitchen.service';
import { RestaurantTableDTO } from '../../models/restaurant-table-dto'
import { timer } from 'rxjs';
import { BillDTO } from '../../models/bill-dto';
import { environment } from '../../../environments/environment'
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { BillService } from 'src/app/services/bill.service';
import { PaymentService } from '../../services/payment.service';
@Component({
  selector: 'app-restaurent-orders',
  templateUrl: './restaurent-orders.component.html',
  styleUrls: ['./restaurent-orders.component.css']
})
export class RestaurentOrdersComponent implements OnInit {
  panelOpenStateArray = []
  imgUrl: string;
  allTables: RestaurantTableDTO[];
  allCheckItems = [];
  allBills: BillDTO[];
  nombreDeMinuteRequis = 0;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;
  isBillDone = false;
  loading: Boolean;
  isActive: Boolean;
  panelOpenState = false;

  constructor(private kitchenService: KitchenService, private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.loading = true;
    this.imgUrl = environment.baseImgPath;
    this.isSubscriptionActive();
  }

  isSubscriptionActive() {
    this.paymentService.fetchSubscription("owner@mail.com").subscribe(data => {
      if (data.status != "active") {
        this.isActive = false;
        this.loading = false;
      }
      else {
        this.isActive = true;
        this.initValues();
      }
    })
  }

  seeIfCheckItemSelected (checkItemName: string): boolean {
    var currentCheckItem = this.allCheckItems.find(checkItem => checkItem.name == checkItemName);

    return currentCheckItem.isActive;
  }

  initValues() {
    var source = timer(1000, 50000).subscribe(() => {
      this.kitchenService.getAllRestaurantTables().subscribe(data => {
        this.loading = false;
        this.allTables = data;
        this.allTables = this.filterTableArray(this.allTables);
        this.allTables.forEach(table => {
          this.panelOpenStateArray.push(false);
          table.nombreItemParTable = 0;
          table = this.setUpTable(table);
        });
      });
    });
  }

  filterTableArray(tableToFilter: RestaurantTableDTO[]): RestaurantTableDTO[] {
    return tableToFilter.filter(table => (table.bills.length > 0 && table.bills != null));
  }

  filterOrderItemArrayByProductTypeForBill (orderItems: OrderItemDTO[]): OrderItemDTO[] {
   console.log(orderItems)

    return orderItems.filter(oItem => (oItem.menuType.toString() != "WAITERREQUEST" && oItem.menuType.toString() != "WAITERCALL"));
  }

  filterOrderItemArrayByOrderStatusForBill  (orderItems: OrderItemDTO[]): OrderItemDTO[] {
    return orderItems.filter(oItem => oItem.orderStatus.toString() != "READY");
  }

  setUpTable(table: RestaurantTableDTO): RestaurantTableDTO {
    table.nombreItemParTable = 0;

    table.bills.forEach(bill => {
      bill = this.setUpBill(bill);
      table.nombreItemParTable = bill.orderItems.length;
      if (table.nombreItemParTable == 0) {
        bill.isBillEmpty = false;
      }
    })

    return table;
  }

  setUpBill (bill: BillDTO): BillDTO {
    bill.isBillEmpty = true;

    bill.orderItems = this.filterOrderItemArrayByProductTypeForBill(bill.orderItems);
    bill.orderItems = this.filterOrderItemArrayByOrderStatusForBill(bill.orderItems);

    bill.orderItems.forEach(orderItem => {
      orderItem = this.setUpOrderItem(orderItem);
    })

    return bill;
  }

  setUpOrderItem (orderItem: OrderItemDTO): OrderItemDTO {
    orderItem.option.forEach(option => {
      option.checkItemList.forEach(checkItem => {
        this.allCheckItems.push(checkItem);
      })
    })
    return orderItem;
  }

  setNumberOfItemInTable(table, orderItem, bill) {
    if (orderItem.orderStatus != "READY") {
      if (table.nombreItemParTable == 0) {
        bill.isBillEmpty = false;
      }
      table.nombreItemParTable = table.nombreItemParTable + 1;
    }
  }

  setPanelOpenValue(position: number, value: boolean) {
    this.panelOpenStateArray[position] = value;
  }

}
