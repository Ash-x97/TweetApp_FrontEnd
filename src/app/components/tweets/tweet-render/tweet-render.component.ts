import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
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
  selector: 'app-tweet-render',
  templateUrl: './tweet-render.component.html',
  styleUrls: ['./tweet-render.component.css']
})
export class TweetRenderComponent implements OnInit {

  @Input() tweet:RenderModel;
  @Output() tweetSelected= new EventEmitter<void>();
  @Output() userSelected= new EventEmitter<void>();

  isItemSelected:boolean=false;
  selectedId:string;

  constructor(private _tweet:TweetService, private _user:UserService, private _api:ApiService) { }

  ngOnInit(): void {
    this._tweet.selectedTweet.subscribe(
      res=>{
        if(res){
          this.isItemSelected=true;  
          this.selectedId=res.id;
        }
      }
    );
  }

  onSelectTweet(){
    this.tweetSelected.emit();
  }

  onSelectUser(){
    let user:User;
    this._api.getUserDetailsByUsername(this.tweet.loginId).subscribe(
      respUser=>{
        user=Object.assign({},respUser);
        this._user.selectUser(user);
        this._user.activateModal();
        this.userSelected.emit();
      }
    );    
  }

}
