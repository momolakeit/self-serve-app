import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {ProductDTO} from '../../models/product-dto'
import {ProductService} from '../../services/product.service';
import {BillService} from '../../services/bill.service'

@Component({
  selector: 'app-waiter',
  templateUrl: './waiter.component.html',
  styleUrls: ['./waiter.component.css']
})
export class WaiterComponent implements OnInit {

  constructor(private productService:ProductService,private billService:BillService) { }
  requestProductList:[ProductDTO]
  imgUrl : string;
  waiterCallProduct 
  
  ngOnInit(): void {
    this.imgUrl = environment.baseImgPath;
    console.log("***************");
    console.log(this.imgUrl);
    this.productService.findAllWaiterRequestProduct(1).subscribe(data =>{
      this.requestProductList = data;
      this.waiterCallProduct =  this.requestProductList.find(product =>{
        if(product.productType.toString() =="WAITERCALL"){
          return true;
        }
      })
      console.log(this.requestProductList);
      console.log(this.waiterCallProduct);
    });

  }

  ngOnChanges() :void {
    this.imgUrl = environment.baseImgPath;
    console.log("***************");
    console.log(this.imgUrl);
    this.productService.findAllWaiterRequestProduct(1).subscribe(data =>{
      this.requestProductList = data;
    });
    this.waiterCallProduct =  this.requestProductList.filter(product =>{
      product.productType.toString() =="WAITERCALL";
    })
  }
  sendClientRequest = function(productDTO:ProductDTO){
    this.billService.makeOrder(productDTO,"").subscribe(data => 
      localStorage.setItem("ongoingBill",JSON.stringify(data)));

  }
}
