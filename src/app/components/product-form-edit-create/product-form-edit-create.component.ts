import { MaxSizeValidator } from '@angular-material-components/file-input';
import { error } from '@angular/compiler/src/util';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  disabled: boolean = false;
  isHidden: boolean = false;
  multiple: boolean = false;
  options: OptionDTO[] = [];
  files: any;
  maxSize: number = 10;
  title:string;
  productTypes:string[] = Object.keys(ProductType);
  productMenuTypes:string[] = Object.keys(ProductMenuType);


  constructor(public dialogRef: MatDialogRef<ProductFormEditCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: ProductDTO, private productService: ProductService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    console.log(this.data);
    
  }

  //INITS
  initForm() {
    this.productForm = this.formBuilder.group({
      id:[this.data? this.data.id : ''],
      name: [this.data? this.data.name : '', Validators.required],
      description: [this.data? this.data.description : '', Validators.required],
      prix: [this.data? this.data.prix : '', Validators.required],
      tempsDePreparation: [this.data? this.data.tempsDePreparation : '', Validators.required],
      productType: [this.data? this.data.productType : '', Validators.required],
      productMenuType: [this.data? this.data.productMenuType : '', Validators.required],
      image: [this.files, [MaxSizeValidator(this.maxSize * 1024)]],
      options: this.formBuilder.array([])
    });


    //set up options based on data presence
    if (this.data) 
      this.initOptions();

    this.title = this.data? 'Product update' : 'Product creation';
    

    //make sure to listen to image change
    this.productForm.get('image').valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files))
        this.files = [files];
      else this.files = files;

      console.log(this.files);
    })
  }

  initOptions() {
    // bind option list to option form array
    for (let index = 0; index < this.data.options.length; index++) {

      const element: OptionDTO = this.data.options[index];
      const option: FormGroup = new FormGroup({
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
          checkItemName: new FormControl(checkItem.name, Validators.required)
        })

        if (j == 0)
          this.getCheckItems(index).removeAt(0);

        this.getCheckItems(index).push(group);
      }

    }
  }

  //SERVICES

  onSubmitForm(){
    if (this.productForm.valid) {
      
      this.updateOptionDtoList();

      const formValue = this.productForm.value;

      const product: ProductDTO = {
        id: formValue['id'],
        name: formValue['name'],
        description: formValue['description'],
        options: this.options,
        prix: formValue['prix'],
        tempsDePreparation: formValue['tempsDePreparation'],
        productType: formValue['productType'],
        productMenuType: formValue['productMenuType']
      }
      

      console.log('Mes options: ' + this.options);
      
      if (this.data) 
        this.onUpdateProduct(product);
      else this.onCreateProduct(product);

      this.dialogRef.close('refresh');
    }
  }

  onCreateProduct(product: ProductDTO) {
    this.productService.create(product, this.menuId).subscribe((product) => {

      //sauvegarder l'image
      //this.onSaveImage(product);
    }, error => {
      console.log(error);
    });
  }

  onUpdateProduct(product: ProductDTO) {
    this.productService.update(product).subscribe(() =>{
      //resave l'image si elle a changer

    },error =>{
      console.log(error);
      
    })
  }

  onSaveImage(product: ProductDTO) {
     //recuperer limage
     const file = this.productForm.get('image').value;
     console.log(file);

     const formData = new FormData();
     formData.append('file', file);
    this.productService.saveProductImage(formData, product).subscribe(() => {

    }, error => {
      console.log(error);
    });
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  //OPTIONS HANDLING
  //create

  onAddOption() {
    const option = new FormGroup({
      optionName: new FormControl('', Validators.required),
      checkItems: this.formBuilder.array([new FormGroup({
        checkItemName: new FormControl('', Validators.required)
      })])
    });

    this.getOptions().push(option);
  }

  onAddCheckItem(id: number) {
    const group = new FormGroup({
      checkItemName: new FormControl('', Validators.required)
    })
    this.getCheckItems(id).push(group);
  }

  //get

  getCheckItems(id: number) {
    return this.getOptions().at(id).get('checkItems') as FormArray;
  }

  getOptions() {
    return this.productForm.get('options') as FormArray;
  }


  //update
  updateOptionDtoList() {

    var options: any[] = [];

    for (let index = 0; index < this.getOptions().length; index++) {

      //add option name
      var option: OptionDTO = {
        name: this.getOptions().at(index).get('optionName').value,
        checkItemList: <CheckItemDTO[]>[]
      };

      //add option checkItemList  by looping
      for (let index2 = 0; index2 < this.getCheckItems(index).length; index2++) {

        var name = this.getCheckItems(index).at(index2).value;

        if (option.checkItemList.length > 1)
          option.checkItemList.push(name);
        else
          option.checkItemList[0] = name;

      }

      options.push(option);
    }

    this.options = options;
  }

  //delete
  deleteCheckItem(optionId: number, checkItemId: number) {
    this.getCheckItems(optionId).removeAt(checkItemId);
  }

  deleteOption(optionId: number) {
    this.getOptions().removeAt(optionId);
  }

}
