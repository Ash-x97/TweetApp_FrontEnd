import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag, Tweet } from '../models/tweet.model';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  selectedTweet=new BehaviorSubject<Tweet>(null);

  constructor() { }

  selectTweet(tweet:Tweet){
    this.selectedTweet.next(tweet);
  }

  deselectTweet(){
    this.selectedTweet=null;
  }

  findTaggedMembers(message:string){
    let resultArray:Tag[]=[];
    const wordsArray=message.split(' ');
    wordsArray.forEach(element => {
      if(element[0] === '@')        
        resultArray.push({taggedUser:element.substring(1), isNotified: false});
    });    
    console.log(resultArray)
    return resultArray;
  }

}
