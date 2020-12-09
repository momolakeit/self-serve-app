import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductDTO } from '../../models/product-dto'
import { ProductService } from '../../services/product.service';
import { BillService } from '../../services/bill.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent implements OnInit {

  requestProductList: [ProductDTO]
  imgUrl: string;
  waiterCallProduct: any;
  durationInSeconds: number = 5;

  constructor(private translate: TranslateService,private productService: ProductService, private billService: BillService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath;

    this.productService.findAllWaiterRequestProduct(JSON.parse(localStorage.getItem('restaurantId'))).subscribe(data => {

      this.requestProductList = data.products;

      this.waiterCallProduct = this.requestProductList.find(product => product.menuType.toString() == "WAITERCALL");
    });

  }

  openSnackBar() {
    this.translate.get('waiter.waiterComing').subscribe(res =>{
      this._snackBar.open(res, 'close', {
        duration: this.durationInSeconds * 1000,
      });      
    })
  }

  ngOnChanges(): void {
    this.imgUrl = environment.baseImgPath;

    this.productService.findAllWaiterRequestProduct(1).subscribe(data => {
      this.requestProductList = data.products;
    });

    this.waiterCallProduct = this.requestProductList.filter(product => {
      product.menuType.toString() == "WAITERCALL";
    })
  }

  sendClientRequest(productDTO: ProductDTO) {
    this.billService.makeOrder(productDTO, "").subscribe(data => {
      localStorage.setItem("ongoingBill", JSON.stringify(data))
      this.openSnackBar();
    });
  }
}
