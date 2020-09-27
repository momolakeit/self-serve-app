import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../../services/kitchen.service';
import { RestaurantTableDTO } from '../../models/restaurant-table-dto'
import { BillDTO } from '../../models/bill-dto';
import { environment } from '../../../environments/environment'

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
  allBills :[BillDTO];
  nombreDeMinuteRequis =30;
  nombreDeMinuteRestant =30;
  nombreDeMinutesSur100 =100;
  isBillDone =false;
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
    this.kitchenService.getAllRestaurantTables().subscribe(data => {
      this.allTables = data;
      this.allTables.forEach(table => {
        table.nombreItemParTable=0;
        table.billDTOList.forEach(bill => {
          bill.isBillEmpty = true;
          bill.orderItems.forEach(orderItem => {
            this.setNumberOfItemInTable(table,orderItem,bill)
            orderItem.option.forEach(option => {
              option.checkItemList.forEach(checkItem => {
                this.allCheckItems.push(checkItem);
              })
            })
          })
        });
      });
    });
  }

  setNumberOfItemInTable = function (table,orderItem,bill ): void{
    if(orderItem.orderStatus!="READY"){
      if(table.nombreItemParTable==0){
        bill.isBillEmpty =false;
      }
      table.nombreItemParTable = table.nombreItemParTable +1;
    }
  }
  
}
