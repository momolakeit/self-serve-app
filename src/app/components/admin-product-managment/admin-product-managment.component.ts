import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductDTO } from 'src/app/models/product-dto';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';

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

  constructor(private menuService: MenuService, private productService: ProductService) {
    this.restaurantSelectionFormControl = new FormControl('', Validators.required);
  }

  ngOnInit() {
    this.getAllRestaurantSelectionDTO();

    //if local storage has menu id already then fetch product list
    if (localStorage.getItem('menuId')) {
      this.restaurantSelectionFormControl = new FormControl(localStorage.getItem('menuId'), Validators.required);
      this.getAllProductsFromRestaurant(parseInt(localStorage.getItem('menuId')));
    }

  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.productDTOList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  // SERVICES

  //RESEARCH

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

        localStorage.setItem('menuId', JSON.stringify(menuId));
        console.log(this.productDTOList);
      });
    }
  }


  //UPDATE

  changeCurrentProductToEdit(product: ProductDTO) {
    this.currentProductToEdit = product;
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
