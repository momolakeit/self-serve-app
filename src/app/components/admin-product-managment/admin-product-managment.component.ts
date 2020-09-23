import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MenuDTO } from 'src/app/models/menu-dto';
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

  displayedColumns: string[] = ['id', 'name', 'category', 'edit','delete'];
  dataSource:MatTableDataSource<ProductDTO>;
  restaurantSelectionDTOS: [RestaurantSelectionDTO];
  productDTOList: [ProductDTO];
  currentProductToEdit: ProductDTO;
  restaurantSelectionFormControl: FormControl;
  

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private menuService: MenuService, private productService: ProductService) {
    this.restaurantSelectionFormControl = new FormControl('',Validators.required);
  }

  ngOnInit() {
    this.getAllRestaurantSelectionDTO();
  }
  
  initTable(){
    this.dataSource = new MatTableDataSource(this.productDTOList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  
  // SERVICES

  //RESEARCH

  getAllProductsFromRestaurant(){
    if (this.restaurantSelectionFormControl.valid) {
      this.menuService.fetchMenuById(this.restaurantSelectionFormControl.value).subscribe(data =>{

        this.productDTOList = data.products;

        this.initTable();  

        console.log(this.productDTOList);
      });
    }
  }

  
  //UPDATE

    changeCurrentProductToEdit(product: ProductDTO){
      this.currentProductToEdit = product;
    }

  //DELETE

  deleteProduct(id:number){
    this.productService.delete(id).subscribe(() =>{
      this.getAllProductsFromRestaurant();
    });
  }

  getAllRestaurantSelectionDTO(){
    this.menuService.getAllRestaurantName().subscribe(data =>{
      this.restaurantSelectionDTOS = data;
      console.log(this.restaurantSelectionDTOS);
    })
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
