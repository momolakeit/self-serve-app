import { Component } from '@angular/core';
//import { myParams, myStyle } from '../utilities/particlejsdata';
import { AuthService } from '../../services/auth.service';
import { AuthentificationService } from '../../services/authentification.service';
import decode from 'jwt-decode';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { KitchenService } from 'src/app/services/kitchen.service';


@Component({
  selector: 'app-body',
  templateUrl: './app-body.component.html',
  styleUrls: ['./app-body.component.css']
})
export class AppBodyComponent {
  title = 'self-serve-app';
  logoUrl: string;
  width: number = 100;
  height: number = 100;
  myStyle: object = {};
  myParams: object = {};
  imgPath: string;

  constructor(private authService: AuthService, private authentificationService: AuthentificationService, private router: Router, private activatedRoute: ActivatedRoute, private kitchenService: KitchenService) { }


  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      let restaurantTableId = params['restaurantTableId'];
      if (restaurantTableId == null) {
        console.log(restaurantTableId);
        this.logoUrl = localStorage.getItem('logoUrl');
      }
      else {
        localStorage.clear();
        this.fetchMenu(restaurantTableId)
      }
    });
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
  isConnected(): boolean {
    return this.authService.isAuthenticated();
  };

  fetchMenu(restaurantTableId: number) {
    this.kitchenService.fetchMenuByRestaurantTable(restaurantTableId).subscribe(data => {
      this.logoUrl = environment.baseImgPath + data.restaurant.imgFile.id;
      localStorage.setItem('logoUrl', environment.baseImgPath + data.restaurant.imgFile.id);
      localStorage.setItem("menuId", data.id.toString())
      localStorage.setItem("restaurantTableId", restaurantTableId.toString());
      this.router.navigate(['/menu']);
    });
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
