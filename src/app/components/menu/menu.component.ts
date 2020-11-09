import { Component, OnInit } from '@angular/core';
import { MenuDTO } from 'src/app/models/menu-dto';
import { MenuService } from '../../services/menu.service'
import { ProductDTO } from '../../models/product-dto';
import { environment } from '../../../environments/environment';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { BillService } from '../../services/bill.service'
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  menu: MenuDTO;
  productToSeeDetail: ProductDTO;
  listeUrlImagesSpeciaux = [];
  panelOpenState: boolean
  listeUrlImagesFeatured = [String];
  hasMenuId: boolean;

  slides = [{ 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }];



  constructor(private menuService: MenuService, private billService: BillService) { }

  ngOnInit(): void {
    if (localStorage.getItem('menuId') == null) {
      this.hasMenuId = false;
    }
    else {
      this.hasMenuId = true;
      this.initBill();
      this.fetchMenu();
    }
  }
  changeProductToSeeDetail = function (product: ProductDTO): void {
    this.productToSeeDetail = product;
  };
  fetchMenu() {
    this.menuService.getMenuById().subscribe(data => {
      this.menu = data;
      console.log(this.menu);
      this.menu.speciaux.forEach(element => this.listeUrlImagesSpeciaux.push(environment.baseImgPath + element.imgFileDTO.id));
      console.log(this.listeUrlImagesSpeciaux);
    })
  }
  initBill() {
    if (localStorage.getItem("ongoingBill") == null) {
      this.billService.initBill().subscribe(data => {
        localStorage.setItem("ongoingBill", JSON.stringify(data));
      });
    }
  }
}
