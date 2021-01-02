import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../../services/kitchen.service';
import { RestaurantTableDTO } from '../../models/restaurant-table-dto'
import { Observable, timer } from 'rxjs';
import { BillDTO } from '../../models/bill-dto';
import { environment } from '../../../environments/environment'
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { OrderStatus } from 'src/app/models/order-status.enum';
import { CheckItemDTO } from 'src/app/models/check-item-dto';
@Component({
  selector: 'app-restaurent-orders',
  templateUrl: './restaurent-orders.component.html',
  styleUrls: ['./restaurent-orders.component.css']
})
export class RestaurentOrdersComponent implements OnInit {
  imgUrl: string;
  allTables: RestaurantTableDTO[];
  allCheckItems: CheckItemDTO[] = [];
  allBills: BillDTO[];
  timer:number = 0;
  interval:number = 50000;
  isBillDone: boolean = false;
  loading: boolean;
  isActive: boolean;
  source;
  selected: string = "";
  ORDERS_TO_SERVE: string = "ORDERS_TO_SERVE";
  ORDERS_IN_KITCHEN: string = "ORDERS_IN_KITCHEN";
  ORDERS_SERVED: string = "ORDERS_SERVED";

  constructor(private kitchenService: KitchenService, private paymentService: PaymentService, private authService: AuthService) { }

  ngOnInit(): void {
    this.setSmallVariables();
    this.isSubscriptionActive();
  }
  
  setSmallVariables(){
    this.loading = true;
    this.imgUrl = environment.baseImgPath;
    
    timer(1000, 1000).subscribe(() => this.timer--);
  }

  isSubscriptionActive() {
    this.paymentService.fetchSubscription(JSON.parse(localStorage.getItem('ownerUsername'))).subscribe(data => {
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


  initValues() {
    this.handleLoadingAndSelectedAndTimer();


    this.source = timer(1000, this.interval).subscribe(() => {
      this.timer = parseInt(Math.round(this.interval / 1000).toFixed(2));

      this.kitchenService.fetchKitchenRestaurentTables(parseInt(localStorage.getItem('restaurantId'))).subscribe(data => {
        this.allTables = this.filterTableArray(data);
        this.allTables.forEach(table => table = this.setUpTable(table,this.selected));
        this.loading = false;
      });
      
    });
  }

  initOrdersToServe(){
    this.loading = true;
    this.selected = this.ORDERS_TO_SERVE;
    localStorage.setItem('selected',this.selected);
    this.initValues();
  }

  initAwaitingOrders() {
    this.loading = true;
    this.selected = this.ORDERS_IN_KITCHEN;
    localStorage.setItem('selected',this.selected);
    this.initValues();
  }

  initCompletedOrders() {
    this.loading = true;
    this.selected = this.ORDERS_SERVED;
    localStorage.setItem('selected',this.selected);
    this.initValues();
  }

  setUpTable(table: RestaurantTableDTO,selected:string): RestaurantTableDTO {
    table.nombreItemParTable = 0;

    table.bills.forEach(bill => {
      bill = this.setUpBill(bill,selected);

      table.nombreItemParTable = bill.orderItems.length;

      bill.isBillEmpty = table.nombreItemParTable != 0;
    });

    return table;
  }

  setUpBill(bill: BillDTO, selected: string): BillDTO {
    bill.isBillEmpty = true;

    if (selected == this.ORDERS_IN_KITCHEN)
      bill.orderItems = this.filterOrderItemArrayByOrderStatusForBillForCook(bill.orderItems);
    else if (selected == this.ORDERS_SERVED)
      bill.orderItems = this.filterOrderItemArrayByCompletedOrderStatusForBillForWaiter(bill.orderItems);
    else
      bill.orderItems = this.authService.isWaiter() ? this.filterOrderItemArrayByOrderStatusForBillForWaiter(bill.orderItems) : this.filterOrderItemArrayByOrderStatusForBillForCook(bill.orderItems);

    bill.orderItems.forEach(orderItem => orderItem = this.setUpOrderItem(orderItem));

    return bill;
  }

  filterTableArray(tableToFilter: RestaurantTableDTO[]): RestaurantTableDTO[] {
    return tableToFilter.filter(table => table.bills.length > 0);
  }

  filterOrderItemArrayByOrderStatusForBillForCook(orderItems: OrderItemDTO[]): OrderItemDTO[] {
    return orderItems.filter(oItem => oItem.orderStatus == OrderStatus.PROGRESS);
  }

  filterOrderItemArrayByOrderStatusForBillForWaiter(orderItems: OrderItemDTO[]): OrderItemDTO[] {
    return orderItems.filter(oItem => oItem.orderStatus == OrderStatus.READY);
  }

  filterOrderItemArrayByCompletedOrderStatusForBillForWaiter(orderItems: OrderItemDTO[]): OrderItemDTO[] {
    return orderItems.filter(oItem => oItem.orderStatus == OrderStatus.COMPLETED);
  }

  setUpOrderItem(orderItem: OrderItemDTO): OrderItemDTO {
    orderItem.option.forEach(option => option.checkItemList.forEach(checkItem => this.allCheckItems.push(checkItem)));
    return orderItem;
  }

  handleLoadingAndSelectedAndTimer() {
    this.selected = localStorage.getItem('selected') ? localStorage.getItem('selected') : this.ORDERS_TO_SERVE;

    if (this.source)
      this.source.unsubscribe();
  }

  setNumberOfItemInTable(table, orderItem, bill) {
    if (orderItem.orderStatus != OrderStatus.READY) {
      if (table.nombreItemParTable == 0) {
        bill.isBillEmpty = false;
      }
      table.nombreItemParTable = table.nombreItemParTable + 1;
    }
  }

  isAllTablesEmpty(): boolean {
    return !this.allTables.some(table => table.nombreItemParTable > 0);
  }

  seeIfCheckItemSelected(checkItemName: string): boolean {
    return this.allCheckItems.find(checkItem => checkItem.name == checkItemName).isActive;
  }

  getMinutes():string{
    const minutes : number = Math.floor(this.timer / 60);
    return minutes >= 1 ? minutes > 1 ? minutes < 10 ? '0' + minutes : minutes.toString() : '0' + minutes : '00';
  }

  getSeconds():string{
    const minutes : number = Math.floor(this.timer / 60);
    const secondsLeft : number = this.timer - minutes * 60;
    return secondsLeft  < 10 ? '0' + secondsLeft : secondsLeft.toString();
  }
}
