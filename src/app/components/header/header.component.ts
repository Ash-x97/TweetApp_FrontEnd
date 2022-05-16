import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { InterCommunicationService } from 'src/app/services/inter-communication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isNavBarOpen:boolean;
  public isLoggedIn:boolean;
  public username:string;
  private loginCredSub:Subscription;

  constructor(private _auth:AuthService, private _router:Router) { 
    this.isNavBarOpen=false;
  }

  ngOnInit(): void {
    this._auth.logincred.subscribe(
      logincred=>{       
        if(logincred !== null){
          this.isLoggedIn=logincred.loggedIn;
          this.username=logincred.username;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loginCredSub.unsubscribe();
  }

  toggleNavbar(){
    this.isNavBarOpen=!this.isNavBarOpen
  }

  onLogout(){
    this._auth.logoutUser();
    this._router.navigate(['/login']);

  }
}