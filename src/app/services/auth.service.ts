import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';
import { roles } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;

  constructor(public jwtHelper: JwtHelperService) {}

  isAuthenticated(): boolean{
    this.token = localStorage.getItem('token');
    
    if (this.token) {
      return !this.jwtHelper.isTokenExpired(this.token);
    }else{
      return false;
    }
  }
  
  isOwner(): boolean{
    this.token = localStorage.getItem('token');

    return this.token ? decode(this.token).role == roles.owner : false; 
  }
  isCook(): boolean{
    this.token = localStorage.getItem('token');
    return this.token ? decode(this.token).role == roles.cook : false; 
  }
  isWaiter(): boolean{
    this.token = localStorage.getItem('token');
    return this.token ? decode(this.token).role == roles.waiter : false; 
  }
  isClient(): boolean{
    this.token = localStorage.getItem('token');
    return this.token ? decode(this.token).role == roles.client : false; 
  }

}
