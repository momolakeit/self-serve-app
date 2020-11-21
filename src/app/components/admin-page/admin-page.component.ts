import { Component, OnInit } from '@angular/core';
import { OwnerDTO } from 'src/app/models/owner-dto';
import {AdminService} from '../../services/admin-service'
import {OwnerUsernameService} from '../../services/owner-username.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {

  constructor(private adminService:AdminService,private ownerUsernameService:OwnerUsernameService,private router:Router) { }
  allOwners :[OwnerDTO]

  ngOnInit(): void {
    this.adminService.fetchAllOwners().subscribe(data =>{
      this.allOwners = data;
    });
  }
  onOwnerSubmit(ownerUsername:string){
    this.ownerUsernameService.onOwnerUsernameSubmit.emit(ownerUsername);
    localStorage.setItem('ownerEmail',ownerUsername);
    this.router.navigate(["/adminProductManagment"]);
  }

}
