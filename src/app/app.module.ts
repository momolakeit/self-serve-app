import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { PaymentComponent } from './components/payment/payment.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StartComponent } from './components/start/start.component';
import { DishDetailComponent } from './components/dish-detail/dish-detail.component';
import { RestaurentOrdersComponent } from './components/restaurent-orders/restaurent-orders.component';
import { TableDetailPageComponent } from './components/table-detail-page/table-detail-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ParticlesModule} from 'angular-particle';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    WaiterComponent,
    PaymentComponent,
    NotFoundComponent,
    LoginComponent,
    SignupComponent,
    StartComponent,
    DishDetailComponent,
    RestaurentOrdersComponent,
    TableDetailPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
