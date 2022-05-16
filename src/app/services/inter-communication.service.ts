import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterCommunicationService {

  private otpGenerationTime:Date;
  private usernameToValidate:string;

  constructor(private _auth:AuthService) { }

  getOtpGeneratedtime():Date{
    return this.otpGenerationTime;
  }

  setOtpGeneratedtime(expTime:Date):void{
    this.otpGenerationTime=expTime;
  }

  getuserNameToValidate(){
    return this.usernameToValidate;
  }

  setuserNameToValidate(username:string){
    this.usernameToValidate=username;
  }     
}
