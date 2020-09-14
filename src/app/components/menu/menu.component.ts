import { Component, OnInit } from '@angular/core';
import { MenuDTO } from 'src/app/models/menu-dto';
import {MenuService} from '../../services/menu.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  menu: MenuDTO;
  constructor(private menuService :MenuService) { }

  ngOnInit(): void {
    this.menuService.getMenuById().subscribe(data =>{
      this.menu=data;
      console.log(this.menu);
    })
  }

}
