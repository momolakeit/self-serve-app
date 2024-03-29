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
import { PaymentChoiceComponent } from './components/payment-choice/payment-choice.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientRequestListComponent } from './components/client-request-list/client-request-list.component';
import { JwtModule } from '@auth0/angular-jwt';
import { DemoMaterialModule } from 'src/material-module';
import { AdminProductManagmentComponent } from './components/admin-product-managment/admin-product-managment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { ContactFormComponent } from './components/contact-form/contact-form.component'
import { HttpClientModule ,HttpClient } from '@angular/common/http';
import { MenuproductComponent } from './components/menuproduct/menuproduct.component';
import { CommonModule } from '@angular/common';
import { RestaurentDishDetailViewComponent } from './components/restaurent-dish-detail-view/restaurent-dish-detail-view.component';
import { ClientRequestItemComponent } from './components/client-request-item/client-request-item.component';
import { ClientRequestItemDetailComponent } from './components/client-request-item-detail/client-request-item-detail.component';
import { ParticlesModule } from 'ngx-particle';
import { RestaurantOwnerListComponent } from './components/restaurant-owner-list/restaurant-owner-list.component';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { ProductFormEditCreateComponent } from './components/product-form-edit-create/product-form-edit-create.component';
import { AddTableFormComponent } from './components/add-table-form/add-table-form.component';
import { OwnerSubscriptionComponent } from './components/owner-subscription/owner-subscription.component';
import { SubscriptionDetailsComponent } from './components/subscription-details/subscription-details.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { StripeAccountCreatePromptComponent } from './components/stripe-account-create-prompt/stripe-account-create-prompt.component';
import { MenuFormEditCreateComponent } from './components/menu-form-edit-create/menu-form-edit-create.component';
import { RestaurantMenuListComponent } from './components/restaurant-menu-list/restaurant-menu-list.component';
import { LogoutDialogComponent } from './components/logout-dialog/logout-dialog.component';
import { RestaurantEmployeesComponent } from './components/restaurant-employees/restaurant-employees.component';
import { SingleRestaurantEmployeesComponent } from './components/single-restaurant-employees/single-restaurant-employees.component';
import { RestaurantDishCookViewComponent } from './components/restaurant-dish-cook-view/restaurant-dish-cook-view.component';
import { OwnerBillsPageComponent } from './components/owner-bills-page/owner-bills-page.component';
import { jwtUrls } from 'src/environments/environment';

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
    AdminProductManagmentComponent,
    PaymentChoiceComponent,
    PaymentFormComponent,
    ClientRequestListComponent,
    ContactFormComponent,
    MenuproductComponent,
    RestaurentDishDetailViewComponent,
    ClientRequestItemComponent,
    ClientRequestItemDetailComponent,
    RestaurantOwnerListComponent,
    RestaurantFormComponent,
    ProductFormEditCreateComponent,
    AddTableFormComponent,
    OwnerSubscriptionComponent,
    SubscriptionDetailsComponent,
    AdminPageComponent,
    StripeAccountCreatePromptComponent,
    MenuFormEditCreateComponent,
    RestaurantMenuListComponent,
    LogoutDialogComponent,
    RestaurantEmployeesComponent,
    SingleRestaurantEmployeesComponent,
    RestaurantDishCookViewComponent,
    OwnerBillsPageComponent,
  ],
  imports: [
    CommonModule,
    ZXingScannerModule,
    BrowserModule,
    MatCarouselModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ParticlesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("token");
        },
        allowedDomains: jwtUrls.allowedDomains,
        disallowedRoutes: jwtUrls.disallowedRoutes
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
