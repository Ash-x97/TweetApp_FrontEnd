import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Tweet } from 'src/app/models/tweet.model';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { TweetService } from 'src/app/services/tweet.service';
import { UserService } from 'src/app/services/user.service';

interface RenderModel{  
  tweetId:string,
  loginId:string, 
  message:string,
  createdSince:string,
  avatar:SafeUrl,
  likes:number,
  replies:number
}

@Component({
  selector: 'app-user-tweets',
  templateUrl: './user-tweets.component.html',
  styleUrls: ['./user-tweets.component.css']
})
export class UserTweetsComponent implements OnInit,OnDestroy {

  userSub:Subscription
  isModalOpen:boolean=false;
  selectedUser:User;
  renderModel:RenderModel[]=[];
  tweets:Tweet[]=[];
  isLoading:boolean=false;
  serverErrorResponse:string;
  
  constructor(private _api:ApiService, private _user:UserService, private _tweet:TweetService) { }

  ngOnInit(): void {
    this._user.selectedUser.subscribe(
      user=>{
        this.selectedUser=user;
        this.getTweets();
      }
    );    
  }

  getTweets(){
    this.isLoading=true;
    this._api.getTweetByUser(this.selectedUser.loginId).subscribe(
      tweetsArray=>{
        this.tweets= Object.assign([], tweetsArray)
        this.bindUsersToTweets();
        this.isLoading=false;
        this.serverErrorResponse=null;
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  onSelectUser(){
    
  }

  onSelectTweet(tweetId:string){
    let tweet= this.tweets.find( tweet => tweet.id === tweetId);
    this._tweet.selectTweet(tweet);
    this.isModalOpen=true; 
    return;     
  }

  bindUsersToTweets(){
    if(this.renderModel.length>0){
      this.renderModel=[];
    }
    this.tweets.forEach(tweet => {   
      let tweetToRender={           
        tweetId:tweet.id,
        loginId:this.selectedUser.loginId,
        message:tweet.text,
        createdSince:moment(tweet.createdTime).fromNow(),
        avatar: this._user.renderImagefromresponse(this.selectedUser.avatar),
        likes: tweet.likes ? tweet.likes.length : 0,
        replies: tweet.replies ? tweet.replies.length : 0
      }; 
      this.renderModel.splice(this.tweets.indexOf(tweet),0,tweetToRender);
    });   
  }

  onModalClose(){
    this.isModalOpen=false;
  }

}
