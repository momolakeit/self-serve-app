import { Component } from '@angular/core';
import {myParams,myStyle} from '../utilities/particlejsdata';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'self-serve-app';
  width: number = 100;
  height: number = 100;

  myStyle = myStyle;

  myParams = myParams;
}
