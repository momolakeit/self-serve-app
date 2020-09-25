import { MaxSizeValidator, NgxMatFileInputComponent } from '@angular-material-components/file-input';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckItemDTO } from 'src/app/models/check-item-dto';
import { OptionDTO } from 'src/app/models/option-dto';
import { ProductDTO } from 'src/app/models/product-dto';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-creation-form',
  templateUrl: './product-creation-form.component.html',
  styleUrls: ['./product-creation-form.component.css']
})
export class ProductCreationFormComponent implements OnInit {
  @Input() menuId: number;
  productCreationForm: FormGroup;
  panelOpenState: boolean = false;
  disabled: boolean = false;
  isHidden: boolean = false;
  multiple: boolean = false;
  options: OptionDTO[] = [];
  files: any;
  maxSize: number = 10;

  constructor(private productService: ProductService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  //FORM CREATION

  initForm() {
    this.productCreationForm = this.formBuilder.group({
      name: ['sdfsd', Validators.required],
      description: ['ssdfds', Validators.required],
      prix: ['45', Validators.required],
      tempsDePreparation: ['45', Validators.required],
      productType: ['WAITERREQUEST', Validators.required],
      productMenuType: ['SOUPER', Validators.required],
      image: [this.files, [MaxSizeValidator(this.maxSize * 1024)]],
      options: this.formBuilder.array([new FormGroup({
        optionName: new FormControl('dfgd', Validators.required),
        checkItems: this.formBuilder.array([new FormGroup({
          checkItemName: new FormControl('12312', Validators.required)
        })])
      })])
    });

    //make sure to listen to image change
    this.productCreationForm.get('image').valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files))
        this.files = [files];
      else this.files = files;

      console.log(this.files);
    })

  }

  //FORM SUBMIT

  onSubmitForm() {
    if (this.productCreationForm.valid) {

      this.updateOptionDtoList();

      const formValue = this.productCreationForm.value;

      const product: ProductDTO = {
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
      this.productService.create(product, this.menuId).subscribe((product) => {
        
        //recuperer limage
        const file = this.productCreationForm.get('image').value;
        const formData = new FormData();
        formData.append('file', file); 
        console.log(formData);
        console.log(file);
        
        
        //faire le http request
        this.productService.saveProductImage(formData,product).subscribe();

        // find solution for location reload
        //location.reload();
        // this.refreshWholePage.emit();
      }, error => {
        //handle error
      });

    }
  }

  //SERVICES

  //CREATE

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
    return this.productCreationForm.get('options') as FormArray;
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

  //DELETE

  deleteCheckItem(optionId: number, checkItemId: number) {
    this.getCheckItems(optionId).removeAt(checkItemId);
  }

  deleteOption(optionId: number) {
    this.getOptions().removeAt(optionId);
  }
}
