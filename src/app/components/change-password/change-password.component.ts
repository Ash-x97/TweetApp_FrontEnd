import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

export interface ChangePasswordModel{
  oldPassword:string;
  newPassword:string;
  confirmNewPassword:string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @Input() user:string;
  @Output() close=new EventEmitter<void>();

  serverErrorResponse:string;
  serverSuccessResponse:string;
  cpForm:FormGroup;
  isLoading:boolean=false;

  constructor(private _api:ApiService) { }

  ngOnInit(): void {
    this.cpForm=new FormGroup({     
      'oldPassword' : new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(18)],),
      'newPassword' : new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(18)]),      
      'confirmNewPassword' : new FormControl(null,[Validators.required,Validators.minLength(6),Validators.maxLength(18)]),      
    });
  }

  changePassword(){
    if(this.cpForm.invalid){
      return;
    }        
    const cpObject={
      oldPassword:this.cpForm.get('oldPassword')?.value,
      newPassword:this.cpForm.get('newPassword')?.value,
      confirmNewPassword:this.cpForm.get('confirmNewPassword')?.value
    }
    if(cpObject.newPassword !== cpObject.confirmNewPassword){
        this.serverErrorResponse= 'New password and confirm new password are different.'
        return;
    }

    this.serverErrorResponse=null;

    this.isLoading=true;
    this._api.changePassword(cpObject,this.user).subscribe(
      successMessage=>{
        this.serverSuccessResponse=successMessage;
        this.isLoading=false;
        this.serverErrorResponse=null;
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
        this.serverSuccessResponse=null;
      }
    );
  }

  onClose(){
    this.close.emit();
  }

}
