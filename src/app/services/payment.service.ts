import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient,private router:Router) { }
  getToken(email:string,password:string):Observable<String>{
    return this.http.post<JwtResponse>(`${environment.authApiUrl}/signin`,{username: email,password:password});
  }

  
}
