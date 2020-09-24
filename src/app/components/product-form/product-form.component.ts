import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Input, OnInit } from '@angular/core';
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
export class ProductFormComponent implements OnInit {

  @Input() product: ProductDTO;
  @Input() menuId: number;
  productForm: FormGroup;
  panelOpenState: boolean = false;
  disabled: boolean = false;
  multiple: boolean = false;
  options: [OptionDTO];
  files: any;
  maxSize: number = 6;


  constructor(private productService: ProductService, private formBuiler: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    //find all products from user
  }


  //CREATE FORMS
  initForm() {
    this.productForm = this.formBuiler.group({
      id: [this.product == null ? '' : this.product.id],
      name: [this.product == null ? '' : this.product.name, Validators.required],
      description: [this.product == null ? '' : this.product.description, Validators.required],
      prix: [this.product == null ? '' : this.product.prix, Validators.required],
      tempsDePreparation: [this.product == null ? '' : this.product.tempsDePreparation, Validators.required],
      productType: [this.product == null ? '' : this.product.productType, Validators.required],
      image: [this.files, [Validators.required, MaxSizeValidator(this.maxSize * 1024)]],
      options: this.formBuiler.array([new FormGroup({
        optionName: new FormControl('', Validators.required),

        checkItems: this.formBuiler.array([new FormGroup({
          checkItemName: new FormControl('', Validators.required)
        })])
      })])
    });

    this.productForm.get('image').valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files))
        this.files = [files];
      else this.files = files;

      console.log(this.files);
    })

    console.log(this.getOptions());
    console.log(this.getCheckItems(0));
  }

  //ARRAY SERVICES (CRUD)

  //CREATE
  onAddOption() {
    const option = new FormGroup({
      optionName: new FormControl('', Validators.required),
      checkItems: this.formBuiler.array([new FormGroup({
        checkItemName: new FormControl('', Validators.required)
      })])
    });

    this.getOptions().push(option);
    this.updateOptionDtoList();
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



  //create an observable for the array
  updateOptionDtoList() {
    for (let index = 0; index < this.getOptions().length; index++) {
      console.log('log la stupiditer');

      console.log(this.getCheckItems(0).at(0).value);

      //add option name
      var option: OptionDTO = {
        name: this.getOptions().at(index).get('optionName').value,
        checkItemList: <CheckItemDTO[]>[]
      };

      //add option checkItemList  by looping
      for (let index2 = 0; index2 < this.getCheckItems(index2).length; index2++) {
        option.checkItemList[index2].name = this.getCheckItems(index).at(index2).value;
      }

      this.options.push(option);
    }

    console.log(this.options);
  }

  // VALIDATE FORMS THEN SUBMIT IT
  onSubmitForm() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      const product: ProductDTO = {
        name: formValue['name'],
        description: formValue['description'],
        prix: formValue['prix'],
        tempsDePreparation: formValue['tempsDepreparation'],
        productType: formValue['productType'],
        options: formValue['options']
      }

      //make request to save data or update data depending on product dto 

      if (this.product)
        this.productService.update(product).subscribe();
      else
        this.productService.create(product, this.menuId).subscribe();

    }
  }

}
