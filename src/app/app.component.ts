import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthentificationService } from './services/authentification.service';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy  {
  title = 'self-serve-app';
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;


  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private authService: AuthService, private authentificationService: AuthentificationService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  isConnected(): boolean {
    return this.authService.isAuthenticated();
  };

  logout() {
    this.authentificationService.logout();
    this.router.navigate(['/start']);
  }

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
}
