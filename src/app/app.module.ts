import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StartComponent } from './components/start/start.component';
import { DishDetailComponent } from './components/dish-detail/dish-detail.component';
import { RestaurentOrdersComponent } from './components/restaurent-orders/restaurent-orders.component';
import { TableDetailPageComponent } from './components/table-detail-page/table-detail-page.component';
import { PaymentChoiceComponent } from './components/payment-choice/payment-choice.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ClientRequestListComponent } from './components/client-request-list/client-request-list.component';
import { JwtModule } from '@auth0/angular-jwt';
import {DemoMaterialModule} from 'src/material-module';
import { AdminProductManagmentComponent } from './components/admin-product-managment/admin-product-managment.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { RecipeSocketComponent } from './components/recipe-socket/recipe-socket.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { ContactFormComponent } from './components/contact-form/contact-form.component'
import { HttpClientModule } from '@angular/common/http';
import { MenuproductComponent } from './components/menuproduct/menuproduct.component';
import { CommonModule } from '@angular/common';
import { RestaurentDishDetailViewComponent } from './components/restaurent-dish-detail-view/restaurent-dish-detail-view.component';
import { ProductCreationFormComponent } from './components/product-creation-form/product-creation-form.component';
import { ClientRequestItemComponent } from './components/client-request-item/client-request-item.component';
import { ClientRequestItemDetailComponent } from './components/client-request-item-detail/client-request-item-detail.component';  
import { ParticlesModule } from 'ngx-particle';
import { WaiterRequestListComponent } from './components/waiter-request-list/waiter-request-list.component';
import { RestaurantOwnerListComponent } from './components/restaurant-owner-list/restaurant-owner-list.component';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    WaiterComponent,
    NotFoundComponent,
    LoginComponent,
    SignupComponent,
    StartComponent,
    DishDetailComponent,
    RestaurentOrdersComponent,
    TableDetailPageComponent,
    AdminProductManagmentComponent,
    ProductFormComponent,
    PaymentChoiceComponent,
    PaymentFormComponent,
    ClientRequestListComponent,
    RecipeSocketComponent,
    ContactFormComponent,
    MenuproductComponent,
    RestaurentDishDetailViewComponent,
    ProductCreationFormComponent,
    ClientRequestItemComponent,
    ClientRequestItemDetailComponent,
    WaiterRequestListComponent,
    RestaurantOwnerListComponent,
    RestaurantFormComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatCarouselModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ParticlesModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("token");
        },
        allowedDomains: ["localhost:8080"],
        disallowedRoutes: ["localhost:8080/auth/signin", "localhost:8080/auth/signup"]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
