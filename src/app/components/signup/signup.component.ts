import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(private formBuilder: FormBuilder, private authentificationService: AuthentificationService,private router: Router) { }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.signUpForm = this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required],
      confirmPassword: ['',Validators.required]
    },{
      validator: MustMatch('password','confirmPassword')
    })
  }

  getF(){
    return this.signUpForm.controls;
  }

  onSubmitForm(){
    if (this.signUpForm.valid) {
      const formValue = this.signUpForm.value;

      const signUpForm: SignUpForm = {
        username: formValue['username'],
        password: formValue['password'],
        role: 'client'
      }

      this.authentificationService.signup(signUpForm).subscribe(() => this.router.navigate(['login']));
    }
  }

}
