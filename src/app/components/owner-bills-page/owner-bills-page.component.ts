import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BillDTO } from 'src/app/models/bill-dto';
import { FindBillBetweenDateRequestDTO } from 'src/app/models/find-bill-between-date-request-dto';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { BillService } from 'src/app/services/bill.service';
import { MenuService } from 'src/app/services/menu.service';
import { OwnerUsernameService } from 'src/app/services/owner-username.service';

@Component({
  selector: 'app-owner-bills-page',
  templateUrl: './owner-bills-page.component.html',
  styleUrls: ['./owner-bills-page.component.css']
})
export class OwnerBillsPageComponent implements OnInit {
  bills:BillDTO[];
  restaurantSelectionDTOS: RestaurantSelectionDTO[];
  restaurantSelectionFormControl: FormControl;
  loading:boolean = false;
  range: FormGroup;

  constructor(private billService:BillService,private menuService:MenuService,private ownerUsernameService:OwnerUsernameService) { }

  ngOnInit(): void {
    this.getAllRestaurantSelectionDTO();
    this.initForm();
    this.findAllPaidBillsByRestaurantBetweenDates();
  }

  initForm(){
    const restaurantId: number = JSON.parse(localStorage.getItem('restaurantId'));

    this.restaurantSelectionFormControl = new FormControl(restaurantId, Validators.required);

    var beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);

    this.range = new FormGroup({
      begin: new FormControl(beginDate,Validators.required),
      end: new FormControl(new Date(),Validators.required)
    });
  }

  findAllPaidBillsByRestaurantBetweenDates(){
    if (this.range.valid && this.restaurantSelectionFormControl.valid) {
      this.loading = true;
      localStorage.setItem('restaurantId',this.restaurantSelectionFormControl.value)

      const request : FindBillBetweenDateRequestDTO = {
        restaurantId: this.restaurantSelectionFormControl.value,
        begin: new Date(this.range.value['begin']),
        end:new Date(this.range.value['end']).toDateString() == new Date().toDateString() ? new Date() : new Date(this.range.value['end'])
      };

      this.billService.findAllPaidBillsByRestaurantBetweenDates(request).subscribe(data=>{
        this.bills = data;
        this.loading = false;
      });
    }
  }

  getAllRestaurantSelectionDTO() {
    this.menuService.getAllRestaurantName(this.ownerUsernameService.initUserName()).subscribe(data => {
      this.loading = false;
      this.restaurantSelectionDTOS = data;
    });
  }

  formatDate(date:string):string{
    return new Date(date).toDateString();
  }

}
