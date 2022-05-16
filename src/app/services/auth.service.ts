import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

class AuthModel{
  constructor(
    public loggedIn:boolean,
    public username:string,
    private _token:string,
    private _tokenExpireOn:Date
  ){}

  get token(){
    if(!this._tokenExpireOn || new Date() > this._tokenExpireOn){
      return null;
    }
    return this._token;
  }

  get tokenExpireOn(){
    return this._tokenExpireOn;
  }
}

@Injectable({ providedIn:'root' })
export class AuthService {
  logincred=new BehaviorSubject<AuthModel>(null);
  private tokenExpirationTimer:any;
  constructor() { }

  autoLogin(){
    const userCred:{
      loggedIn:boolean,
      username:string,
      _token:string,
      _tokenExpireOn:Date
    }=JSON.parse(localStorage.getItem('currentUser'));  
    if(!userCred){
      return;
    }    
    const loadedUser:AuthModel= new AuthModel(userCred.loggedIn, userCred.username, userCred._token,new Date(userCred._tokenExpireOn));
    if(loadedUser.token){      
      this.logincred.next(loadedUser);      
      const expirationDuration=new Date(userCred._tokenExpireOn).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logoutUser();
    },expirationDuration);
  }

  loginUser(username:string,token:string){
    const expiresIn=JSON.parse(window.atob(token.split('.')[1])).exp;
    const expireOn=new Date(new Date(expiresIn*1000));
    const user=new AuthModel(true,username,token,expireOn);
    this.logincred.next(user); 
    this.autoLogout(expireOn.getTime() - new Date().getTime())
    localStorage.setItem('currentUser',JSON.stringify(user));
  }

  logoutUser(){
    this.logincred.next(new AuthModel(false,null,null,null));
    localStorage.removeItem('currentUser');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer=null;
  }
}
