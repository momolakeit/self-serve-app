import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtResponse } from '../models/jwt-response';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SignUpForm } from '../models/sign-up-form';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http: HttpClient,public auth:AuthService,private route:Router) { }

  getToken(email:string,password:string):Observable<JwtResponse>{
    return this.http.post<JwtResponse>(`${environment.authApiUrl}/signin`,{username: email,password:password});
  }

   //AUTHENTICATION PART
   login(email:string,password:string) : Observable<boolean>{
    return this.getToken(email,password).pipe(
      map(response => {
        if (response && response.accessToken) {
          localStorage.setItem('token',response.accessToken);
          localStorage.setItem('Email',email);
          console.log(response.accessToken);
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
    localStorage.removeItem('email');
  }

   // OBTAINING USER DETAILS 

  /* getClientDetails(email: string): Observable<Client> {
    if (this.auth.isAuthenticated()) {
      return this.http.get<Client>(`${environment.clientUrl}/${email}`).pipe(map((client: Client) => {
        return client;
      }));
    }
  }*/

 
}
