import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  constructor(public appService:AppService,public router:Router) { }
 

  profile=[]
  image=''
  access_token=null
  ngOnInit() {
    this.getUserById()
   //  this.access_token=localStorage.getItem('access_token')
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

  logout(){
    this.appService.logout().subscribe(data=>{
      console.log(data);
      localStorage.removeItem('access_token')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      this.image=null
      
    })
  }


  getUserById(){
    const id=localStorage.getItem('userId')
    //const username=localStorage.getItem('username')

    this.appService.getUserById(+id).subscribe(data=>{

  this.profile=data
   this.image=data.photo
  console.log(this.image);
  
    })
  }
}
