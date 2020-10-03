import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductDTO } from 'src/app/models/product-dto';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductFormEditCreateComponent } from '../product-form-edit-create/product-form-edit-create.component';

@Component({
  selector: 'app-admin-product-managment',
  templateUrl: './admin-product-managment.component.html',
  styleUrls: ['./admin-product-managment.component.css']
})
export class AdminProductManagmentComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'category', 'edit', 'delete'];
  dataSource: MatTableDataSource<ProductDTO>;
  restaurantSelectionDTOS: [RestaurantSelectionDTO];
  productDTOList: [ProductDTO];
  currentProductToEdit: ProductDTO;
  restaurantSelectionFormControl: FormControl;



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private menuService: MenuService, private productService: ProductService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getAllRestaurantSelectionDTO();
    this.initForm();
    this.initProductTable();
  }

  initForm() {
    const name = localStorage.getItem('restaurantName');
    console.log('my name:' + name);
    
    this.restaurantSelectionFormControl = new FormControl(name ? name : 'heyy', Validators.required);
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.productDTOList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initProductTable() {
    //if local storage has menu id already then fetch product list
    if (localStorage.getItem('menuId')) {
      this.getAllProductsFromRestaurant(parseInt(localStorage.getItem('menuId')));
    }
  }

  //DIALOG

  openDialog(product:ProductDTO): void {
    const dialogRef = this.dialog.open(ProductFormEditCreateComponent, {
      width: '550px',
      height: '600px',
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
      this.restaurantSelectionDTOS = data;
    })
  }

  getAllProductsFromRestaurant(menuId: number) {

    if (this.restaurantSelectionFormControl.valid) {
      this.menuService.fetchMenuById(menuId).subscribe(data => {

        this.productDTOList = data.products;

        this.initTable();

        localStorage.setItem('menuId', `${menuId}`);

        const restaurantName = this.restaurantSelectionDTOS.find((item) =>{
          return item.menuId === menuId;
        })

        localStorage.setItem('restaurantName', restaurantName.restaurantName);
        console.log(this.productDTOList);
      });
    }
  }


  //UPDATE

  changeCurrentProductToEdit(product: ProductDTO) {
    this.currentProductToEdit = product;
    this.openDialog(this.currentProductToEdit);
  }

  //DELETE

  deleteProduct(id: number) {
    this.productService.delete(id).subscribe(() => {
      this.getAllProductsFromRestaurant(this.restaurantSelectionFormControl.value);
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
