import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
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
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit {  
  @Input() withModal=false; 
  isModalOpen:boolean=false;
  tweets:Tweet[]=[];
  users:User[]=[];
  isLoading:boolean=false;
  serverErrorResponse:string;
  renderModel:RenderModel[]=[];
  isItemSelected:boolean=false;
  selectedId:string;

  constructor(private _api:ApiService, private _tweet:TweetService, private _router:Router, private _user:UserService) { }

  ngOnInit(): void {
    this.getAllUsers();      
    this._tweet.selectedTweet.subscribe(
      res=>{
        if(res){
          this.isItemSelected=true;  
          this.selectedId=res.id;
        }
      }
    );    
  }

  getAllUsers(){    
    this._api.getAllUsers().subscribe(
      usersArray=>{
          this.users=Object.assign([],usersArray);
          this.getAllTweets(); 
          this.serverErrorResponse=null;
          this.isLoading=false;
      },
      error=>{
        this.serverErrorResponse=error;
        this.isLoading=false;
      }
    );
  }

  getAllTweets(){
    this.isLoading=true;
    this._api.getAllTweets().subscribe(
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

  onSelectTweet(tweetId:string){
    let tweet= this.tweets.find( tweet => tweet.id === tweetId);
    this._tweet.selectTweet(tweet);

    if(this.withModal){
      this.isModalOpen=true; 
      return;     
    }

    this._router.navigate(['/tweets/'+tweetId+'/detail'])
  }

  onSelectUser(loginId:string){
    
    this._router.navigate(['/users/'+loginId+'/detail'])
  }

  bindUsersToTweets(){ 
    this.tweets.forEach(tweet => {        
      let tweeter=this.users.find(user=>user.loginId === tweet.loginId);
      let tweetToRender={           
        tweetId:tweet.id,
        loginId:tweeter.loginId,
        message:tweet.text,
        createdSince:moment(tweet.createdTime).fromNow(),
        avatar: this._user.renderImagefromresponse(tweeter.avatar),
        likes: tweet.likes ? tweet.likes.length : 0,
        replies: tweet.replies ? tweet.replies.length : 0
      };        
      this.renderModel.splice(this.tweets.indexOf(tweet),0,tweetToRender);
    });
  }  

  onModalClose(){
    this.isModalOpen=!this.isModalOpen;
  }

}
