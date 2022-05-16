import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { InterCommunicationService } from 'src/app/services/inter-communication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  signupForm: FormGroup;;
  isPasswordMatch=true;
  isContactNumberValid=true;
  invalidFile=false;
  base64Image: any;
  imgDataPost:Uint8Array;
  isLoading=false;
  serverErrorResponse:string;

  constructor(private _domSanitizer:DomSanitizer, private _apiService:ApiService, private _router:Router, private _interComm:InterCommunicationService) {
  }

  ngOnInit(): void {
    this.signupForm=new FormGroup({
      'firstName' : new FormControl(null,Validators.required),
      'lastName' : new FormControl(null,Validators.required),
      'email' : new FormControl(null,[Validators.required,Validators.email],this.forbiddenEmails),
      'loginId' : new FormControl(null,[Validators.required,Validators.minLength(5),Validators.maxLength(10)],this.forbiddenUsernames),
      'contactNumber' : new FormControl(null,[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      'password' : new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(18)]),
      'confirmPassword' : new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(18)]),
      'avatar' : new FormControl(null, Validators.required)
    });
  }

  onFileChanged(event:Event){   
    const file=(event.target as  HTMLInputElement) .files?.item(0);
    if(file?.type === 'image/jpeg' || file?.type === 'image/png'){
      file.arrayBuffer().then(resp=>{
        let ui8 = new Uint8Array(resp);
        let rawData = [...ui8];
        let blob1 = new Blob([new Uint8Array(rawData)],{type:'image/png'})
        let imgURL=URL.createObjectURL(blob1);
        this.base64Image = this._domSanitizer.bypassSecurityTrustUrl(imgURL);
        this.imgDataPost=Object.assign([], ui8);
      })
      this.invalidFile=false;
    }
    else      
      this.invalidFile=true;
  }

  onSubmit(){     
    this.isContactNumberValid=true;
    this.isPasswordMatch=true;  

    if(!this.signupForm.valid){
      return;
    }    

    let user:User={      
      firstName:this.signupForm.get('firstName').value,
      lastName:this.signupForm.get('lastName').value,
      loginId:this.signupForm.get('loginId').value,
      email:this.signupForm.get('email').value,
      contactNumber:this.signupForm.get('contactNumber').value,
      password:this.signupForm.get('password').value,
      confirmPassword:this.signupForm.get('confirmPassword').value,
      avatar:btoa(String.fromCharCode.apply(null, this.imgDataPost))
    }    
    if((user.password !== user.confirmPassword)){
      this.isPasswordMatch=false;
      return;
    }
    if((isNaN(this.signupForm.get('contactNumber').value))){
      this.isContactNumberValid=false;
      return;
    }         

    if(this.isPasswordMatch && this.isContactNumberValid){      
      this.isLoading=true;  
      this._apiService.registerUser(user).subscribe(
        responseMessage =>{     
          this._interComm.setOtpGeneratedtime(new Date());   
          this._interComm.setuserNameToValidate(user.loginId);  
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
    this.isContactNumberValid=true;
    this.isPasswordMatch=true;
    this.signupForm.reset();
    this.invalidFile=false;
    this.base64Image=null;
  }  

  forbiddenEmails(control: FormControl):Promise<any> | Observable<any>{
    const promise= new Promise<any>((resolve,reject)=>{
      if(false)
        resolve({'isForbidden':true});
      resolve(null);  
    }); 
    return promise;    
  }

  forbiddenUsernames(control: FormControl):Promise<any> | Observable<any>{
    const promise= new Promise<any>((resolve,reject)=>{      
      if(false)
        resolve({'isForbidden':true});
      resolve(null);     
    }); 
    return promise;    
  }
}

