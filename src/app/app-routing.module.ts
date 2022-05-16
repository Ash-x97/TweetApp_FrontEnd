import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TweetDetailComponent } from './components/tweets/tweet-detail/tweet-detail.component';
import { TweetsComponent } from './components/tweets/tweets.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { UsersComponent } from './components/users/users.component';
import { ValidateAccountComponent } from './components/validate-account/validate-account.component';
import { AntiAuthGuard } from './gaurds/anti-auth.guard';
import { AuthGuard } from './gaurds/auth.guard';

const routes: Routes = [
  { path: '' , redirectTo: '/home' ,pathMatch: 'full' },
  { path: 'home' ,component: HomeComponent, canActivate:[AuthGuard] },
  { path: 'login' ,component: LoginComponent, canActivate:[AntiAuthGuard] },
  { path: 'register' ,component: RegisterComponent, canActivate:[AntiAuthGuard] },
  { path: 'validate' ,component: ValidateAccountComponent, canActivate:[AntiAuthGuard] },
  { path: 'users' ,component: UsersComponent, canActivate:[AuthGuard],children:[
    { path: '' ,redirectTo: '/users', pathMatch: 'full'},
    { path: ':id/detail' ,component: UserDetailComponent },
  ]},  
  { path: 'tweets',component:TweetsComponent, canActivate:[AuthGuard], children: [
    { path: '' ,redirectTo: '/tweets', pathMatch: 'full'},
    { path: ':id/detail' ,component: TweetDetailComponent }
  ]},
  { path: '**', redirectTo:'/home', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
