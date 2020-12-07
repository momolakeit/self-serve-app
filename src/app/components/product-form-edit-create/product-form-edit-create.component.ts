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
import { ProductType } from 'src/app/models/product-type.enum';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form-edit-create',
  templateUrl: './product-form-edit-create.component.html',
  styleUrls: ['./product-form-edit-create.component.css']
})
export class ProductFormEditCreateComponent implements OnInit {

  menuId: number = parseInt(localStorage.getItem("menuId"));
  productForm: FormGroup;
  isHidden: boolean = false;
  title: string;
  productTypes: string[] = Object.keys(ProductType);
  productMenuTypes: string[] = Object.keys(ProductMenuType);
  isButtonLoading: boolean = false;

  //file setup 
  disabled: boolean = false;
  multiple: boolean = false;
  maxSize: number = 1024;
  accept: string = "image/*";

  constructor(public dialogRef: MatDialogRef<ProductFormEditCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: ProductDTO, private productService: ProductService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  //INITS

  initForm() {
    this.productForm = this.formBuilder.group({
      id: [this.data ? this.data.id : ''],
      name: [this.data ? this.data.name : '', Validators.required],
      description: [this.data ? this.data.description : '', Validators.required],
      prix: [this.data ? this.data.prix : '', Validators.required],
      tempsDePreparation: [this.data ? this.data.tempsDePreparation : '', Validators.required],
      image: ['', [MaxSizeValidator(this.maxSize * 1024)]],
      options: this.formBuilder.array([]),
      addons: this.formBuilder.array([])
    });


    //set up options based on data presence
    if (this.data){
      this.initOptions();
      this.initAddOns();
    }

    this.title = this.data ? 'Product update' : 'Product creation';
  }

  initAddOns(){
    this.data.checkItems.forEach(checkItemElem => {
      const checkItem = new FormGroup({
        id: new FormControl(checkItemElem.id),
        checkItemName: new FormControl(checkItemElem.name, Validators.required),
        price: new FormControl(checkItemElem.prix,Validators.required)
      })
  
      this.getAddOns().push(checkItem);
    });
  }

  initOptions() {
    // bind option list to option form array
    for (let index = 0; index < this.data.options.length; index++) {

      const element: OptionDTO = this.data.options[index];

      const option: FormGroup = new FormGroup({
        id: new FormControl(element.id),
        optionName: new FormControl(element.name, Validators.required),
        checkItems: this.formBuilder.array([new FormGroup({
          checkItemName: new FormControl('', Validators.required)
        })])
      });


      this.getOptions().push(option);

      //build checkitem const 
      for (let j = 0; j < element.checkItemList.length; j++) {
        const checkItem: CheckItemDTO = element.checkItemList[j];

        const group = new FormGroup({
          id: new FormControl(checkItem.id),
          checkItemName: new FormControl(checkItem.name, Validators.required)
        })

        if (j == 0)
          this.getCheckItems(index).removeAt(0);

        this.getCheckItems(index).push(group);
      }

    }
  }

  //SERVICES

  onSubmitForm() {
    if (this.productForm.valid) {

      const formValue = this.productForm.value;

      const product: ProductDTO = {
        id: formValue['id'],
        name: formValue['name'],
        description: formValue['description'],
        options: this.getOptionDtoList(),
        prix: formValue['prix'],
        tempsDePreparation: formValue['tempsDePreparation'],
        menuType: formValue['productType'],
        productMenuType: formValue['productMenuType'],
        imgFileDTO: this.data ? this.data.imgFileDTO : null,
        checkItems: this.getAddonList()
      }

      this.isButtonLoading = true;
      if (this.data)
        this.onUpdateProduct(product);
      else this.onCreateProduct(product);

    }
  }

  onCreateProduct(product: ProductDTO) {
    this.productService.create(product, this.menuId).subscribe((data) => this.onUploadImage(data.id));
  }

  onUpdateProduct(product: ProductDTO) {
    this.productService.update(product).subscribe(() => this.onUploadImage(product.id));
  }

  onUploadImage(productId: number) {
    const file_form: FileInput = this.productForm.get('image').value;
    const file = file_form.files == undefined ? undefined : file_form.files[0];

    const formData: FormData = new FormData();
    formData.append('file', file);

    if (file != undefined)
      this.productService.saveProductImage(formData, productId).subscribe(() => this.dialogRef.close('refresh'));
    else{
      this.dialogRef.close('refresh');
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  //ALL ABOUT THE OPTIONS

  //create

  onAddOption() {
    const option = new FormGroup({
      id: new FormControl(null),
      optionName: new FormControl('', Validators.required),
      checkItems: this.formBuilder.array([new FormGroup({
        checkItemName: new FormControl('', Validators.required)
      })])
    });

    this.getOptions().push(option);
  }

  onAddCheckItem() {
    const checkItem = new FormGroup({
      id: new FormControl(null),
      checkItemName: new FormControl('', Validators.required),
      price: new FormControl('',Validators.required)
    })

    this.getAddOns().push(checkItem);
  }

  //get

  getCheckItems(id: number) {
    return this.getOptions().at(id).get('checkItems') as FormArray;
  }

  getOptions() {
    return this.productForm.get('options') as FormArray;
  }

  getAddOns() {
    return this.productForm.get('addons') as FormArray;
  }


  getOptionDtoList():OptionDTO[] {

    var options: any[] = [];

    for (let index = 0; index < this.getOptions().length; index++) {
      var optionValue = this.getOptions().at(index);

      //add option name
      var option: OptionDTO = {
        id: optionValue.get('id') ? optionValue.get('id').value : null,
        name: optionValue.get('optionName').value,
        checkItemList: []
      };

      //add option checkItemList  by looping
      for (let index2 = 0; index2 < this.getCheckItems(index).length; index2++) {
        const checkItemValue = this.getCheckItems(index).at(index2).value;

        var checkItem: CheckItemDTO = {
          id:  checkItemValue.id ? checkItemValue.id : null,
          name: checkItemValue.checkItemName,
          option: null,
          isActive: null
        }

        option.checkItemList.push(checkItem);
      }

      options.push(option);
    }

    return options;
  }

  getAddonList():CheckItemDTO[]{
    var checkItems: CheckItemDTO[] = [];

    for (let index = 0; index < this.getAddOns().length; index++) {
      const element = this.getAddOns().at(index);

      var checkItem: CheckItemDTO = {
        id: element.get('id') ? element.get('id').value : null,
        name: element.get('checkItemName').value,
        prix: element.get('price').value,
        option: null,
        isActive: null
      }

      checkItems.push(checkItem);
    }

    return checkItems;
  }

  //delete
  deleteCheckItem(optionId: number, checkItemId: number) {
    this.getCheckItems(optionId).removeAt(checkItemId);
  }

  deleteOption(optionId: number) {
    this.getOptions().removeAt(optionId);
  }

  deleteAddon(addonId:number){
    this.getAddOns().removeAt(addonId);
  }

}
