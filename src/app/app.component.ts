import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthentificationService } from './services/authentification.service';
import { MediaMatcher } from '@angular/cdk/layout';

import decode from 'jwt-decode';
import { Router, NavigationEnd } from '@angular/router';
import {LogoService} from './services/logo.service'

import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  logoUrl:string;
  title = 'self-serve-app';
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;


  constructor(private logoService:LogoService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService, private authentificationService: AuthentificationService, private router: Router, private translate: TranslateService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    translate.setDefaultLang('fr');
  }

  ngOnInit() {
    this.logoService.onRestaurantLogoImgUrl.subscribe(data =>this.logoUrl = data);
    
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  isConnected(): boolean {
    return this.authService.isAuthenticated();
  };


  isOwner(): boolean {
    return this.authService.isOwner();
  }

  isWaiter(): boolean {
    return this.authService.isWaiter();
  }

  isClient(): boolean {
    return this.authService.isClient();
  }

  isGuest(): boolean {
    return this.authService.isGuest();
  }

  isCook(): boolean {
    return this.authService.isCook();
  }

  logout() {
    this.authentificationService.logout();
    this.router.navigate(['/start']);
  }
}
