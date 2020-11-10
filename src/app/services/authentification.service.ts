import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtResponse } from '../models/jwt-response';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SignUpForm } from '../models/sign-up-form';
import { SignInForm } from '../models/sign-in-form';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http: HttpClient,public auth:AuthService,private route:Router) { }

  getToken(signInForm: SignInForm):Observable<JwtResponse>{
    return this.http.post<JwtResponse>(`${environment.authApiUrl}/signin`,signInForm);
  }

   //AUTHENTICATION PART
   login(signInForm: SignInForm) : Observable<boolean>{
    return this.getToken(signInForm).pipe(
      map(response => {
        if (response && response.accessToken) {
          localStorage.setItem('token',response.accessToken);
          localStorage.setItem('username',signInForm.username);
          return true;
        }
        return false;
      }));
  }

  signup(form: SignUpForm) : Observable<string>{
    return this.http.post<string>(`${environment.authApiUrl}/signup`,form);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('ongoingBill');
    localStorage.removeItem('5');
    localStorage.removeItem('menuId');
  }

}
