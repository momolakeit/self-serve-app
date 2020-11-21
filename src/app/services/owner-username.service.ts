import { EventEmitter, Injectable } from '@angular/core';
import {AuthService} from '../services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class OwnerUsernameService {
  onOwnerUsernameSubmit = new EventEmitter<any>();
  constructor(private authService:AuthService) { }

  initUserName():string{
    return this.authService.isAdmin() ? localStorage.getItem('ownerEmail') : localStorage.getItem('username');
  }
}
