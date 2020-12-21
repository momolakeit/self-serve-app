import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestaurantEmployerDto } from 'src/app/models/restaurant-employer-dto';
import { RoleName } from 'src/app/models/role-name.enum';
import { KitchenService } from 'src/app/services/kitchen.service';
import { MenuService } from 'src/app/services/menu.service';
import { roles } from 'src/environments/environment';

@Component({
  selector: 'app-restaurant-employees',
  templateUrl: './restaurant-employees.component.html',
  styleUrls: ['./restaurant-employees.component.css']
})
export class RestaurantEmployeesComponent implements OnInit {
  cook: RestaurantEmployerDto;
  waiter: RestaurantEmployerDto;
  callMade: boolean = false;
  cookRole: string = roles.cook;
  waiterRole: string = roles.waiter;


  constructor(private menuService: MenuService, private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.initEmployees();
    this.restaurantSelectChanged();
  }

  initEmployees() {
    this.kitchenService.findAllRestaurantEmployers(JSON.parse(localStorage.getItem('restaurantId'))).subscribe(data => {
      if (data.length >= 1) {
        if (data[0].role == RoleName.ROLE_COOK) {
          this.cook = data[0];
          this.waiter = data[1];
        } else {
          this.cook = data[1];
          this.waiter = data[0];
        }
      } else {
        this.cook = null;
        this.waiter = null;
      }

      this.callMade = true;
    });
  }

  restaurantSelectChanged() {
    this.menuService.onRestaurantSelectedEvent.subscribe(() => this.initEmployees());
  }
}
