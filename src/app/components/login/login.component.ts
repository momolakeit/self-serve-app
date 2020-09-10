import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignInForm } from '../../models/sign-in-form';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private route: Router, private authService: AuthentificationService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  getErrorMessage() {
    return this.userForm.controls['email'].hasError('required') ? 'You must enter a value' :
      this.userForm.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

  get f() {
    return this.userForm.controls;
  }


  onSubmitForm() {
    const formValue = this.userForm.value;

    this.authService.login(formValue['email'], formValue['password']).subscribe((success: boolean) => {
      if (success) {
        // this.authService.getEmployeDetails(formValue['email']).subscribe();
        this.route.navigate(['/acceuil']);
      } else {
        console.log("Error could not login");
      }
    });

  }

}
