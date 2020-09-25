import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckItemDTO } from 'src/app/models/check-item-dto';
import { OptionDTO } from 'src/app/models/option-dto';
import { ProductDTO } from 'src/app/models/product-dto';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  @Input() product: ProductDTO;
  @Input() menuId: number;
  @Output() refreshCurrentProduct = new EventEmitter<ProductDTO>();
  @Output() refreshProductList = new EventEmitter<number>();
  @Output() refreshWholePage = new EventEmitter<number>();
  productForm: FormGroup;
  panelOpenState: boolean = false;
  disabled: boolean = false;
  isHidden: boolean = false;
  multiple: boolean = false;
  options: OptionDTO[] = [];
  files: any;
  maxSize: number = 6;


  constructor(private productService: ProductService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy() {
    console.log('Items destroyed');
  }

  //CREATE FORMS
  initForm() {
    this.productForm = this.formBuilder.group({
      id: [this.product.id],
      name: [this.product.name, Validators.required],
      description: [this.product.description, Validators.required],
      prix: [this.product.prix, Validators.required],
      tempsDePreparation: [this.product.tempsDePreparation, Validators.required],
      productType: [this.product.productType, Validators.required],
      productMenuType: [this.product.productMenuType, Validators.required],
      image: [this.files, [MaxSizeValidator(this.maxSize * 1024)]],
      options: this.formBuilder.array([new FormGroup({
        optionName: new FormControl('', Validators.required),

        checkItems: this.formBuilder.array([new FormGroup({
          checkItemName: new FormControl('', Validators.required)
        })])
      })])
    });

    //make sure to listen to image change
    this.productForm.get('image').valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files))
        this.files = [files];
      else this.files = files;

      console.log(this.files);
    })
    
    console.log(this.product);
    
  }

  //init options

  //ARRAY SERVICES (CRUD)

  //CREATE
  initOptions(){
    // bind option list to option form array
  }


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


  //RESEARCH

  getCheckItems(id: number) {
    return this.getOptions().at(id).get('checkItems') as FormArray;
  }

  getOptions() {
    return this.productForm.get('options') as FormArray;
  }

  //DELETE

  deleteCheckItem(optionId: number, checkItemId: number) {
    this.getCheckItems(optionId).removeAt(checkItemId);
  }

  deleteOption(optionId: number) {
    this.getOptions().removeAt(optionId);
  }


  //UPDATE
  //ce code est a refactor
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

    console.log(this.options);
  }

  // VALIDATE FORMS THEN SUBMIT IT
  onSubmitForm() {
    if (this.productForm.valid) {

      this.updateOptionDtoList();

      const formValue = this.productForm.value;

      const product: ProductDTO = {
        id: formValue['id'],
        name: formValue['name'],
        description: formValue['description'],
        options: this.options,
        prix: formValue['prix'],
        tempsDePreparation: formValue['tempsDepreparation'],
        productType: formValue['productType'],
        productMenuType: formValue['productMenuType']
      }

      console.log('le produit que je mapprete a log');
      console.log(product);
      
      
      //make request to save data or update data depending on product dto 
      this.productService.update(product).subscribe(() => {
        this.updateProduct();
        // find solution for location reload
        location.reload();
        this.refreshWholePage.emit();
      },error =>{
        //handle error
      });

    }
  }



  updateProduct() {
    this.refreshCurrentProduct.emit(null);
  }
}
