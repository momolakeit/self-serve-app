import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { MenuService } from 'src/app/services/menu.service';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';

@Component({
  selector: 'app-restaurant-owner-list',
  templateUrl: './restaurant-owner-list.component.html',
  styleUrls: ['./restaurant-owner-list.component.css']
})
export class RestaurantOwnerListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'date', 'edit','delete'];
  restaurantList: RestaurantSelectionDTO[];
  dataSource: MatTableDataSource<RestaurantSelectionDTO>;
  ownerId: string = localStorage.getItem('username');
  currentRestaurantToEdit: RestaurantSelectionDTO;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private menuService: MenuService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initRestaurants();
  }

  initRestaurants(){
    this.menuService.getAllRestaurantName().subscribe(data =>{
      this.restaurantList = data;
      console.log(this.restaurantList);
      this.initTable();
    },error =>{
      console.log(error);
    })
  }

  // ALL ABOUT THE DIALOG
  openDialog(){
    const dialogRef = this.dialog.open(RestaurantFormComponent, {
      width: '350px',
      data: this.currentRestaurantToEdit
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'refresh') 
        this.initRestaurants();
      
      if (result == 'close') 
        this.currentRestaurantToEdit = null;
    });
  }

  changeCurrentRestaurant(restaurant:RestaurantSelectionDTO){
    this.currentRestaurantToEdit = restaurant;
    this.openDialog();
  }

  //ALL ABOUT THE TABLE

  initTable(){
    this.dataSource = new MatTableDataSource(this.restaurantList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
