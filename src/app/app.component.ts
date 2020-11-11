import { Component } from '@angular/core';
import {myParams,myStyle} from '../utilities/particlejsdata';
import { AuthService } from './services/auth.service';
import { AuthentificationService } from './services/authentification.service';
import decode from 'jwt-decode';
import { Router, NavigationEnd } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

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

  constructor(private authService:AuthService,private authentificationService: AuthentificationService,private router:Router,private translate: TranslateService){
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
}

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

  isGuest():boolean{
    return this.authService.isGuest();
  }

  isCook():boolean{
    return this.authService.isCook();
  }
}
