import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {

  constructor(private http: HttpClient) { }

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;

  stripe; // : stripe.Stripe;
  card;
  cardErrors;

  loading = false;
  confirmation;


  ngOnInit() {
    
    this.stripe = Stripe('pk_test_your_key');
    const elements = this.stripe.elements();

    var card = elements.create("card");
    
    // Stripe injects an iframe into the DOM
    card.mount(".card-element");
    this.card.addEventListener('change', ({ error }) => {
        this.cardErrors = error && error.message;
    });
  }

  async handleForm(e) {
    e.preventDefault();

    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      // Inform the customer that there was an error.
      this.cardErrors = error.message;
    } else {
      // Send the token to your server.
      this.loading = true;
      //const user = await this.auth.getUser();
      //const fun = this.functions.httpsCallable('stripeCreateCharge');
      //this.confirmation = await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise();
      this.loading = false;

    }
  }

}
