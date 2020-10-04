import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { RestaurantFormDTO } from 'src/app/models/restaurant-form-dto';
import { KitchenService } from 'src/app/services/kitchen.service';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {
  title: string;
  restaurantForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<RestaurantFormComponent>, @Inject(MAT_DIALOG_DATA) public data: RestaurantSelectionDTO, private formBuilder: FormBuilder, private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.restaurantForm = this.formBuilder.group({
      name: [this.data ? this.data.restaurantName : '', Validators.required],
      tableAmount: [this.data ? this.data.restaurentTablesDTO.length : '', Validators.required]
    })

    this.title = this.data ? 'Restaurant update' : 'Restaurant creation';
  }

  onSubmitForm() {
    if (this.restaurantForm.valid) {

      const formValues = this.restaurantForm.value;

      const restaurantFormDTO: RestaurantFormDTO = {
        restaurantId: this.data.restaurantId,
        ownerUsername: localStorage.getItem('username'),
        nombreDeTable: formValues['tableAmount'],
        restaurantName: formValues['name']
      }

      if (this.data)
        this.onUpdate(restaurantFormDTO);
      else
        this.onCreate(restaurantFormDTO);
    }
  }

  onCreate(restaurantFormDTO: RestaurantFormDTO) {
    this.kitchenService.createRestaurant(restaurantFormDTO).subscribe(() => {
      this.dialogRef.close('refresh');
    }, error => {

    });
  }

  onUpdate(restaurantFormDTO: RestaurantFormDTO) {
    this.kitchenService.updateRestaurantName(restaurantFormDTO.restaurantName,restaurantFormDTO.restaurantId).subscribe(() => this.dialogRef.close('refresh'))
  }

  onDeleteTable(tableId:number){
    this.kitchenService.deleteTable(tableId,this.data.restaurantId).subscribe(() => this.refreshTables(tableId));
  }

  refreshTables(tableId:number){
    this.data.restaurentTablesDTO = this.data.restaurentTablesDTO.filter((table) =>{
      return table.id != tableId;
    })
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
}
