import { Component, OnInit } from '@angular/core';
import {myParams,myStyle} from '../../../utilities/particlejsdata';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

    myStyle: object = {};
    myParams: object = {};
    width: number = 110;
    height: number = 200;

  constructor() { }

  

  ngOnInit(): void {
   
  }

}
