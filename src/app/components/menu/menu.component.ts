import { Component, OnInit } from '@angular/core';
import { MenuDTO } from 'src/app/models/menu-dto';
import { MenuService } from '../../services/menu.service'
import { ProductDTO } from '../../models/product-dto';
import { environment } from '../../../environments/environment';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { DishDetailComponent } from '../dish-detail/dish-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { BillService } from '../../services/bill.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  menu: MenuDTO;
  listeUrlImagesSpeciaux = [];
  panelOpenState: boolean
  listeUrlImagesFeatured = [String];
  productToSeeDetail: ProductDTO;
  hasMenuId: boolean;

  slides = [{ 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }];

  constructor(private menuService: MenuService,public dialog: MatDialog, private billService: BillService) { }

  ngOnInit() {
    //not clean init should only call methods
    if (localStorage.getItem('menuId') == null) {
      this.hasMenuId = false;
    }
    else {
      this.hasMenuId = true;
      this.initBill();
      this.fetchMenu();
    }
  }

  getImage(imageId: number): string {
    return environment.baseImgPath + imageId;
  }

  // ALL ABOUT THE DIALOG

  openDialog(productDTO:ProductDTO) {
    const dialogRef = this.dialog.open(DishDetailComponent, {
      autoFocus:false,
      data: productDTO
    });
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
  scanSuccessHandler($event: any){
    window.location.href = $event;

  }
}
