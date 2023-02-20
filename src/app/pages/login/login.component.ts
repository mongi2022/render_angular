import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router'; 
import { AppService } from 'src/app/app.service';
import { Thumbs } from 'swiper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: UntypedFormGroup;
  public hide = true;

  constructor(public fb: UntypedFormBuilder, public router:Router,private appService:AppService) { }
  user:any
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      
      rememberMe: false
    });

  }


  login(){
    this.appService.login({email:this.loginForm.value.email,password:this.loginForm.value.password}).subscribe(data=>{
      console.log(data);
      
    //  console.log(Object.values(data)[0]['accessToken']);
   //   console.log(Object.values(data)[1]);
      localStorage.setItem('access_token',`${Object.values(data)[0]['accessToken']}`)
     // localStorage.setItem('refresh_token',`${Object.values(data)[0]['refreshToken']}`)

      localStorage.setItem('userId',`${Object.values(data)[1]}`)
      localStorage.setItem('email',`${Object.values(data)[2]}`)
     // localStorage.setItem('username',`${Object.values(data)[3]}`)

      this.getUserById()
      this.router.navigate(['/']);
      
    })
  }
  getUserById(){
    const id=localStorage.getItem('userId')

    this.appService.getUserById(+id).subscribe(data=>{
   console.log(data);
   this.user=data

  
    })
  }
  getUserByEmail(){
    const id=localStorage.getItem('userId')

    this.appService.getUserById(+id).subscribe(data=>{
   console.log(data);
   this.user=data

  
    })
  }

  public onLoginFormSubmit(values:Object):void {
    if (this.loginForm.valid) {
      this.router.navigate(['/']);
    }
  }

}
