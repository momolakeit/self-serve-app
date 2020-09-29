import { Component, OnInit } from '@angular/core';
import { myParams, myStyle } from '../../../utilities/particlejsdata';
import { v4 as uuidv4 } from 'uuid';
import { SignUpForm } from 'src/app/models/sign-up-form';
import { SignInForm } from 'src/app/models/sign-in-form';
import { roles } from 'src/environments/environment';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { error } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

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

  constructor(private authentificationService: AuthentificationService, private route: Router) { }

  ngOnInit(): void { }

  onGuestClicked() {
    //sign up guest
    const signUpForm: SignUpForm = {
      username: `Guest-${uuidv4()}`,
      password: `Guest`,
      role: 'guest'
    }

    const signInForm: SignInForm = {
      username: signUpForm.username,
      password: signUpForm.password
    }

    //sign up guest and if success login guest
    this.authentificationService.signup(signUpForm).subscribe(() => {
      this.loginGuest(signUpForm);
    }, error => {

      if (error.status == 200)
        this.loginGuest(signUpForm);

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
