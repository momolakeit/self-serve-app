import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestaurantEmployerDto } from 'src/app/models/restaurant-user-dto';
import { RoleName } from 'src/app/models/role-name.enum';
import { KitchenService } from 'src/app/services/kitchen.service';

@Component({
  selector: 'app-single-restaurant-employees',
  templateUrl: './single-restaurant-employees.component.html',
  styleUrls: ['./single-restaurant-employees.component.css']
})
export class SingleRestaurantEmployeesComponent implements OnInit {
  @Input() employer: RestaurantEmployerDto;
  @Input() role: RoleName;
  waiterRole: RoleName = RoleName.ROLE_WAITER;
  cookRole: RoleName = RoleName.ROLE_COOK;
  employerForm: FormGroup;
  isEmployerSaving: boolean = false;
  isEmployerEditable: boolean = false;

  constructor(private snackBar: MatSnackBar, private kitchenService: KitchenService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    this.employerForm = this.formBuilder.group({
      username: [this.employer ? this.employer.username : '', Validators.required],
      password: [this.employer ? this.employer.password : '', Validators.required]
    });
  }

  openSnackBar() {
    this.snackBar.open("user saved successfully!", "Close", {
      duration: 3000,
    });

    this.snackBar._openedSnackBarRef.onAction().subscribe(() => {
      this.snackBar.dismiss();
    })
  }


  getF() {
    return this.employerForm.controls;
  }

  // Services

  onEmployerEditClick() {
    this.isEmployerEditable = true;
    this.employerForm.setValue({ password: '', username: this.employer.username });
  }

  onEmployerCancelClick() {
    this.isEmployerEditable = false;
    this.employerForm.setValue({ password: this.employer.password, username: this.employer.username });
  }

  handleEmployerSubmit() {
    if (this.employerForm.valid) {
      this.isEmployerSaving = true;

      const formValue = this.employerForm.value;

      const employer: RestaurantEmployerDto = {
        id: this.employer ? this.employer.id : null,
        username: formValue['username'],
        password: formValue['password'],
        restaurantId: JSON.parse(localStorage.getItem('restaurantId')),
        role: this.role
      }

      if (this.employer)
        this.onEmployerUpdate(employer);
      else this.onEmployerCreation(employer);

    }
  }

  onEmployerCreation(employer: RestaurantEmployerDto) {
    this.kitchenService.addUserToRestaurant(employer).subscribe(() => {
      this.handleSaveAction(employer);
    }, error => {
      this.handleUsernameError(error.error);
    });
  }

  onEmployerUpdate(employer: RestaurantEmployerDto) {
    this.kitchenService.updateRestaurantEmployee(employer).subscribe(() => {
      this.handleSaveAction(employer)
    }, error => {
      this.handleUsernameError(error.error);
    });
  }

  handleUsernameError(errorMsg) {
    if (errorMsg == 'Username already exist') {
      this.getF().username.setErrors({ existing: true });
      this.isEmployerSaving = false;
    }
  }

  handleSaveAction(employer: RestaurantEmployerDto) {
    this.isEmployerSaving = false;
    this.isEmployerEditable = false;
    this.openSnackBar();
    this.refetchEmployer(employer);
  }

  refetchEmployer(employer: RestaurantEmployerDto){
    this.kitchenService.findRestaurantEmployer(employer.username).subscribe(data =>{
      this.employer = data;
      this.initForms();
    });
  }


}
