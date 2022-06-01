import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomNotification, User } from '../models/user.model';
import { catchError, map } from 'rxjs/operators'
import { throwError } from 'rxjs';
import { InterCommunicationService } from './inter-communication.service';
import { Login } from '../models/login.model';
import { AuthService } from './auth.service';
import { Reply, Tweet } from '../models/tweet.model';
import { ChangePasswordModel } from '../components/change-password/change-password.component';

@Injectable({providedIn: 'root'})
export class ApiService {
  baseUrl:string="https://tweetappserver.azurewebsites.net/";//'https://localhost:44322/';
  isloggedIn:boolean=false;

  constructor(private _http:HttpClient, private _interComm:InterCommunicationService, private _auth:AuthService) { }

  registerUser(user:User){
    return this._http.post<{message:string,token:string}>(this.baseUrl + 'api/v1.0/tweet/register', user)
    .pipe(
      map(successResponse=>{
        if(successResponse.token)
          localStorage.setItem('token',successResponse.token);         
      }),
       catchError( errorResponse => {
        let errorMessage= "Server down. Please try again later !";
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'EMAIL_SENT_FAIL' : 
            errorMessage="Failed to send verification mail due to server error. Please activate account after some time.";
            break;
          case 'USER_EXISTS' : 
            errorMessage="User already exists in the server. please login with the credentials.";  
            break;
          case 'LOGIN_EMAIL_EXISTS' : 
            errorMessage="A user with same username or email already exists. please try using defferent username or email.";  
            break;
          case 'FAIL_VALIDATION' : 
            errorMessage="Data validation failed in server. please check the validation rules.";  
            break;  
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );    
  }

  verifyUser(username:string){
    return this._http.get<{message:string, token:string}>(this.baseUrl + 'api/v1.0/tweet/'+ username +'/verify')
    .pipe(
      map(successResponse=>{
        if(successResponse.token)
          localStorage.setItem('token',successResponse.token);  
      }),
       catchError( errorResponse => {
        console.log(errorResponse);
        let errorMessage= "Server down. Please try again later !";
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        switch(errorResponse.error.message){
          case 'EMAIL_SENT_FAIL' : 
            errorMessage="Email sent failed. Please try again.";
            break; 
          case 'ALREADY_ACTIVE' : 
            errorMessage="Account already active. You are ready for login.";
            break;    
          case 'INVALID_USER' : 
            errorMessage="Invalid username. Please try again.";
            break;                     
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  validateUser(otp:string){
    const user= this._interComm.getuserNameToValidate();
    return this._http.put<{message:string}>(this.baseUrl + 'api/v1.0/tweet/'+ user +'/validate', {otpValue:otp})
    .pipe(
      map(successResponse=>{
        return successResponse.message;     
      }),
       catchError( errorResponse => {
        let errorMessage= "Server down. Please try again later !";
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        switch(errorResponse.error.message){
          case 'INVALID_OTP' : 
            errorMessage="Invalid OTP. Please try again.";
            break;  
          case 'INVALID_USER' : 
            errorMessage="Invalid username. Please try again.";
            break;                     
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  loginUser(loginCred:Login){
    return this._http.post<{message:string,token:string}>(this.baseUrl + 'api/v1.0/tweet/login', loginCred)
    .pipe(
      map(successResponse=>{
        this._auth.loginUser(loginCred.loginId,successResponse.token);                      
      }),
       catchError( errorResponse => {
        console.log(errorResponse)
        let errorMessage= "Server down. Please try again later !";
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'NO_USER' : 
            errorMessage="No user found with provided username.";
            break;
          case 'PASSWORD_INCORRECT' : 
            errorMessage="Incorrect password.";  
            break;
          case 'INACTIVE' : 
            errorMessage="Account is not activated.";  
            break;
          case 'FAIL_VALIDATION' : 
            errorMessage="Please check the credentials. Validation failed.";  
            break;  
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  forgotPassword(user:string){
    return this._http.get<{message:string}>(this.baseUrl + 'api/v1.0/tweet/'+ user +'/forgot')
    .pipe(
      map(successResponse=>{
        return "Password reset successfull. Please check you mail for new password.";                     
      }),
       catchError( errorResponse => {
        console.log(errorResponse)
        let errorMessage= "Server down. Please try again later !";
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'ACC_INACTIVE_OR_NOUSER_FOUND' : 
            errorMessage="No active account found with provided username.";
            break;
          case 'INVALID_USERNAME' : 
            errorMessage="Invalid User.";  
            break;          
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  changePassword(cpModel:ChangePasswordModel,username:string){
    return this._http.put<{message:string}>(this.baseUrl + 'api/v1.0/tweet/'+ username +'/change',cpModel)
    .pipe(
      map(successResponse=>{
        return 'Password changed successfully.';                     
      }),
       catchError( errorResponse => {
        console.log(errorResponse)
        let errorMessage= "Server down. Please try again later !";
        if(!errorResponse.error.errors){        
          return throwError(errorMessage);
        }
        console.log(errorResponse.error.errors.message)
        switch(errorResponse.error.message){
          case 'SESSION_USER_CONFLICT' : 
            errorMessage="You are not authorized to reset password for this user";
            break;
          case 'PASS_CNFPASS_DIFF' : 
            errorMessage="Password and Confirm password values are different.";  
            break;
          case 'OLDPASS_WRONG' : 
            errorMessage="Current password provided is incorrect. Please try again.";  
            break;
          case 'INVALID' : 
            errorMessage="Please check the passwords. Validation failed at server.";  
            break;  
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  updateNotifications(loginId:string, notifications:CustomNotification[]){
    return this._http.put<{message:string}>(this.baseUrl + 'api/v1.0/tweet/'+ loginId +'/update', notifications)
    .pipe(
      catchError( errorResponse => {
        console.log(errorResponse)
        let errorMessage= "Server down. Please try again later !";
        if(!errorResponse.error.errors){        
          return throwError(errorMessage);
        }
        console.log(errorResponse.error.errors.message)
        switch(errorResponse.error.message){
          case 'SESSION_USER_CONFLICT' : 
            errorMessage="You are not authorized to reset password for this user";
            break;
          case 'UPDATE_FAIL' : 
            errorMessage="Updating notifications failed. please contact support for help.";  
            break;
          case 'NOTI_NULL' : 
            errorMessage="No notifications available for you to update.";  
            break;
          case 'FAIL_VALIDATION' : 
            errorMessage="Validation failed at server. Contact support for help";  
            break;  
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  getUserDetailsByUsername(user:string){
    return this._http.get<{user:User}>(this.baseUrl + 'api/v1.0/tweet/'+ user +'/details')
    .pipe(      
       map(respData=>{
        return respData.user;
       }),
       catchError( errorResponse => {
        console.log(errorResponse);
        let errorMessage= "Server down. Please try again later !";
        if(errorResponse.status === 401 ){
          errorMessage="Server : You are unauthorized to access server contents. please authenticate yourself."
        }
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'USER_NOT_FOUND' : 
            errorMessage="No user found with provided username.";
            break;
          case 'INVALID_USERNAME' : 
            errorMessage="Username validation failed";  
            break;          
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  getAllUsers(){
    return this._http.get<{users:User[]}>(this.baseUrl + 'api/v1.0/tweet/users/all')
    .pipe(      
       map(respData=>{
        return respData.users;
       }),
       catchError( errorResponse => {
        console.log(errorResponse);
        let errorMessage= "Server down. Please try again later !";
        if(errorResponse.status === 401 ){
          errorMessage="Server : You are unauthorized to access server contents. please authenticate yourself."
        }
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'NO_USERS' : 
            errorMessage="No user found with provided username.";
            break;           
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  createTweet(tweet:Tweet){
    return this._http.post<{message:string}>(this.baseUrl + 'api/v1.0/tweet/'+ tweet.loginId +'/add', tweet)
    .pipe(      
       map(respData=>{
        return "Tweet posted successfully.";
       }),
       catchError( errorResponse => {
        console.log(errorResponse);
        let errorMessage= "Server down. Please try again later !";
        if(errorResponse.status === 401 ){
          errorMessage="Server : You are unauthorized to access server contents. please authenticate yourself."
        }
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'ALREADY_EXISTS' : 
            errorMessage="Same tweet exists. Contact support if this happens frequently.";
            break;                  
          case 'SESSION_USER_CONFLICT' : 
            errorMessage="SessionUser conflict. contact support team.";
            break;
          case 'VALIDATION_FAIL' : 
            errorMessage="Tweet validation failed on server. contact support.";
            break;                 
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }  

  getAllTweets(){
    return this._http.get<{tweets:Tweet[]}>(this.baseUrl + 'api/v1.0/tweet/all')
    .pipe(      
       map(respData=>{
        return respData.tweets;
       }),
       catchError( errorResponse => {
        console.log(errorResponse);
        let errorMessage= "Server down. Please try again later !";
        if(errorResponse.status === 401 ){
          errorMessage="Server : You are unauthorized to access server contents. please authenticate yourself."
        }
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'NO_TWEETS' : 
            errorMessage="No tweet found.";
            break;                  
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  getTweetByUser(user:string){
    return this._http.get<{tweets:Tweet[]}>(this.baseUrl + 'api/v1.0/tweet/'+user)
    .pipe(      
       map(respData=>{
        return respData.tweets;        
       }),
       catchError( errorResponse => {
        console.log(errorResponse);
        let errorMessage= "Server down. Please try again later !";
        if(errorResponse.status === 401 ){
          errorMessage="Server : You are unauthorized to access server contents. please authenticate yourself."
        }
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'NO_TWEETS' : 
            errorMessage="No tweet found.";
            break; 
           case 'INVALID_LOGIN_ID' : 
            errorMessage="Invalid username. contact support for help.";
            break;                                
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  likeTweet(tweetId:string,likedBy:string){
    return this._http.put<{message:string}>(this.baseUrl + 'api/v1.0/tweet/'+ likedBy +'/like/'+ tweetId,{})
    .pipe(      
       map(respData=>{
        return respData.message;
       }),
       catchError( errorResponse => {
        console.log(errorResponse);
        let errorMessage= "Server down. Please try again later !";
        if(errorResponse.status === 401 ){
          errorMessage="Server : You are unauthorized to access server contents. please authenticate yourself."
        }
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'NO_UNLIKED_TWEETFOUND' : 
            errorMessage="No tweet found with provided tweetId whichn is not liked by you.";
            break;  
          case 'SESSION_USER_CONFILCT' : 
            errorMessage="Internal conflict on sessionUser. contact support.";
            break; 
          case 'INVALID_PARAMS' : 
            errorMessage="Invalid parameters login id and tweet id. please contact support.";
            break;                    
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }

  replyToTweet(reply:Reply, tweetId:string){   
    return this._http.post<{message:string}>(this.baseUrl + 'api/v1.0/tweet/'+ reply.loginId +'/reply/'+ tweetId, reply)
    .pipe(      
       map(respData=>{
        return respData.message;
       }),
       catchError( errorResponse => {
        console.log(errorResponse);
        let errorMessage= "Server down. Please try again later !";
        if(errorResponse.status === 401 ){
          errorMessage="Server : You are unauthorized to access server contents. please authenticate yourself."
        }
        if(!errorResponse.error){        
          return throwError(errorMessage);
        }
        
        switch(errorResponse.error.message){
          case 'NO_TWEET_FOUND' : 
            errorMessage="No tweet found with provided tweetId.";
            break;  
          case 'SESSION_USER_CONFILCT' : 
            errorMessage="Internal conflict on sessionUser. contact support.";
            break; 
          case 'INVALID_PARAMS' : 
            errorMessage="Invalid parameters login id and tweet id. please contact support.";
            break;                    
          case 'EXCEPTION' : 
            errorMessage="Internal Exception Occured. ExceptionId : "+errorResponse.error.id;  
            break;                
        }
        return throwError(errorMessage);
      })
    );
  }
}
