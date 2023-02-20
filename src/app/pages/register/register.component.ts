import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchingPasswords, emailValidator } from 'src/app/theme/utils/app-validators';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: UntypedFormGroup;
  public hide = true;
  public email=''
  public userTypes = [
    { id: 1, name: 'Particulier' },
    { id: 2, name: 'Professionel' },
   // { id: 3, name: 'Buyer' }
  ];
  constructor(public fb: UntypedFormBuilder, public router:Router, public snackBar: MatSnackBar,private appService:AppService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      userType: ['', Validators.required],
      username: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      receiveNewsletter: false                            
    },{validator: matchingPasswords('password', 'confirmPassword')});
  }
  register(){
 //console.log(this.registerForm.value.email);
    
   
        this.appService.register({name:this.registerForm.value.username,email:this.registerForm.value.email,
          password:this.registerForm.value.password}).subscribe(data=>{
           
            localStorage.setItem('accessToken',data.accessToken)
            console.log(data);
            this.router.navigate(['/login'])

          },error=>{
          
            console.log(error.error.message);
            alert(error.error.message)
            }) 
      }
    
      
    
      
/* 
     this.appService.register({name:this.registerForm.value.username,email:this.registerForm.value.email,
    password:this.registerForm.value.password}).subscribe(data=>{
     
      localStorage.setItem('accessToken',data.accessToken)
      console.log(data);
      
    }) */
  

  public onRegisterFormSubmit(values:Object):void {
    if (this.registerForm.valid) {
     // console.log(values);
      this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }
}
