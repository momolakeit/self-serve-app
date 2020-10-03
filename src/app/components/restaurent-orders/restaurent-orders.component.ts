import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../../services/kitchen.service';
import { RestaurantTableDTO } from '../../models/restaurant-table-dto'
import { timer } from 'rxjs';
import { BillDTO } from '../../models/bill-dto';
import { environment } from '../../../environments/environment'
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { BillService } from 'src/app/services/bill.service';

@Component({
  selector: 'app-restaurent-orders',
  templateUrl: './restaurent-orders.component.html',
  styleUrls: ['./restaurent-orders.component.css']
})
export class RestaurentOrdersComponent implements OnInit {
  panelOpenState: boolean
  imgUrl: string;
  allTables: [RestaurantTableDTO];
  allCheckItems = [];
  allBills: [BillDTO];
  nombreDeMinuteRequis = 0;
  nombreDeMinuteRestant = 0;
  nombreDeMinutesSur100 = 100;
  isBillDone = false;
  constructor(private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath;
    this.initValues();
  }

  seeIfCheckItemSelected = function (checkItemName: string): boolean {
    var currentCheckItem = this.allCheckItems.filter(checkItem => checkItem.name == checkItemName);
    console.log(currentCheckItem);
    return currentCheckItem.isActive;
  }

  initValues = function (): void {
    var source = timer(1000, 50000).subscribe(() => {
      this.kitchenService.getAllRestaurantTables().subscribe(data => {
        this.allTables = data;
        this.allTables = this.filterTableArray(this.allTables);
        this.allTables.forEach(table => {
          table.nombreItemParTable = 0;
          table = this.setUpTable(table);
        });
      });
    });
  }
  filterTableArray = function (tableToFilter: RestaurantTableDTO[]): RestaurantTableDTO[] {
    return tableToFilter.filter(table => (table.bills.length > 0 && table.bills != null));
  }
  filterOrderItemArrayByProductTypeForBill = function (orderItems: OrderItemDTO[]): OrderItemDTO[] {
    return orderItems.filter(oItem => (oItem.productType.toString() != "WAITERREQUEST" && oItem.productType.toString() != "WAITERCALL"));
  }

  filterOrderItemArrayByOrderStatusForBill = function (orderItems: OrderItemDTO[]): OrderItemDTO[] {
    return orderItems.filter(oItem => oItem.orderStatus.toString() != "READY");
  }

  setUpTable = function (table: RestaurantTableDTO): RestaurantTableDTO {
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

  setUpBill = function (bill: BillDTO): BillDTO {
    bill.isBillEmpty = true;
    console.log("*****************");
    console.log(bill.orderItems);
    bill.orderItems = this.filterOrderItemArrayByProductTypeForBill(bill.orderItems);
    console.log("*****************");
    console.log(bill.orderItems);
    bill.orderItems = this.filterOrderItemArrayByOrderStatusForBill(bill.orderItems);
    console.log("*****************");
    console.log(bill.orderItems); 
    bill.orderItems.forEach(orderItem => {
      orderItem = this.setUpOrderItem(orderItem);
    })
    return bill;
  }
  setUpOrderItem = function (orderItem: OrderItemDTO): OrderItemDTO {
    orderItem.option.forEach(option => {
      option.checkItemList.forEach(checkItem => {
        this.allCheckItems.push(checkItem);
      })
    })
    return orderItem;
  }


  setNumberOfItemInTable = function (table, orderItem, bill): void {
    if (orderItem.orderStatus != "READY") {
      if (table.nombreItemParTable == 0) {
        bill.isBillEmpty = false;
      }
      table.nombreItemParTable = table.nombreItemParTable + 1;
    }
  }

}
