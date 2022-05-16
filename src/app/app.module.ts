import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { TweetsComponent } from './components/tweets/tweets.component';
import { HomeComponent } from './components/home/home.component';
import { TweetDetailComponent } from './components/tweets/tweet-detail/tweet-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ValidateAccountComponent } from './components/validate-account/validate-account.component';
import { TweetRenderComponent } from './components/tweets/tweet-render/tweet-render.component';

import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CpPlaceholderDirective } from './directives/cp-placeholder.directive';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { UserRenderComponent } from './components/users/user-render/user-render.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { UserTweetsComponent } from './components/tweets/user-tweets/user-tweets.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    TweetsComponent,
    HomeComponent,
    TweetDetailComponent,
    LoadingSpinnerComponent,
    ValidateAccountComponent,
    TweetRenderComponent,
    ChangePasswordComponent,
    CpPlaceholderDirective,
    NotificationsComponent,
    UserRenderComponent,
    UserDetailComponent,
    UserTweetsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
