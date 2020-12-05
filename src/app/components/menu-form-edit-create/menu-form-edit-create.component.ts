import { MaxSizeValidator } from '@angular-material-components/file-input';
import { error } from '@angular/compiler/src/util';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileInput } from 'ngx-material-file-input';
import { CheckItemDTO } from 'src/app/models/check-item-dto';
import { OptionDTO } from 'src/app/models/option-dto';
import { ProductDTO } from 'src/app/models/product-dto';
import { ProductMenuType } from 'src/app/models/product-menu-type.enum';
import { MenuType } from 'src/app/models/menu-type.enum';
import { MenuService } from 'src/app/services/menu.service';
import {MenuDTO} from 'src/app/models/menu-dto';
@Component({
  selector: 'app-menu-form-edit-create',
  templateUrl: './menu-form-edit-create.component.html',
  styleUrls: ['./menu-form-edit-create.component.css']
})
export class MenuFormEditCreateComponent implements OnInit {
  restaurantId: number = parseInt(localStorage.getItem("restaurantId"));
  menuForm: FormGroup;
  isHidden: boolean = false;
  title: string;
  menuTypes: string[] = Object.keys(MenuType);
  isButtonLoading: boolean = false;


  constructor(public dialogRef: MatDialogRef<MenuFormEditCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: MenuDTO, private menuService: MenuService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  //INITS

  initForm() {
    this.menuForm = this.formBuilder.group({
      id: [this.data ? this.data.id : ''],
      name: [this.data ? this.data.name : '', Validators.required],
      menuType: [this.data ? this.data.menuType : '', Validators.required]
    });
    this.menuService.onMenuCreatedEvent.emit
  }
   //SERVICES

   onSubmitForm() {
    if (this.menuForm.valid) {

      const formValue = this.menuForm.value;

      const menu: MenuDTO = {
        id: formValue['id'],
        name: formValue['name'],
        menuType: formValue['menuType'],
        products: null,
        restaurant:null
      }

      this.isButtonLoading = true;
      if (this.data)
      {
        this.onUpdateMenu(menu);
      }
      else{
        this.onCreateMenu(menu);
      }

    }
  }
  onCreateMenu(menu: MenuDTO) {
    this.menuService.createMenu(menu.name, this.restaurantId,menu.menuType).subscribe((data)=>{
      this.menuService.onMenuCreatedEvent.emit("menuCreated");
      this.onNoClick()
    });
  }
  
  onUpdateMenu(menu: MenuDTO) {
    this.menuService.updateMenu(menu.id,menu.name,menu.menuType).subscribe(()=>{
      this.menuService.onMenuCreatedEvent.emit("menuCreated");
      this.onNoClick();
    });
  }
  onNoClick(){
    this.dialogRef.close();
  }

}
