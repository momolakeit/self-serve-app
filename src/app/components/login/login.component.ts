import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { SignInForm } from 'src/app/models/sign-in-form';

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
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.userForm.controls;
  }


  onSubmitForm() {
    const formValue = this.userForm.value;

    const signInForm: SignInForm = {
      username:formValue['username'],
      password:formValue['password']
    }

    this.authService.login(signInForm).subscribe((success: boolean) => {
      if (success) {
        this.route.navigate(['/menu']);
      } else {
        console.log("Error could not login");
      }
    });

  }

}
