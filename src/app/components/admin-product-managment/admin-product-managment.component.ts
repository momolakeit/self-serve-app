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
import { PaymentService } from '../../services/payment.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin-product-managment',
  templateUrl: './admin-product-managment.component.html',
  styleUrls: ['./admin-product-managment.component.css']
})
export class AdminProductManagmentComponent implements OnInit {

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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private activatedRoute: ActivatedRoute, private menuService: MenuService, private productService: ProductService, public dialog: MatDialog, private authentificationService: AuthentificationService, private paymentService: PaymentService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.initValues();
  }

  initValues() {
    this.loading = true;
    this.fetchOwner();
    this.confirmStripeAccountCreation();
  }

  confirmStripeAccountCreation() {
    this.activatedRoute.queryParams.subscribe(params => {
      let accountId = params['accountId'];
      if (accountId != null) {
        this.paymentService.saveStripeAccount(accountId, localStorage.getItem('username')).subscribe(data => {
          this.setHasStripeAccountId(true);
        });
      }
    });
  }

  setHasStripeAccountId(value: boolean) {
    this.hasStripeAccountId = value;
    this.getAllRestaurantSelectionDTO();
    this.initForm();
    this.initProductTable();
  }

  fetchOwner() {
    this.authentificationService.getOwner(localStorage.getItem("username")).subscribe(data => {
      console.log(data);
      if (data.stripeAccountId == null || data.isStripeEnable == false) {
        this.setHasStripeAccountId(false);
      }
      else {
        this.setHasStripeAccountId(true);
        console.log(this.hasStripeAccountId);
      }
    })
  }

  redirectToStripeRegister() {
    this.loading = true;
    this.paymentService.createStripeAccount(localStorage.getItem('username')).subscribe(data => {
      console.log(data);
      window.location.href = data.value;
    })
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
    this.menuService.getAllRestaurantName().subscribe(data => {
      this.loading = false;
      this.restaurantSelectionDTOS = data;
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
