import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  userSubscription:Subscription;
  isLoading:boolean=false;
  serverErrorResponse:string;
  profilePic:SafeUrl;
  user:User;

  constructor(private _user:UserService) { }

  ngOnInit(): void {
    this._user.selectedUser.subscribe(
      user=>{
        this.user=Object.assign({},user);
        this.profilePic=this._user.renderImagefromresponse(user.avatar);
      }
    );
  }
}
