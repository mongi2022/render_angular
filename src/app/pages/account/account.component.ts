import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation:true
  };
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen:boolean = true;
  profile:any
  image:string
  name:string
  public links = [ 
    { name: 'Profil', href: 'profile', icon: 'person' },  
    { name: 'Mes Biens', href: 'my-properties', icon: 'view_list' },
    { name: 'Favoris', href: 'favorites', icon: 'favorite' }, 
    { name: 'Ajouter Bien', href: '/submit-property', icon: 'add_circle' },  
    { name: 'Se déconnecter', href: '/login', icon: 'power_settings_new' },    
  ]; 
  constructor(public router:Router,private appService:AppService) { }

  ngOnInit() {
    this.getUserById()
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {  
        if(window.innerWidth < 960){
          this.sidenav.close(); 
        }
      }                
    });
  } 
  getUserById(){
    const id=localStorage.getItem('userId')
    this.appService.getUserById(+id).subscribe(data=>{

  this.profile=data
   this.image=data.photo
  console.log(this.image);
  this.name=data.name
    })
  }
  

}
