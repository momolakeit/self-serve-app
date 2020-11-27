import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MaxSizeValidator } from '@angular-material-components/file-input';
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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FileInput } from 'ngx-material-file-input';
import {OwnerUsernameService} from '../../services/owner-username.service'

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
  maxSize: number = 1024;
  isButtonLoading: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private qrCodeService: QrCodeService, private menuService: MenuService, public dialog: MatDialog, public dialogRef: MatDialogRef<RestaurantFormComponent>, @Inject(MAT_DIALOG_DATA) public data: RestaurantSelectionDTO, private formBuilder: FormBuilder, private kitchenService: KitchenService,private ownerUsernameService:OwnerUsernameService) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(){
    if (this.data) 
      this.initTable();
  }

  // ALL ABOUT THE FORM

  initForm() {
    this.restaurantForm = this.formBuilder.group({
      name: [this.data ? this.data.restaurantName : '', Validators.required],
      tableAmount: [this.data ? this.data.restaurentTablesDTO.length : '', Validators.required],
      image: ['', [MaxSizeValidator(this.maxSize * 1024)]]
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
        ownerUsername: this.ownerUsernameService.initUserName(),
        nombreDeTable: formValues['tableAmount'],
        restaurantName: formValues['name']
      }

      if (this.data)
        this.onUpdate(restaurantFormDTO);
      else
        this.onCreate(restaurantFormDTO);
    }
  }

  onUploadImage(restaurantId: number) {
    const file_form: FileInput = this.restaurantForm.get('image').value;
    const file = file_form.files == undefined ? undefined : file_form.files[0];

    const formData: FormData = new FormData();
    formData.append('file', file);

    if (file != undefined) 
      this.kitchenService.saveRestaurantLogo(formData, restaurantId).subscribe(data => this.dialogRef.close('refresh'));
    else 
      this.dialogRef.close('refresh');

    this.isButtonLoading = false;
  }

  // SERVICES

  onCreate(restaurantFormDTO: RestaurantFormDTO) {
    this.isButtonLoading = true;
    this.kitchenService.createRestaurant(restaurantFormDTO).subscribe(data => this.onUploadImage(data.id));
  }
  
  onDownloadQrCode(tableNumber:number,tableId: number) {
    const tableDto : RestaurantTableDTO = this.data.restaurentTablesDTO.find(table => table.id == tableId);

    tableDto.isLoading = true;

    this.qrCodeService.download(tableId).subscribe(data => {
      saveAs(new Blob([data], { type: data.type }), 'tableNumber' + tableNumber + '.png');
      
      tableDto.isLoading = false;
    });
  }
  
  onUpdate(restaurantFormDTO: RestaurantFormDTO) {
    this.isButtonLoading = true;
    this.kitchenService.updateRestaurantName(restaurantFormDTO.restaurantName,restaurantFormDTO.restaurantId).subscribe(data => this.onUploadImage(data.id));
  }

  onDeleteTable(id: number) {
    this.data.restaurentTablesDTO.find(table => table.id == id).isLoading = true;

    this.kitchenService.deleteTable(id, this.data.restaurantId).subscribe(() => this.refreshTables(id));
  }

  refreshTables(tableId: number) {
    this.data.restaurentTablesDTO = this.data.restaurentTablesDTO.filter(table => table.id != tableId);

    this.initTable();
  }

  refreshRestaurant() {
    this.menuService.getAllRestaurantName(this.ownerUsernameService.initUserName()).subscribe(data => {
      this.data = data.find(restaurantSelection => restaurantSelection.restaurantId == this.data.restaurantId);

      this.initTable();
    });
  }

  onNoClick() {
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
