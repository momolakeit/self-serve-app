import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductDTO } from '../../models/product-dto'
import { ProductService } from '../../services/product.service';
import { BillService } from '../../services/bill.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MenuType } from 'src/app/models/menu-type.enum';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent implements OnInit {

  requestProductList: ProductDTO[]
  imgUrl: string;
  waiterCallProduct: any;
  durationInSeconds: number = 5;

  constructor(private translate: TranslateService, private productService: ProductService, private billService: BillService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath;
    this.findAllWaiterRequest();
  }

  openSnackBar() {
    this.translate.get('waiter.waiterComing').subscribe(res => {
      this._snackBar.open(res, 'close', {
        duration: this.durationInSeconds * 1000,
      });
    })
  }

  findAllWaiterRequest() {
    this.productService.findAllWaiterRequestProduct(JSON.parse(localStorage.getItem('restaurantId'))).subscribe(data => {
      this.waiterCallProduct = data.products.find(product => product.menuType == MenuType.WAITERCALL);

      this.requestProductList = data.products.filter(prod => (prod.menuType != MenuType.TERMINALREQUEST && prod.menuType != MenuType.WAITERCALL));

    });
  }

  ngOnChanges(): void {
    this.imgUrl = environment.baseImgPath;

    this.findAllWaiterRequest();

    this.waiterCallProduct = this.requestProductList.filter(product => product.menuType == MenuType.WAITERCALL);
  }

  sendClientRequest(productDTO: ProductDTO) {
    this.billService.makeOrder(productDTO, "").subscribe(data => {
      localStorage.setItem("ongoingBill", JSON.stringify(data))
      this.openSnackBar();
    });
  }
}
