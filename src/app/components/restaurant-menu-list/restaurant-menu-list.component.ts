import { ChangeDetectorRef,Component, OnInit,Input, ViewChild } from '@angular/core';
import {MenuDTO} from 'src/app/models/menu-dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductDTO } from 'src/app/models/product-dto';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuFormEditCreateComponent } from '../menu-form-edit-create/menu-form-edit-create.component';
import {PaymentService} from '../../services/payment.service';
import {OwnerUsernameService} from '../../services/owner-username.service';
import {AuthService} from '../../services/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-restaurant-menu-list',
  templateUrl: './restaurant-menu-list.component.html',
  styleUrls: ['./restaurant-menu-list.component.css']
})
export class RestaurantMenuListComponent implements OnInit {
  @Input() menuList: [MenuDTO];
  displayedColumns: string[] = ['name', 'category', 'edit', 'delete','view products'];
  dataSourceMenu: MatTableDataSource<MenuDTO>;
  restaurantSelectionDTOS: [RestaurantSelectionDTO];
  productDTOList: [ProductDTO];
  currentMenuToEdit: MenuDTO;
  hasStripeAccountId: boolean;
  loading: boolean;
  mobileQuery: MediaQueryList;
  isVoirProduitLoading: boolean = true;
  private _mobileQueryListener: () => void;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private menuService: MenuService, private productService: ProductService, public dialog: MatDialog, private authentificationService: AuthentificationService, private paymentService: PaymentService,private ownerUsernameService:OwnerUsernameService,private authService:AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit(): void {
    this.initTableMenu();
  }
  ngOnChanges(){
    this.initTableMenu();
  }
  initTableMenu(){
    this.dataSourceMenu = new MatTableDataSource(this.menuList);
    this.dataSourceMenu.paginator = this.paginator;
    this.dataSourceMenu.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMenu.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceMenu.paginator) {
      this.dataSourceMenu.paginator.firstPage();
    }
  }
  menuSelectedChanged(menuDTO:MenuDTO){
    localStorage.setItem("menuId",JSON.stringify(menuDTO.id))
    this.menuService.onMenuSelectedEvent.emit(menuDTO.products);
  }

  changeCurrentProductToEdit(menuDTO: MenuDTO) {
    this.currentMenuToEdit = menuDTO;
    this.openDialog(this.currentMenuToEdit);
  }
  
  openDialog(menuDTO: MenuDTO): void {
    const dialogRef = this.dialog.open(MenuFormEditCreateComponent, {
      width: this.mobileQuery.matches ? '90%' : '50%',
      height: '25%',
      data: menuDTO
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'refresh')
        this.initTableMenu();

      if (result == 'close') {
        this.currentMenuToEdit = null;
      }
    });
  }
  deleteMenu(menuId:number){
    this.menuService.deleteMenu(parseInt(localStorage.getItem('restaurantId')),menuId).subscribe(()=>this.menuService.onMenuCreatedEvent.emit());
  }


}
