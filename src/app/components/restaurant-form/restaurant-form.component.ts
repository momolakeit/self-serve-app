import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { RestaurantFormDTO } from 'src/app/models/restaurant-form-dto';
import { KitchenService } from 'src/app/services/kitchen.service';
import { AddTableFormComponent } from '../add-table-form/add-table-form.component';
import { MenuService } from 'src/app/services/menu.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {
  title: string;
  restaurantForm: FormGroup;

  constructor(private menuService:MenuService,public dialog: MatDialog,public dialogRef: MatDialogRef<RestaurantFormComponent>, @Inject(MAT_DIALOG_DATA) public data: RestaurantSelectionDTO, private formBuilder: FormBuilder, private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.initForm();
  }

  // ALL ABOUT THE FORM

  initForm() {
    this.restaurantForm = this.formBuilder.group({
      name: [this.data ? this.data.restaurantName : '', Validators.required],
      tableAmount: [this.data ? this.data.restaurentTablesDTO.length : '', Validators.required]
    })

    this.title = this.data ? 'Restaurant update' : 'Restaurant creation';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTableFormComponent, {
      width: '500px',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'refresh') 
        this.refreshRestaurant();
      
    });
  }

  onSubmitForm() {
    if (this.restaurantForm.valid) {

      const formValues = this.restaurantForm.value;

      const restaurantFormDTO: RestaurantFormDTO = {
        restaurantId: this.data ? this.data.restaurantId : null,
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

  // SERVICES

  onCreate(restaurantFormDTO: RestaurantFormDTO) {
    this.kitchenService.createRestaurant(restaurantFormDTO).subscribe(() => this.dialogRef.close('refresh'));
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

  refreshRestaurant(){
    this.menuService.getAllRestaurantName().subscribe(data =>{
       this.data = data.find((restaurantSelection) => {
         return restaurantSelection.restaurantId == this.data.restaurantId
        });
    });
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
}
