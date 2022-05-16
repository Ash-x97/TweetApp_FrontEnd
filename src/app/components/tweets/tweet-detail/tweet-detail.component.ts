import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Reply, Tag, Tweet } from 'src/app/models/tweet.model';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { TweetService } from 'src/app/services/tweet.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tweet-detail',
  templateUrl: './tweet-detail.component.html',
  styleUrls: ['./tweet-detail.component.css']
})
export class TweetDetailComponent implements OnInit, OnDestroy {

  isLoading:boolean=false;
  serverErrorResponse:string;
  userSubscription:Subscription;
  tweetSubscription:Subscription;
  currentUser:string;
  profilePic:SafeUrl;
  tweetSince:string;
  tweet:Tweet;
  isLiked:boolean;

  replyForm:FormGroup;
  isSecondaryLoading:boolean=false;
  replyError:string;
  replyRender:{replier:string,text:string,timeSince:string}[]=[];

  constructor(private _tweet:TweetService, private _api:ApiService, private _auth:AuthService, private _router:Router, private _user:UserService) { }

  ngOnInit(): void {
    this.userSubscription=this._auth.logincred.subscribe(
      loginCred=>{
        this.currentUser = loginCred.username;
      }
    ); 

    this.tweetSubscription=this._tweet.selectedTweet.subscribe(
      tweet=>{
        this.tweet = Object.assign({},tweet);
        this.setProfilePic();
        this.isLiked=tweet.likes.includes(this.currentUser) ? true : false;     
        this.tweetSince=moment(this.tweet.createdTime).fromNow();
        this.mapReplyRender();        
      }
    );        
    
    this.replyForm=new FormGroup({
      'reply' : new FormControl(null,[Validators.required,Validators.minLength(1),Validators.maxLength(144)]),
    });
  }

  ngOnDestroy(): void {    
    this.tweetSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  setProfilePic(){
    this.isLoading=true;
    this._api.getUserDetailsByUsername(this.tweet.loginId).subscribe(
      user=>{
        this.profilePic = this._user.renderImagefromresponse(user.avatar);   
        this.serverErrorResponse=null;
        this.isLoading=false;
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }

  onLike(){
    if(this.isLiked){
      return;
    }    
    this.isSecondaryLoading=true;
    this._api.likeTweet(this.tweet.id,this.currentUser).subscribe(
      response=>{
        this.tweet.likes.push(this.currentUser);
        this.serverErrorResponse=null;
        this.isLiked=true;
        this.isSecondaryLoading=false;
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate(['tweets/'+ this.tweet.id +'/detail']);
        }); 
      },
      error=>{
        this.isSecondaryLoading=false;
        this.isLiked=false;
        this.serverErrorResponse=error;        
      }
    );
  }

  onReply(){
    const reply=this.replyForm.get('reply').value;
    if(this.replyForm.invalid){
      if(!reply)
        this.replyError="Reply cannot be empty."
      else{
        this.replyError="Maximum of 144 characters are allowed. Current : "+ reply.length;
      }
      return;
    }

    this.replyError=null;
    this.isSecondaryLoading=true;
    const tags:Tag[]=this._tweet.findTaggedMembers(reply);
    const replyObject:Reply={
      loginId:this.currentUser,
      replyText:reply,
      tags:tags.length > 0 ? tags : null
    };

    this._api.replyToTweet(replyObject,this.tweet.id).subscribe(
      response=>{
        if(this.tweet.replies){
          this.tweet.replies.push(replyObject);
          console.log(this.tweet.replies)
        }          
        else{
          this.tweet.replies=[replyObject];  
          this.mapReplyRender();           
        }
        this.serverErrorResponse=null;
        this.isLiked=true;
        this.isSecondaryLoading=false;
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this._router.navigate(['tweets/'+ this.tweet.id +'/detail']);
        }); 
      },
      error=>{
        console.log(error)
        this.isSecondaryLoading=false;
        this.isLiked=false;
        this.serverErrorResponse=error;        
      }
    );
  }

  mapReplyRender(){
    this.replyRender=[];
    if(this.tweet.replies)
      this.tweet.replies.forEach(reply => { 
        this.replyRender.push(
          { replier:reply.loginId, text: reply.replyText, timeSince:moment(reply.createdTime).fromNow() }
        );    
      });
  }

  userWithModal(){
    let user:User;
    this.isSecondaryLoading=true;
    this._api.getUserDetailsByUsername(this.tweet.loginId).subscribe(
      respUser=>{
        user=Object.assign({},respUser);
        this._user.selectUser(user);
        this._user.activateModal();
        this.isSecondaryLoading=false;
        this.serverErrorResponse=null;        
      }
    );    
  }
}
