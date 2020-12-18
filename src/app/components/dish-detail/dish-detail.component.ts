import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProductDTO } from '../../models/product-dto';
import { BillService } from '../../services/bill.service';
import { CheckItemDTO } from '../../models/check-item-dto'
import { OptionDTO } from '../../models/option-dto'
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.css']
})
export class DishDetailComponent implements OnInit {
  imgUrl: string;
  commentaire: string = "";
  commentaireCharacterLimit : number = 60;
  itemOrdered= false;

  constructor(private translate: TranslateService,public dialogRef: MatDialogRef<DishDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: ProductDTO, private billService: BillService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath + this.data.imgFileDTO.id;
  }

  updateCurrentBill = (product: ProductDTO) => {
    this.itemOrdered = true;
    this.billService.makeOrder(product, this.commentaire).subscribe(data => {
      localStorage.setItem("ongoingBill", JSON.stringify(data));
      this.openSnackBar();
      this.onNoClick();
    });
  };

  openSnackBar() {
    this.translate.get("dishDetail.itemOrderd").subscribe(res =>{
      this.snackBar.open(res, "Close", {
        duration: 2000,
      });      
    })

    this.snackBar._openedSnackBarRef.onAction().subscribe(() =>{
      this.snackBar.dismiss();
    })
  }

  updateOptionCheckItem (checkItemDTO: CheckItemDTO, optionDTO: OptionDTO){
    var currentOption = this.data.options.find(x => x.id == optionDTO.id);

    currentOption.checkItemList.forEach(element => {
      element.isActive = false;
    });

    var currentCheckItem = currentOption.checkItemList.find(x => x.id == checkItemDTO.id);
    currentCheckItem.isActive = true;
  };
  updateCheckItem(checkItemDTO: CheckItemDTO) {
    var checkItem = this.data.checkItems.find(x => x.id == checkItemDTO.id);
    checkItem.isActive = true;
  };
  

  onNoClick() {
    this.dialogRef.close('close');
  }

}
