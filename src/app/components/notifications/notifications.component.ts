import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomNotification } from 'src/app/models/user.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  
  @Input() notifications:CustomNotification[];
  @Output() close=new EventEmitter<void>();
  @Output() notificationsUpdated=new EventEmitter<any[]>();

  constructor() { }

  ngOnInit(): void {
  }

  onClose(){
    if(this.notifications.length > 0)
      this.notificationsUpdated.emit(this.notifications);
    this.close.emit();
  }
  
}
