import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { InterCommunicationService } from 'src/app/services/inter-communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  isLoading:boolean=false;
  serverErrorResponse:string;
  serverSuccessResponse:string;
  validUsernametoActivate:boolean=true;

  constructor(private _router:Router, private _interComm:InterCommunicationService, private _api:ApiService) { }

  ngOnInit(): void {  
    this.loginForm=new FormGroup({     
      'loginId' : new FormControl(null,[Validators.required,Validators.minLength(5),Validators.maxLength(10)],),
      'password' : new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(18)]),      
    });
  }

  onSubmit(){
    if(!this.loginForm.valid){
      return;
    }    

    let loginCred:Login={            
      loginId:this.loginForm.get('loginId').value,
      password:this.loginForm.get('password').value,      
    }    
    
    this.isLoading=true;  
      this._api.loginUser(loginCred).subscribe(
        responseMessage =>{     
          this._router.navigate(['/home']);
          this.isLoading=false;
        },
        error =>{
          this.serverErrorResponse=error;
          this.isLoading=false;
        }
      );  
    this.loginForm.reset();
  }

  verifyEmail(){        
    const username:string=this.loginForm.get('loginId').value
    if(!username){
      this.validUsernametoActivate=false;
      return;
    }

    this.validUsernametoActivate=true;
    this.isLoading=true;
    this._api.verifyUser(username).subscribe(
      responseMessage =>{     
        this._interComm.setOtpGeneratedtime(new Date());   
        this._interComm.setuserNameToValidate(username);
        this._router.navigate(['/validate']);
        this.isLoading=false;
      },
      error =>{
        console.log(error);
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }

  forgotPassword(){
    const username:string=this.loginForm.get('loginId').value
    if(!username){
      this.validUsernametoActivate=false;
      return;
    }

    this.validUsernametoActivate=true;
    this.isLoading=true;
    this._api.forgotPassword(username).subscribe(
      responseData=>{
        this.serverErrorResponse=null;
        this.serverSuccessResponse=responseData;
        this.isLoading=false;
      },
      error=>{
        console.log(error);
        this.serverSuccessResponse=null;
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );

  }
}
