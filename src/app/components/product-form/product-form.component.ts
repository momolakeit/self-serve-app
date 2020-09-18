import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private productService: ProductService, private formBuiler: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
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
      options: this.formBuiler.array([new FormGroup({
        optionName: new FormControl('', Validators.required),
        checkItems:  this.formBuiler.array([new FormGroup({
          checkItemName : new FormControl('',Validators.required)
        })])
      })])
    });
  }

  onAddOption() {
    const option = new FormGroup({
      optionName: new FormControl('', Validators.required),
        checkItems:  this.formBuiler.array([new FormGroup({
          checkItemName : new FormControl('',Validators.required)
        })])
    })

    this.getOptions().push(option);
  }

  onAddCheckItem() {
    const checkItem = new FormControl('',Validators.required);
    this.getCheckItems().push(checkItem);
  }

  getCheckItems(){
    return this.getOptions().at(0).get('checkItems') as FormArray;
  }


  getOptions() {
    return this.productForm.get('options') as FormArray;
  }

  //create an observable for the array

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
