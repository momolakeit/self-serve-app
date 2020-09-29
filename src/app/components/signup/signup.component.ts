import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SignUpForm } from 'src/app/models/sign-up-form';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { MustMatch } from '../../../utilities/must-match-validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  role: string;
  constructor(private formBuilder: FormBuilder, private authentificationService: AuthentificationService, private router: Router,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.init();

  }
  
  init() {
    //init form
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['']
    }, {
      validator: MustMatch('password', 'confirmPassword')
    })

    //init role
    this.activatedRoute.paramMap.subscribe(params =>{
      this.role = params.get("role");
    })
  }

  getF() {
    return this.signUpForm.controls;
  }

  onSubmitForm() {
    if (this.signUpForm.valid) {
      const formValue = this.signUpForm.value;

      const signUpForm: SignUpForm = {
        username: formValue['username'],
        password: formValue['password'],
        role: this.role
      }

      this.authentificationService.signup(signUpForm).subscribe(() => {
        this.router.navigate(['login']);
      }, error => {

        if (error.status == 200)
          this.router.navigate(['login']);

        if (error.error == "Fail -> Email is already in use!")
          this.getF().username.setErrors({ 'usernameUsed': true });

      })
    }
  }

}
