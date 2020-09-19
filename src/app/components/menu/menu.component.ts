import { Component, OnInit } from '@angular/core';
import { MenuDTO } from 'src/app/models/menu-dto';
import {MenuService} from '../../services/menu.service'
import {ProductDTO} from '../../models/product-dto'
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  menu: MenuDTO;
  productToSeeDetail :ProductDTO

  constructor(private menuService :MenuService) { }

  ngOnInit(): void {
    if(localStorage.getItem("ongoingBill")==null){
      localStorage.setItem("ongoingBill",JSON.stringify({prixTotal :null,id :null ,date :null,billStatus: null,orderCustomer:null,orderItems :null, restaurant :null}));  
      console.log(localStorage.getItem("ongoingBill"))
    }
    this.menuService.getMenuById().subscribe(data =>{
      this.menu=data;
      console.log(this.menu);
    })
  }
  changeProductToSeeDetail = function (product :ProductDTO): void {
    this.productToSeeDetail =product;
  };
}
