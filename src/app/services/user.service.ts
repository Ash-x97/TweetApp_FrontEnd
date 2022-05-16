import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _domSanitizer:DomSanitizer) { }

  selectedUser=new BehaviorSubject<User>(null);
  withModal=new BehaviorSubject<boolean>(false);

  selectUser(user:User){
    this.selectedUser.next(user);
  }

  deselectUser(){
    this.selectedUser=null;
  }

  activateModal(){
    this.withModal.next(true);
  }

  deactivateModal(){
    this.withModal.next(false);
  }

  renderImagefromresponse(avatar:any):SafeUrl{
    let binaryString=atob(avatar);
    var ui8 = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      ui8[i] = binaryString.charCodeAt(i);
    }
    let rawData = [...ui8];
    let blob1 = new Blob([new Uint8Array(rawData)],{type:'image/png'})
    let imgURL=URL.createObjectURL(blob1);
    return this._domSanitizer.bypassSecurityTrustUrl(imgURL);
  }
}
