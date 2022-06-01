import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

interface RenderModel{
  name:string,
  image:SafeUrl,
  username:string,
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit,OnDestroy {

  selectedSubscription:Subscription;
  modalSubscription:Subscription;

  withModal:boolean=false;
  isModalOpen:boolean=false;
  users:User[]=[];
  isLoading:boolean=false;
  serverErrorResponse:string;
  renderModel:RenderModel[]=[];
  isItemSelected:boolean=false;
  selectedId:string;

  constructor(private _api:ApiService, private _user:UserService, private _router:Router) { }

  ngOnInit(): void {
    this.getAllUsers();   
    this._user.selectedUser.subscribe(
      res=>{
        if(res){
          this.isItemSelected=true;  
          this.selectedId=res.id;
        }
      }
    );
    this._user.withModal.subscribe(
      withModal=>{
        console.log(withModal)
        this.withModal=withModal;
      }
    );
  }

  ngOnDestroy(): void {
    this.modalSubscription?.unsubscribe();
    this.selectedSubscription?.unsubscribe();
  }

  getAllUsers(){
    this.isLoading=true;
    this._api.getAllUsers().subscribe(
      usersArray=>{
        this.users= Object.assign([], usersArray)
        this.createRenderModel();
        this.isLoading=false;
        this.serverErrorResponse=null;
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }

  createRenderModel(){
    this.users.forEach(user => {
      const rendermodel={
        name: user.firstName + ' ' + user.lastName,
        image: this._user.renderImagefromresponse(user.avatar),
        username: user.loginId
      }

      this.renderModel.push(rendermodel);
    });
  }

  onSelectUser(username:string){
    let user= this.users.find( user => user.loginId === username);
    this._user.selectUser(user);

    if(this.withModal){
      this.isModalOpen=true; 
      return;     
    }

    this._router.navigate(['/users/'+username+'/detail'])
  }

  onModalClose(){
    this._user.deactivateModal();
    this.isModalOpen=!this.isModalOpen;
    this._router.navigateByUrl('/users', { skipLocationChange: true }).then(() => {
      this._router.navigate(['/home']);
    });
  }

}
