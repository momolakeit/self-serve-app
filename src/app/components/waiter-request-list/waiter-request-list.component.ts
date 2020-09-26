import { Component, OnInit } from '@angular/core';
import { OrderItemDTO } from 'src/app/models/order-item-dto';
import { RestaurantTableDTO } from 'src/app/models/restaurant-table-dto';
import { KitchenService } from 'src/app/services/kitchen.service';

@Component({
  selector: 'app-waiter-request-list',
  templateUrl: './waiter-request-list.component.html',
  styleUrls: ['./waiter-request-list.component.css']
})
export class WaiterRequestListComponent implements OnInit {
  panelOpenState = false;
  restaurantTables: [RestaurantTableDTO];
  fetchIntervalInSecond: number = 60; 
  secondsFactor: number = 1000;

  constructor(private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.fetchRestaurantTable();
    setInterval(()=>{this.fetchRestaurantTable()} ,this.fetchIntervalInSecond * this.secondsFactor);
  }

  fetchRestaurantTable(){
   this.kitchenService.fetchKitchenRestaurentTables(1).subscribe((tables) =>{
      this.restaurantTables = tables;
   });
  }


  //estce une mauvaise pratique de perfomance de refetch le database pour update ou bien je devrais simplement faire disappear le order item pour eviter de fetch?
  completeOrder(orderItemDto:OrderItemDTO){
    this.kitchenService.postOrderItemStatusReady(orderItemDto).subscribe(() => {this.fetchRestaurantTable()});
  }

}
