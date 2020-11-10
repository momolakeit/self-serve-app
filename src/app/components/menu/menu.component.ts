import { Component, OnInit } from '@angular/core';
import { MenuDTO } from 'src/app/models/menu-dto';
import { MenuService } from '../../services/menu.service'
import { ProductDTO } from '../../models/product-dto';
import { environment } from '../../../environments/environment';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
import { DishDetailComponent } from '../dish-detail/dish-detail.component';
import { MatDialog } from '@angular/material/dialog';
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

  slides = [{ 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }, { 'image': 'https://gsr.dev/material2-carousel/assets/demo.png' }];

  constructor(private menuService: MenuService,public dialog: MatDialog) { }

  ngOnInit() {
    //not clean init should only call methods
    if (localStorage.getItem("ongoingBill") == null) {
      localStorage.setItem("ongoingBill", JSON.stringify({ prixTotal: null, id: null, date: null, billStatus: null, orderCustomer: null, orderItems: null, restaurant: null }));
    }

    this.menuService.getMenuById().subscribe(data => {
      this.menu = data;
    })
  }

  getImage(imageId: number): string {
    return environment.baseImgPath + imageId;
  }

  // ALL ABOUT THE DIALOG

  openDialog(productDTO:ProductDTO) {
    const dialogRef = this.dialog.open(DishDetailComponent, {
      data: productDTO
    });
  }
}
