import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-toolbar1',
  templateUrl: './toolbar1.component.html'
})
export class Toolbar1Component implements OnInit {
  @Output() onMenuIconClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(public appService:AppService,public router:Router) { }

  access_token:any
  ngOnInit() { 
  }

deposerAnnonce(){
  this.access_token=localStorage.getItem('access_token')

  console.log(this.access_token);
  
 // *ngIf="access_token" routerLink="/submit-property"
if (this.access_token!=null) {
  this.router.navigate(['/submit-property'])
}else if (this.access_token==null) {
  this.router.navigate(['/login'])

}
}

  public sidenavToggle(){
    this.onMenuIconClick.emit();
  }
}