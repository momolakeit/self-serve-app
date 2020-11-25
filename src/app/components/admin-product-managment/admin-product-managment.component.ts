import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductDTO } from 'src/app/models/product-dto';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFormEditCreateComponent } from '../product-form-edit-create/product-form-edit-create.component';
import {PaymentService} from '../../services/payment.service';
import {Input} from '@angular/core';
import {OwnerUsernameService} from '../../services/owner-username.service';
import {AuthService} from '../../services/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin-product-managment',
  templateUrl: './admin-product-managment.component.html',
  styleUrls: ['./admin-product-managment.component.css']
})
export class AdminProductManagmentComponent implements OnInit {

  @Input() username: string;
  displayedColumns: string[] = ['image', 'name', 'category', 'edit', 'delete'];
  dataSource: MatTableDataSource<ProductDTO>;
  restaurantSelectionDTOS: [RestaurantSelectionDTO];
  productDTOList: [ProductDTO];
  currentProductToEdit: ProductDTO;
  restaurantSelectionFormControl: FormControl;
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

  ngOnInit() {
    this.initValues();
  }
  
  initValues() {
    this.loading = true;
    this.getAllRestaurantSelectionDTO();
    this.initForm();
  }


  initForm() {
    const name = localStorage.getItem('restaurantName');

    this.restaurantSelectionFormControl = new FormControl(name ? name : '', Validators.required);
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.productDTOList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initProductTable() {
    if (localStorage.getItem('menuId'))
      this.getAllProductsFromRestaurant(parseInt(localStorage.getItem('menuId')));
    this.isVoirProduitLoading = false;

  }

  //DIALOG

  openDialog(product: ProductDTO): void {
    const dialogRef = this.dialog.open(ProductFormEditCreateComponent, {
      width: this.mobileQuery.matches ? '90%' : '50%',
      height: '80%',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'refresh')
        this.initProductTable();

      if (result == 'close') {
        this.currentProductToEdit = null;
      }
    });
  }

  // SERVICES

  //GET

  getAllRestaurantSelectionDTO() {
    this.menuService.getAllRestaurantName(this.ownerUsernameService.initUserName()).subscribe(data => {
      this.loading = false;
      this.restaurantSelectionDTOS = data;
      this.initProductTable();
    })
  }

  getAllProductsFromRestaurant(menuId: number) {

    if (this.restaurantSelectionFormControl.valid) {
      this.isVoirProduitLoading = true;
      
      this.menuService.fetchMenuById(menuId).subscribe(data => {

        this.productDTOList = data.products;

        this.initTable();

        localStorage.setItem('menuId', `${menuId}`);

        const restaurantName = this.restaurantSelectionDTOS.find(item => item.menuId === menuId);

        localStorage.setItem('restaurantName', restaurantName ? restaurantName.restaurantName: '');
        
        this.isVoirProduitLoading = false;
        
      });
    }
  }

  getImage(imageId: number): string {
    return environment.baseImgPath + imageId;
  }

  //UPDATE

  changeCurrentProductToEdit(product: ProductDTO) {
    this.currentProductToEdit = product;
    this.openDialog(this.currentProductToEdit);
  }

  //DELETE

  deleteProduct(id: number) {
    this.productDTOList.find(product => product.id == id).isLoading = true;

    this.productService.delete(id).subscribe(() => {
      this.getAllProductsFromRestaurant(parseInt(localStorage.getItem('menuId')));
    });
  }

  //TABLE LOGIQUE

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
