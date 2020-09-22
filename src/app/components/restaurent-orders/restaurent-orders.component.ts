import { Component, OnInit } from '@angular/core';
import { KitchenService } from '../../services/kitchen.service';
import { RestaurantTableDTO } from '../../models/restaurant-table-dto'
import { environment } from '../../../environments/environment'
import { timer } from 'rxjs';

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
  nombreDeMinuteRequis =30;
  nombreDeMinuteRestant =30;
  nombreDeMinutesSur100 =100;
  nombreDeItemDansTable =0;
  constructor(private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath;
    this.setUpTimeout();
    this.initValues();
  }

  seeIfCheckItemSelected = function (checkItemName: string): boolean {
    var currentCheckItem = this.allCheckItems.filter(checkItem => checkItem.name == checkItemName);
    console.log(currentCheckItem);
    return currentCheckItem.isActive;
  }
  setUpTimeout = function(): void{
    const source = timer(1000,1000);
    source.subscribe(val=>{this.nombreDeMinuteRestant=this.nombreDeMinuteRestant -1;
                           this.nombreDeMinutesSur100 =(this.nombreDeMinuteRestant *100 ) /this.nombreDeMinuteRequis ;
                          });
  }
  addTime = function (): void{
    this.nombreDeMinuteRestant= this.nombreDeMinuteRestant +5;
  }
  initValues = function (): void {
    this.kitchenService.getAllRestaurantTables().subscribe(data => {
      this.allTables = data;
      console.log(this.allTables);
      this.allTables.forEach(element => {
        element.billDTOList.forEach(element => {
          element.orderItems.forEach(element => {
            this.nombreDeItemDansTable = this.nombreDeItemDansTable +1;
            element.option.forEach(element => {
              element.checkItemList.forEach(element => {
                this.allCheckItems.push(element);
              })
            })
          })
        });
      });
    });
  }

}
