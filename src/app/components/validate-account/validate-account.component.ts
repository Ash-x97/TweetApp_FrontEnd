import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { InterCommunicationService } from 'src/app/services/inter-communication.service';

interface TimeComponents{
  minutesLeft: number;
  secondsLeft: number;
}

@Component({
  selector: 'app-validate-account',
  templateUrl: './validate-account.component.html',
  styleUrls: ['./validate-account.component.css']
})
export class ValidateAccountComponent implements OnInit {
  otpForm:FormGroup;
  timeLeft$:Observable<TimeComponents>;
  isLoading:boolean;
  serverErrorResponse:string;
  stopTimer:boolean;
  isRedirected:boolean;

  constructor(private _router:Router, private _interComm:InterCommunicationService, private _api:ApiService) { }

  ngOnInit(): void {   
    if(this._interComm.getOtpGeneratedtime() != null)
      this.isRedirected=true;
    else
      this.isRedirected=false;

    this.startExpiringTimer();
    this.otpForm=new FormGroup({
      'otp' : new FormControl(null,[Validators.required,Validators.maxLength(6),Validators.minLength(6),]),      
    });
  }

  onSubmit(){
    if(this.otpForm.invalid){
      return;
    }
    this.isLoading=true;
    this._api.validateUser(this.otpForm.get('otp').value).subscribe(
      rseponseData=>{
        this._interComm.setOtpGeneratedtime(null);
        this._interComm.setuserNameToValidate(null);
        setTimeout(function() { alert('Account successfully activated. Please login to continue.'); }, 1);
        localStorage.clear();
        this._router.navigate(['/login']);
        this.isLoading=false;
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }

  verifyEmail(){
    localStorage.clear();
    this.isLoading=true;
    this._api.verifyUser(this._interComm.getuserNameToValidate()).subscribe(
      responseMessage =>{     
        this._interComm.setOtpGeneratedtime(new Date());
        this.isLoading=false;
        this.stopTimer=false;
        this.otpForm.reset();
        this._router.navigate(['/validate']);
      },
      error =>{
        console.log(error);
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }

  startExpiringTimer(){
    this.timeLeft$ = interval(1000).pipe(
      map(x => this.calculateTimeDiff(this._interComm.getOtpGeneratedtime(),5)),
      shareReplay(1)
    )   
  }

  calculateTimeDiff(initialDate:Date, interval:number):TimeComponents{

    if(!initialDate || this.stopTimer){
      this.stopTimer=true;
      return { minutesLeft:0, secondsLeft:0 }  
    }
    let futureDate= initialDate?.valueOf()+(interval*60000);
    if(!(futureDate < new Date().valueOf())){
      const timeDifference= futureDate - Date.now(); 
      const minutesLeft = Math.floor((timeDifference / (1000 * 60)) % 60);
      const secondsLeft = Math.floor(timeDifference / 1000) % 60;

      if( minutesLeft===0 && secondsLeft===0)
        this.stopTimer=true;
      return {minutesLeft, secondsLeft}
    } 
    return { minutesLeft:0, secondsLeft:0 }    
  }  
}
