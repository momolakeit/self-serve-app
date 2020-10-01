import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RestaurantFormComponent>,@Inject(MAT_DIALOG_DATA) public data: RestaurantSelectionDTO,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log(this.data);
    
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
}
