import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ContactForm} from '../models/contact-form'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private httpClient:HttpClient) { }

  sendContactForm (contactForm:ContactForm,email:string):Observable<string>{
    return this.httpClient.post<string>(environment.contactFormUrl + `/${email}`,contactForm);
  }
}
