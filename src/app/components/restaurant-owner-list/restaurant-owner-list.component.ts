import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestaurantDTO } from 'src/app/models/restaurant-dto';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { KitchenService } from 'src/app/services/kitchen.service';
import { MenuService } from 'src/app/services/menu.service';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import {OwnerUsernameService} from '../../services/owner-username.service';
@Component({
  selector: 'app-restaurant-owner-list',
  templateUrl: './restaurant-owner-list.component.html',
  styleUrls: ['./restaurant-owner-list.component.css']
})
export class RestaurantOwnerListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'date','tableAmount', 'edit','delete'];
  restaurantList: RestaurantSelectionDTO[];
  dataSource: MatTableDataSource<RestaurantSelectionDTO>;
  ownerId: string = localStorage.getItem('username');
  currentRestaurantToEdit: RestaurantSelectionDTO;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private menuService: MenuService,private kitchenService:KitchenService,public dialog: MatDialog,private ownerUsernameService:OwnerUsernameService) { }

  ngOnInit(): void {
    this.initRestaurants();
  }

  initRestaurants(){
    this.menuService.getAllRestaurantName(this.ownerUsernameService.initUserName()).subscribe(data =>{
      this.restaurantList = data;
      this.initTable();
    });
  }

  onDeleteRestaurant(id:number){
    this.restaurantList.find(restaurant => restaurant.restaurantId == id).isLoading = true;

    this.kitchenService.deleteRestaurant(id).subscribe(data =>{
      this.initRestaurants();
      this.menuService.onRestaurantDeletedEvent.emit();
    });

    //remove restaurant in data too
  }

  // ALL ABOUT THE DIALOG
  openDialog(restaurant:RestaurantSelectionDTO){
    const dialogRef = this.dialog.open(RestaurantFormComponent, {
      width: '60%',
      maxHeight:'700px',
      data: restaurant
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
    this.openDialog(this.currentRestaurantToEdit);
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
