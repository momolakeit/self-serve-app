import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantSelectionDTO } from 'src/app/models/restaurant-selection-dto';
import { RestaurantFormDTO } from 'src/app/models/restaurant-form-dto';
import { KitchenService } from 'src/app/services/kitchen.service';
import { AddTableFormComponent } from '../add-table-form/add-table-form.component';
import { MenuService } from 'src/app/services/menu.service';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { MatTableDataSource } from '@angular/material/table';
import { RestaurantTableDTO } from 'src/app/models/restaurant-table-dto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {
  title: string;
  restaurantForm: FormGroup;
  displayedColumns: string[] = ['tableNumber', 'download', 'delete'];
  dataSource = new MatTableDataSource<RestaurantTableDTO>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private qrCodeService: QrCodeService, private menuService: MenuService, public dialog: MatDialog, public dialogRef: MatDialogRef<RestaurantFormComponent>, @Inject(MAT_DIALOG_DATA) public data: RestaurantSelectionDTO, private formBuilder: FormBuilder, private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.initForm();
  }

  // ALL ABOUT THE FORM

  initForm() {
    this.restaurantForm = this.formBuilder.group({
      name: [this.data ? this.data.restaurantName : '', Validators.required],
      tableAmount: [this.data ? this.data.restaurentTablesDTO.length : '', Validators.required]
    })

    this.title = this.data ? 'Restaurant update' : 'Restaurant creation';

    if (this.data) this.initTable();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTableFormComponent, {
      width: '500px',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'refresh')
        this.refreshRestaurant();
    });
  }

  onSubmitForm() {
    if (this.restaurantForm.valid) {

      const formValues = this.restaurantForm.value;

      const restaurantFormDTO: RestaurantFormDTO = {
        restaurantId: this.data ? this.data.restaurantId : null,
        ownerUsername: localStorage.getItem('username'),
        nombreDeTable: formValues['tableAmount'],
        restaurantName: formValues['name']
      }

      if (this.data)
        this.onUpdate(restaurantFormDTO);
      else
        this.onCreate(restaurantFormDTO);
    }
  }

  // SERVICES

  onCreate(restaurantFormDTO: RestaurantFormDTO) {
    this.kitchenService.createRestaurant(restaurantFormDTO).subscribe(() => this.dialogRef.close('refresh'));
  }

  onDownloadQrCode(tableNumber:number,tableId: number) {
    this.qrCodeService.download(tableId).subscribe(data => saveAs(new Blob([data], { type: data.type }), 'tableNumber' + tableNumber + '.png'));
  }

  onUpdate(restaurantFormDTO: RestaurantFormDTO) {
    this.kitchenService.updateRestaurantName(restaurantFormDTO.restaurantName, restaurantFormDTO.restaurantId).subscribe(() => this.dialogRef.close('refresh'))
  }

  onDeleteTable(tableId: number) {
    this.kitchenService.deleteTable(tableId, this.data.restaurantId).subscribe(() => this.refreshTables(tableId));
  }

  refreshTables(tableId: number) {
    this.data.restaurentTablesDTO = this.data.restaurentTablesDTO.filter(table => table.id != tableId);

    this.initTable();
  }

  refreshRestaurant() {
    this.menuService.getAllRestaurantName().subscribe(data => {
      this.data = data.find(restaurantSelection => restaurantSelection.restaurantId == this.data.restaurantId);

      this.initTable();
    });
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  //ALL ABOUT THE TABLE

  initTable() {
    this.dataSource = new MatTableDataSource(this.data.restaurentTablesDTO);
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
