import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestaurantUserDto } from 'src/app/models/restaurant-user-dto';
import { RoleName } from 'src/app/models/role-name.enum';
import { KitchenService } from 'src/app/services/kitchen.service';

@Component({
  selector: 'app-restaurant-employees',
  templateUrl: './restaurant-employees.component.html',
  styleUrls: ['./restaurant-employees.component.css']
})
export class RestaurantEmployeesComponent implements OnInit {
  cook: RestaurantUserDto;
  waiter: RestaurantUserDto;
  cookForm: FormGroup;
  waiterForm: FormGroup;
  isWaiterSaving: boolean = false;
  isCookSaving: boolean = false;
  isCookEditable: boolean = false;
  isWaiterEditable: boolean = false;

  constructor(private snackBar: MatSnackBar,private kitchenService: KitchenService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForms();
    this.initEmployees();
  }

  openSnackBar() {
    this.snackBar.open("user saved successfully!", "Close", {
      duration: 3000,
    });

    this.snackBar._openedSnackBarRef.onAction().subscribe(() =>{
      this.snackBar.dismiss();
    })
  }

  // Forms

  initForms() {
    this.cookForm = this.formBuilder.group({
      username: [this.cook ? this.cook.username : '', Validators.required],
      password: [this.cook ? this.cook.password : '', Validators.required]
    });

    this.waiterForm = this.formBuilder.group({
      username: [this.waiter ? this.waiter.username : '', Validators.required],
      password: [this.waiter ? this.waiter.password : '', Validators.required]
    });
  }

  getC(){
    return this.cookForm.controls;
  }

  getW(){
    return this.waiterForm.controls;
  }
  
  // Services

  onWaiterEditClick(){
    this.isWaiterEditable = true;
    this.waiterForm.setValue({password:'',username:this.waiter.username});
  }

  onWaiterCancelClick(){
    this.isWaiterEditable = false;
    this.waiterForm.setValue({password:this.waiter.password,username:this.waiter.username});
  }

  onCookEditClick(){
    this.isCookEditable = true;
    this.cookForm.setValue({password:'',username:this.cook.username});
  }

  onCookCancelClick(){
    this.isCookEditable = false;
    this.cookForm.setValue({password:this.cook.password,username:this.cook.username});
  }
  
  initEmployees() {
    this.kitchenService.findAllRestaurantEmployees().subscribe(data => {
      if (data[0].role == RoleName.ROLE_COOK) {
        this.cook = data[0];
        this.waiter = data[1];
      }else{
        this.cook = data[1];
        this.waiter = data[0];
      }

      this.initForms();
    })
  }

  handleCookSubmit() {
    if (this.cook) {
      this.onCookSubmit();
    } else this.onCookCreation();
  }

  handleWaiterSubmit() {
    if (this.waiter) {
      this.onWaiterSubmit();
    } else this.onWaiterCreation();
  }

  onCookSubmit() {
    if (this.cookForm.valid) {
      this.isCookSaving = true;
      const formValue = this.cookForm.value;

      const restaurantUser: RestaurantUserDto = {
        id: this.cook.id,
        username: formValue['username'],
        password: formValue['password'],
        restaurantId: this.cook.restaurantId,
        role: this.cook.role
      }

      this.kitchenService.updateRestaurantEmployee(restaurantUser).subscribe(() => {
        this.isCookEditable = false;
        this.isCookSaving = false;
        this.openSnackBar();
        this.initEmployees();
      },error =>{
        if (error.error == 'Username already exist') {
          this.getC().username.setErrors({existing:true});
          this.isCookSaving = false;
        }
      });
    }
  }

  onWaiterSubmit() {
    if (this.waiterForm.valid) {
      this.isWaiterSaving = true;
      const formValue = this.waiterForm.value;

      const restaurantUser: RestaurantUserDto = {
        id: this.waiter.id,
        username: formValue['username'],
        password: formValue['password'],
        restaurantId: this.waiter.restaurantId,
        role: this.waiter.role
      }

      this.kitchenService.updateRestaurantEmployee(restaurantUser).subscribe(() => {
        this.isWaiterEditable = false;
        this.isWaiterSaving = false;
        this.openSnackBar();
        this.initEmployees();
      },error =>{
        if (error.error == 'Username already exist') {
          this.getW().username.setErrors({existing:true});
          this.isWaiterSaving = false;
        }
      });
    }
  }


  onCookCreation() {
    if (this.cookForm.valid) {
      this.isCookSaving = true;

      const formValue = this.cookForm.value;

      const restaurantUser: RestaurantUserDto = {
        id: null,
        username: formValue['username'],
        password: formValue['password'],
        restaurantId: JSON.parse(localStorage.getItem('restaurantId')),
        role: RoleName.ROLE_COOK
      }

      this.kitchenService.addUserToRestaurant(restaurantUser).subscribe(() => {
        this.isCookSaving = false;
        this.openSnackBar();
        this.initEmployees();
      },error =>{
        if (error.error == 'Username already exist') {
          this.getC().username.setErrors({existing:true});
          this.isCookSaving = false;
        }
      });
    }
  }

  onWaiterCreation() {
    if (this.waiterForm.valid) {
      this.isWaiterSaving = true;

      const formValue = this.waiterForm.value;

      const restaurantUser: RestaurantUserDto = {
        id: null,
        username: formValue['username'],
        password: formValue['password'],
        restaurantId: JSON.parse(localStorage.getItem('restaurantId')),
        role: RoleName.ROLE_WAITER
      }

      this.kitchenService.addUserToRestaurant(restaurantUser).subscribe(() => {
        this.isWaiterSaving = false;
        this.openSnackBar();
        this.initEmployees();
      },error =>{
        if (error.error == 'Username already exist') {
          this.getW().username.setErrors({existing:true});
          this.isWaiterSaving = false;
        }
      });
    }
  }

}
