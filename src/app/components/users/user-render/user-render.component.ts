import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';

interface RenderModel{
  name:string,
  image:SafeUrl,
  username:string,
}

@Component({
  selector: 'app-user-render',
  templateUrl: './user-render.component.html',
  styleUrls: ['./user-render.component.css']
})
export class UserRenderComponent implements OnInit {

  @Input() user:RenderModel;
  @Output() userSelected= new EventEmitter<void>();

  isItemSelected:boolean=false;
  selectedId:string;

  constructor(private _user:UserService) { }

  ngOnInit(): void {
    this._user.selectedUser.subscribe(
      res=>{
        if(res){
          this.isItemSelected=true;  
          this.selectedId=res.loginId;
        }
      }
    );
  }

  onSelectUser(){
    this.userSelected.emit();
  }

}
