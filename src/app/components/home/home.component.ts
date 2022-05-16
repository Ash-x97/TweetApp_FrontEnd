import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CpPlaceholderDirective } from 'src/app/directives/cp-placeholder.directive';
import { Tag, Tweet } from 'src/app/models/tweet.model';
import { CustomNotification, User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { TweetService } from 'src/app/services/tweet.service';
import { UserService } from 'src/app/services/user.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {
  @ViewChild(CpPlaceholderDirective, {static:false}) cpHost:CpPlaceholderDirective;
  cpSubscription:Subscription;
  username:string;
  serverErrorResponse:string=null;
  isLoading:boolean=false;
  isCreateLoading:boolean=false;
  user:User;
  proPic:any;
  createTweetForm:FormGroup;
  tweetError:string;
  isNotificationPanel:boolean=false;
  unreadNotiCount:number;

  constructor(private _auth:AuthService, private _api:ApiService, private _router:Router, private _tweet:TweetService, private _user:UserService, private _componentFactory:ComponentFactoryResolver) { }

  ngOnInit(): void {
    this._auth.logincred.subscribe(
      loginCred=>{
        this.username=loginCred.username;
      }
    );
    
    this.createTweetForm=new FormGroup({
      'message' : new FormControl(null,[Validators.required,Validators.minLength(1),Validators.maxLength(144)],),
    });
    this.getUserDetails();
  }

  ngOnDestroy(): void {
    if(this.cpSubscription){
      this.cpSubscription.unsubscribe();
    }
  }

  getUserDetails(){    
    if(!this.username){
      return;
    }

    this.isLoading=true
    this._api.getUserDetailsByUsername(this.username).subscribe(
      user=>{        
        this.user= Object.assign({}, user)
        this.proPic=this._user.renderImagefromresponse(user.avatar);
        this.unreadNotiCount=user.notifications?.filter(noti=>!noti.isSeen).length;
        console.log(this.unreadNotiCount);
        this.isLoading=false;
        this.serverErrorResponse=null;
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }  

  onCreate(){
    const tweetMessage=this.createTweetForm.get('message').value;
    if(this.createTweetForm.invalid){      
      if(!tweetMessage)
        this.tweetError="Tweet message cannot be empty."
      else{
        this.tweetError="Maximum of 144 characters are allowed. Current : "+ tweetMessage.length;
      }  
      return;
    }

    this.tweetError=null;
    const tags:Tag[]=this._tweet.findTaggedMembers(tweetMessage);
    const tweet:Tweet={
      loginId:this.username,
      text:tweetMessage,
      tags: tags.length > 0 ? tags : null
    };

    this.isLoading=true;
    this._api.createTweet(tweet).subscribe(
      message=>{
        setTimeout(function() { alert(message); }, 1);
        this.isLoading=false;
        this.tweetError=null;
        this.serverErrorResponse=null;
        this._router.navigateByUrl('/tweets', { skipLocationChange: true }).then(() => {
          this._router.navigate(['/home']);
        });
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }  

  triggerNotiPanel(){
    this.isNotificationPanel=!this.isNotificationPanel;
  }

  updatedNotifications(notifications:CustomNotification[]){
    this.user.notifications=notifications;
    this.isLoading=true;
    this._api.updateNotifications(this.user.loginId,this.user.notifications).subscribe(
      resp=>{
        this.isLoading=false;
        this.serverErrorResponse=null;
        this._router.navigateByUrl('/tweets', { skipLocationChange: true }).then(() => {
          this._router.navigate(['/home']);
        });
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }

  onChangePassword(){
    const cpFactory=this._componentFactory.resolveComponentFactory(ChangePasswordComponent)
    const hostViewContainerRef=this.cpHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(cpFactory);
    componentRef.instance.user = this.username;
    this.cpSubscription = componentRef.instance.close.subscribe(()=>{
      this.cpSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
