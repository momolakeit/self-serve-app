import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';
import { roles } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public jwtHelper: JwtHelperService) { }

  isAuthenticated(): boolean {
    let token = localStorage.getItem('token');

    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    } else {
      return false;
    }
  }

  isOwner(): boolean {
    let token = localStorage.getItem('token');
    return token ? decode(token).role == roles.owner : false;
  }

  isCook(): boolean {
    let token = localStorage.getItem('token');
    return token ? decode(token).role == roles.cook : false;
  }

  isWaiter(): boolean {
    let token = localStorage.getItem('token');
    return token ? decode(token).role == roles.waiter : false;
  }

  isClient(): boolean {
    let token = localStorage.getItem('token');
    return token ? decode(token).role == roles.client : false;
  }

  isGuest(): boolean {
    let token = localStorage.getItem('token');
    return token ? decode(token).role == roles.guest : false;
  }

  findRoleThenRedirect(route: Router) {
    let token = localStorage.getItem('token');

    console.log('this is my role: ' + decode(token).role);

    console.log('this is my token: ' + token);
    

    switch (decode(token).role) {
      case roles.owner:
        route.navigate(['/adminProductManagment'])
        break;
      case roles.waiter:
        route.navigate(['/waiter-request'])
        break;
      case roles.cook:
        route.navigate(['/restaurentOrders'])
        break;
      case roles.client:
        route.navigate(['/menu'])
        break;
      case roles.guest:
        route.navigate(['/menu'])
        break;
      default:
        break;
    }
  }

}
