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
    const expectedRole ="ROLE_OWNER";

    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);

    return tokenPayload.role == expectedRole;
  }

  isWaiter():boolean{
    const expectedRole ="ROLE_WAITER";

    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);

    return tokenPayload.role == expectedRole;
  }

  isClient():boolean{
    const expectedRole ="ROLE_CLIENT";

    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);

    return tokenPayload.role == expectedRole;
  }
}
