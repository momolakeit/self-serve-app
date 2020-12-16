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
import { OwnerDTO } from '../models/owner-dto';
import { BillService } from './bill.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../components/logout-dialog/logout-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private router:Router,private http: HttpClient,public auth:AuthService,public dialog: MatDialog) { }

  getToken(signInForm: SignInForm):Observable<JwtResponse>{
    return this.http.post<JwtResponse>(`${environment.authApiUrl}/signin`,signInForm);
  }
  getOwner(username: string):Observable<OwnerDTO>{
    return this.http.post<OwnerDTO>(`${environment.authApiUrl}/fetchOwner`,{username:username});
  }

   //AUTHENTICATION PART
   login(signInForm: SignInForm) : Observable<boolean>{
    return this.getToken(signInForm).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token',response.token);
          localStorage.setItem('username',signInForm.username);
          return true;
        }
        return false;
      }));
  }

  signup(form: SignUpForm) : Observable<string>{
    return this.http.post<string>(`${environment.authApiUrl}/signup`,form);
  }

  logoutClientAndGuest(billService:BillService,mobileQuery: MediaQueryList){
    if (this.auth.isClient() || this.auth.isGuest()) {
      if (!billService.isBillExisting()) {
        localStorage.clear();
        this.router.navigate(['/start']);
        return;
      }
      
      billService.hasUserPaid().subscribe(hasUserPaid => {
        if (hasUserPaid) {
          localStorage.clear();
          this.router.navigate(['/start']);
        } else
          this.openDialog(mobileQuery);
      });
    }
  }

  openDialog(mobileQuery: MediaQueryList): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: mobileQuery.matches ? '90%' : '50%',
    });

    dialogRef.afterClosed().subscribe(() =>{
      this.router.navigate(['/clientRequestList'])
    })

  }

}
