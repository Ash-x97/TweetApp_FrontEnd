import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  
  constructor(private _auth:AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    const tokenLocal=localStorage.getItem('token');    
    if (tokenLocal) {
        const tokenAddedRequest = req.clone({
        setHeaders: { Authorization: 'Bearer '+ tokenLocal }        
     });
     return next.handle(tokenAddedRequest);
    }    
    else{
      return this._auth.logincred.pipe(
        take(1),
        exhaustMap(loginCred=>{
          if(!loginCred){
            return next.handle(req);
          }
          const tokenAddedRequest=req.clone({
            setHeaders: { Authorization: 'Bearer '+ loginCred.token }
          });
          return next.handle(tokenAddedRequest);
        })
      );
    } 	   
  }
}
