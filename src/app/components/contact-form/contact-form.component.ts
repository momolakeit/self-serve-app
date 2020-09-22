import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SupportService} from '../../services/support.service';
import { ContactForm } from 'src/app/models/contact-form';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  contactForm:FormGroup;

  constructor(private formBuilder:FormBuilder,private supportService:SupportService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.contactForm = this.formBuilder.group({
      contactType:['',Validators.required],
      comment:['',Validators.required]
    })
  }

  onSubmitForm(){
    if (this.contactForm.valid) {
      
      const formValue = this.contactForm.value;
      const newContactForm:ContactForm = {
        contactType: formValue['contactType'],
        comment: formValue['comment']
      }

      //TODO: remove this line
      localStorage.setItem('Email','faboryb@gmail.com');
      this.supportService.sendContactForm(newContactForm,localStorage.getItem('Email')).subscribe();
      this.contactForm.reset();
    }
  }

}
