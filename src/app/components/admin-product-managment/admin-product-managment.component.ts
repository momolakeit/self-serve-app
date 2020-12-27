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
import { ProductFormEditCreateComponent } from '../product-form-edit-create/product-form-edit-create.component';
import { Input } from '@angular/core';
import { OwnerUsernameService } from '../../services/owner-username.service';
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
  menuDTOList: [MenuDTO]
  currentProductToEdit: ProductDTO;
  restaurantSelectionFormControl: FormControl;
  hasStripeAccountId: boolean;
  loading: boolean;
  mobileQuery: MediaQueryList;
  isVoirProduitLoading: boolean = true;
  private _mobileQueryListener: () => void;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private menuService: MenuService, private productService: ProductService, public dialog: MatDialog, private ownerUsernameService: OwnerUsernameService) {
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
    this.onRestaurantAdded();
    this.onRestaurantDeleted();
  }

  menuSelectedChanged() {
    this.menuService.onMenuSelectedEvent.subscribe(data => {
      this.productDTOList = data;
      this.initTableProduit();
    });
  }

  onRestaurantAdded() {
    this.menuService.onRestaurantAddEvent.subscribe(() => this.getAllRestaurantSelectionDTO());
  }

  onRestaurantDeleted(){
    this.menuService.onRestaurantDeletedEvent.subscribe(() => this.getAllRestaurantSelectionDTO());
  }

  onMenuCreated() {
    this.menuService.onMenuCreatedEvent.subscribe(data => this.getAllMenuFromRestaurant(parseInt(localStorage.getItem('restaurantId'))))
  }

  initForm() {
    const restaurantId: number = JSON.parse(localStorage.getItem('restaurantId'));

    this.restaurantSelectionFormControl = new FormControl(restaurantId, Validators.required);
  }

  initTable() {
    this.initTableProduit();
    this.initTableMenu();
  }

  initTableProduit() {
    this.dataSourceProduit = new MatTableDataSource(this.productDTOList);
    this.dataSourceProduit.paginator = this.paginator;
    this.dataSourceProduit.sort = this.sort;
  }

  loadTableProduit(menuDTO: MenuDTO) {
    if (menuDTO) 
      this.menuService.onMenuSelectedEvent.emit(menuDTO.products);
  }

  initTableMenu() {
    this.dataSourceMenu = new MatTableDataSource(this.menuDTOList);
    this.dataSourceMenu.paginator = this.paginator;
    this.dataSourceMenu.sort = this.sort;
  }

  fetchData() {
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
        this.fetchData();

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
      this.fetchData();
    })
  }

  getAllMenuFromRestaurant(restaurantId: number) {

    if (this.restaurantSelectionFormControl.valid) {
      this.isVoirProduitLoading = true;

      if (localStorage.getItem('restaurantId')) 
        this.menuService.onRestaurantSelectedEvent.emit();

      localStorage.setItem('restaurantId', `${restaurantId}`);

      this.menuService.fetchAllMenuByRestaurantId(restaurantId).subscribe(data => {

        this.menuDTOList = data;

        this.initTable();

        this.isVoirProduitLoading = false;

        this.loadTableProduit(this.menuDTOList.find(menu => menu.id == parseInt(localStorage.getItem('menuId'))));
      });
    }
  }

  getImage(imageId: number): string {
    return environment.baseImgPath + imageId;
  }

  isMenuSelected():boolean{
    return localStorage.getItem('menuId') != null;
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
