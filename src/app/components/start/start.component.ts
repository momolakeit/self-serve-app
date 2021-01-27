import { Component, OnInit } from '@angular/core';
import { v1 as uuidv1 } from 'uuid';
import { SignUpForm } from 'src/app/models/sign-up-form';
import { SignInForm } from 'src/app/models/sign-in-form';
import { environment } from 'src/environments/environment';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KitchenService } from 'src/app/services/kitchen.service';
import {AuthService} from '../../services/auth.service';
import {LogoService} from '../../services/logo.service'
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  myStyle: object = {};
  myParams: object = {};
  width: number = 110;
  height: number = 200;
  isLoading: boolean = false;


  constructor(private authentificationService: AuthentificationService, private route: Router,private activatedRoute: ActivatedRoute, private kitchenService: KitchenService,private authService:AuthService,private logoService:LogoService) { }

  ngOnInit(): void {
    this.findMenu();
   }

  findMenu() {
    this.activatedRoute.queryParams.subscribe(params => {
      let restaurantTableId = params['restaurantTableId'];
      this.kitchenService.fetchMenuByRestaurantTable(restaurantTableId).subscribe(data => {
        localStorage.setItem("restaurantId",data.id.toString())
        localStorage.setItem("restaurantType",data.restaurantType.toString())
        localStorage.setItem("restaurantTableId",restaurantTableId.toString());
        this.logoService.onRestaurantLogoImgUrl.emit(environment.baseImgPath+data.imgFile.id)
        if(this.authService.isAuthenticated()){
          this.route.navigate(['/menu']);
        }
      });
  });
  }

  onGuestClicked() {
    //sign up guest
    this.isLoading = true;
    
    const signUpForm: SignUpForm = {
      username: `Guest-${uuidv1()}`,
      password: `Guest`,
      role: 'guest'
    }
    
    const signInForm: SignInForm = {
      username: signUpForm.username,
      password: signUpForm.password
    }
    
    //sign up guest and if success login guest
    this.authentificationService.signup(signUpForm).subscribe(() => {
      this.loginGuest(signInForm);
    }, error => {
      
      if (error.status == 200){
        this.loginGuest(signInForm);
        return;
      }
      
      if (error.error == "Fail -> Email is already in use!")
      console.log('Username is already in use');
      
      this.isLoading = false;
    })

  }

  loginGuest(signInForm: SignInForm) {
    this.authentificationService.login(signInForm).subscribe((success: boolean) => {
      if (success)
        this.route.navigate(['/menu']);
      else
        console.log("Error could not login");
    })
  }

}
