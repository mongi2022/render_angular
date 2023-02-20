import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { emailValidator, matchingPasswords } from 'src/app/theme/utils/app-validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public infoForm:UntypedFormGroup;
  public passwordForm:UntypedFormGroup;
  constructor(public formBuilder: UntypedFormBuilder,public router:Router, public snackBar: MatSnackBar,private appService:AppService) { }
  file:File=null
  ngOnInit() {
    this.getUserById()
    this.infoForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      photo: null,      
      organization: null,
      facebook: null,
      twitter: null,
      linkedin: null,
      instagram: null,
      website: null
    });
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    },{validator: matchingPasswords('newPassword', 'confirmNewPassword')});
  }

  public onInfoFormSubmit(values:Object):void {
    if (this.infoForm.valid) {
      console.log(values)
      this.snackBar.open('Your account information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }
getUserById(){
  const id=localStorage.getItem('userId')
  this.appService.getUserById(+id).subscribe(data=>{
   // console.log(data);
// console.log(this.infoForm.value.name);
    //this.infoForm.=data.name
   this.infoForm.controls.name.setValue(data.name);
   this.infoForm.controls.email.setValue(data.email);
   this.infoForm.controls.phone.setValue(data.tel);
   this.infoForm.controls.photo.setValue(data.photo);


  })
}
onSelect(event){
  //console.log(e.target.files[0]);
  
  this.file = event.target.files[0];
//console.log(this.file);

}
updateUser(){
  const id=localStorage.getItem('userId')
//.replace(/\s/g, '')
// console.log(this.infoForm.value.photo);
 
if (this.file ==null) {
  

  this.appService.updateUser(+id,{name:this.infoForm.value.name,
    email:this.infoForm.value.email,
    tel:this.infoForm.value.phone,
    photo:this.infoForm.value.photo
  }).subscribe(dat=>{
      console.log(dat);
    //  console.log('file=====',this.file.name);
      
     // this.uploadImageProfile(this.infoForm.value.photo)
    })}else if (this.file !=null) {
      this.appService.updateUser(+id,{name:this.infoForm.value.name,
        email:this.infoForm.value.email,
        tel:this.infoForm.value.phone,
        photo:`assets/images/profiles/${id}/${this.file.name}`
      }).subscribe(dat=>{
          console.log(dat);
        //  console.log('file=====',this.file.name);
          
         // this.uploadImageProfile(this.infoForm.value.photo)
        })
    }
    this.uploadImageProfile()
    this.router.navigate(['/']);

}

uploadImageProfile(){
 
    /*   const formData = new FormData();
      formData.append('image', image);
    
      return this.http.post<any>('http://localhost:3000/gallery/upload',formData,
      {
        reportProgress: true,
        responseType: 'json'
      }); */
    
    

  const id=parseInt(localStorage.getItem('userId'))
//console.log('fff',this.file);

  const formData=new FormData()
 // console.log(formData);
  
  formData.append("image",this.file)
 // console.log(this.file)
 // console.log(formData);
 // console.log(this.file.name);
  
  this.appService.uploadImageProfile(id,formData).subscribe(data=>{
//  photo= (`assets/images/profiles/${id}/${data.originalname}`);

console.log(data);

  })

  
}

  public onPasswordFormSubmit(values:Object):void {
    if (this.passwordForm.valid) {
      this.snackBar.open('Your password changed successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

}
