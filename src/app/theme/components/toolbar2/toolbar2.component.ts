import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-toolbar2',
  templateUrl: './toolbar2.component.html'
})
export class Toolbar2Component implements OnInit {
  @Output() onMenuIconClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(public appService:AppService,public router:Router) { }
   access_token=null
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