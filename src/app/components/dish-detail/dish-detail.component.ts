import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProductDTO } from '../../models/product-dto';
import { BillService } from '../../services/bill.service';
import { CheckItemDTO } from '../../models/check-item-dto'
import { OptionDTO } from '../../models/option-dto'
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.css']
})
export class DishDetailComponent implements OnInit {
  imgUrl: string;
  commentaire: string = "";

  constructor(public dialogRef: MatDialogRef<DishDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: ProductDTO, private billService: BillService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath + this.data.imgFileDTO.id;
  }

  updateCurrentBill = (product: ProductDTO) => {
    this.billService.makeOrder(product, this.commentaire).subscribe(data => {
      localStorage.setItem("ongoingBill", JSON.stringify(data));
      this.openSnackBar();
      this.onNoClick();
    });
  };

  openSnackBar() {
    this.snackBar.open("Item ordered", "Close", {
      duration: 2000,
    });
  }

  updateCheckItem = function (checkItemDTO: CheckItemDTO, optionDTO: OptionDTO): void {
    var currentOption = this.data.options.find(x => x.id == optionDTO.id);

    currentOption.checkItemList.forEach(element => {
      element.isActive = false;
    });

    var currentCheckItem = currentOption.checkItemList.find(x => x.id == checkItemDTO.id);
    currentCheckItem.isActive = true;
  };

  onNoClick() {
    this.dialogRef.close('close');
  }

}
