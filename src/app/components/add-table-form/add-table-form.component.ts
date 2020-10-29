import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { KitchenService } from 'src/app/services/kitchen.service';

@Component({
  selector: 'app-add-table-form',
  templateUrl: './add-table-form.component.html',
  styleUrls: ['./add-table-form.component.css']
})
export class AddTableFormComponent implements OnInit {

  tableNumber: FormControl;

  constructor(private kitchenService: KitchenService,public dialogRef: MatDialogRef<AddTableFormComponent>,@Inject(MAT_DIALOG_DATA) public data: RestaurantSelectionDTO) { }

  ngOnInit(): void {
    this.tableNumber = new FormControl('',Validators.required);
  }

  onCreateTable(){
    if (this.tableNumber.valid) 
      this.kitchenService.addRestaurantTable(this.data.restaurantId,this.tableNumber.value).subscribe(() => this.dialogRef.close('refresh'));
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
}
