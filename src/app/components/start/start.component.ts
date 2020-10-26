import { Component, OnInit } from '@angular/core';
import { myParams, myStyle } from '../../../utilities/particlejsdata';
import { v1 as uuidv1 } from 'uuid';
import { SignUpForm } from 'src/app/models/sign-up-form';
import { SignInForm } from 'src/app/models/sign-in-form';
import { environment, roles } from 'src/environments/environment';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { error } from '@angular/compiler/src/util';
import { ActivatedRoute, Router } from '@angular/router';
import { KitchenService } from 'src/app/services/kitchen.service';
import { ConstanteService } from 'src/app/services/constante-service.service';

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

  constructor(private authentificationService: AuthentificationService, private route: Router,private activatedRoute: ActivatedRoute, private kitchenService: KitchenService,private constanteService :ConstanteService) { }

  ngOnInit(): void {
    this.findMenu();
   }

  findMenu() {
    this.activatedRoute.queryParams.subscribe(params => {
      let restaurantTableId = params['restaurantTableId'];
      this.kitchenService.fetchMenuByRestaurantTable(restaurantTableId).subscribe(data => {
        localStorage.setItem("menuId",data.id.toString())
        localStorage.setItem("restaurantTableId",restaurantTableId.toString());
        console.log(this.constanteService.menuId);
      });
  });
  }
  onGuestClicked() {
    //sign up guest
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

      if (error.status == 200)
        this.loginGuest(signInForm);

      if (error.error == "Fail -> Email is already in use!")
        console.log('Username is already in use');
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
