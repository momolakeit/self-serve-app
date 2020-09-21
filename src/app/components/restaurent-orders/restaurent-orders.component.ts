import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurent-orders',
  templateUrl: './restaurent-orders.component.html',
  styleUrls: ['./restaurent-orders.component.css']
})
export class RestaurentOrdersComponent implements OnInit {
  panelOpenState :boolean
  constructor() { }

  ngOnInit(): void {
  }

}
