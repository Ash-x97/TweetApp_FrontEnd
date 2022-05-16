import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _auth:AuthService, private _router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this._auth.logincred.pipe(
      take(1),
      map( user=>{
        //return !user ? false : user.loggedIn ? true : false;
        const isAuth = !user ? false : user.loggedIn ? true : false;
        if(isAuth){
          return true;
        }
        return this._router.createUrlTree(['/login']);
      }),
      // tap( isAuth =>{
      //   if(!isAuth){
      //     this._router.navigate(['/login']);
      //   }
      // })
    );
  }  
}
