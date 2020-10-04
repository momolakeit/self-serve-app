import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-table-form',
  templateUrl: './add-table-form.component.html',
  styleUrls: ['./add-table-form.component.css']
})
export class AddTableFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddTableFormComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
}
