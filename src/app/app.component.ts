import { Component } from '@angular/core';
import {myParams,myStyle} from '../utilities/particlejsdata';
import { AuthService } from './services/auth.service';
import { AuthentificationService } from './services/authentification.service';
import decode from 'jwt-decode';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'self-serve-app';
  width: number = 100;
  height: number = 100;
  myStyle: object = {};
  myParams: object = {};

  constructor(private authService:AuthService,private authentificationService: AuthentificationService){}

  isConnected() : boolean {
    return this.authService.isAuthenticated();
  };

  logout(){
    this.authentificationService.logout();
  }

  isOwner() : boolean{
    return this.authService.isOwner();
  }

  isWaiter():boolean{
    return this.authService.isWaiter();
  }

  isClient():boolean{
    return this.authService.isClient();
  }

  isCook():boolean{
    return this.authService.isCook();
  }
}
