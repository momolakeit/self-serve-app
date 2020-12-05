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
import { MenuDTO } from 'src/app/models/menu-dto';
@Component({
  selector: 'app-admin-product-managment',
  templateUrl: './admin-product-managment.component.html',
  styleUrls: ['./admin-product-managment.component.css']
})
export class AdminProductManagmentComponent implements OnInit {

  @Input() username: string;
  displayedColumns: string[] = ['image', 'name', 'category', 'edit', 'delete'];
  dataSourceProduit: MatTableDataSource<ProductDTO>;
  dataSourceMenu: MatTableDataSource<MenuDTO>;
  restaurantSelectionDTOS: [RestaurantSelectionDTO];
  productDTOList: [ProductDTO];
  menuDTOList :[MenuDTO]
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
    this.onMenuCreated();
    this.menuSelectedChanged();  
  }

  menuSelectedChanged(){
    this.menuService.onMenuSelectedEvent.subscribe(data =>{
      this.productDTOList = data;
      this.initTableProduit();
    });
  }
  onMenuCreated(){
    this.menuService.onMenuCreatedEvent.subscribe(data=>this.getAllMenuFromRestaurant(parseInt(localStorage.getItem('restaurantId'))))
  }


  initForm() {
    const name = localStorage.getItem('restaurantName');

    this.restaurantSelectionFormControl = new FormControl(name ? name : '', Validators.required);
  }

  initTable() {
    this.initTableProduit();
    this.initTableMenu();
  }
  initTableProduit(){
    this.dataSourceProduit = new MatTableDataSource(this.productDTOList);
    this.dataSourceProduit.paginator = this.paginator;
    this.dataSourceProduit.sort = this.sort;
  }
  initTableMenu(){
    this.dataSourceMenu = new MatTableDataSource(this.menuDTOList);
    this.dataSourceMenu.paginator = this.paginator;
    this.dataSourceMenu.sort = this.sort;
  }

  initProductTable() {
    if (localStorage.getItem('restaurantId'))
      this.getAllMenuFromRestaurant(parseInt(localStorage.getItem('restaurantId')));
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

  getAllMenuFromRestaurant(restaurantId: number) {

    if (this.restaurantSelectionFormControl.valid) {
      this.isVoirProduitLoading = true;
      
      this.menuService.fetchAllMenuByRestaurantId(restaurantId).subscribe(data => {

        this.menuDTOList = data;
        console.log(this.menuDTOList);
        this.initTable();

        localStorage.setItem('restaurantId', `${restaurantId}`);

        const restaurantName = this.restaurantSelectionDTOS.find(item => item.restaurantId === restaurantId);

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
      this.getAllMenuFromRestaurant(parseInt(localStorage.getItem('restaurantId')));
    });
  }

  //TABLE LOGIQUE

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProduit.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProduit.paginator) {
      this.dataSourceProduit.paginator.firstPage();
    }
  }


}
