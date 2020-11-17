import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { SignInForm } from 'src/app/models/sign-in-form';
import { error } from '@angular/compiler/src/util';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userForm: FormGroup;
  constructor(private authService: AuthService,private formBuilder: FormBuilder, private route: Router, private authentificationService: AuthentificationService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  getF() {
    return this.userForm.controls;
  }


  onSubmitForm() {
    const formValue = this.userForm.value;

    const signInForm: SignInForm = {
      username: formValue['username'],
      password: formValue['password']
    }

    this.authentificationService.login(signInForm).subscribe((success: boolean) => {
      if (success) this.authService.findRoleThenRedirect(this.route);
      else {
        this.getF().username.setErrors({ badCredentials: true });
        this.getF().password.setErrors({ badCredentials: true });
      }

    }, error => {
      this.getF().username.setErrors({ badCredentials: true });
      this.getF().password.setErrors({ badCredentials: true });
    });

  }
}
