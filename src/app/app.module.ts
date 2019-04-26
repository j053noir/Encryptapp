import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HeaderComponent } from './home/header/header.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './shared/http-interceptors/auth.interceptor';
import { AuthService } from './shared/services/auth.service';

const jwtModuleOptions = {
  config: {
    tokenGetter: () => localStorage.getItem(environment.tokenName),
  },
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    HeaderComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    JwtModule.forRoot(jwtModuleOptions),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
