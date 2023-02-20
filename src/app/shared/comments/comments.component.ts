import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input('propertyId') propertyId;
  public commentForm: UntypedFormGroup;
  reviews: any[];
  
  constructor(public fb: UntypedFormBuilder,private appService:AppService) { }

  ngOnInit() {
    this.getAllComments()
    this.commentForm = this.fb.group({ 
      review: [null, Validators.required],            
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      email: [null, Validators.compose([Validators.required, emailValidator])],
      rate: null,
      propertyId: this.propertyId
    }); 
  }
 getAllComments(){
  this.appService.getAllComments().subscribe(data=>{
console.log(data);
this.reviews=data

  })
 }
  public onCommentFormSubmit(values:any){
    if (this.commentForm.valid) { 
      console.log(values);
      if(values.rate){
        //property.ratingsCount++,
        //property.ratingsValue = property.ratingsValue + values.rate,
      }     
    } 
  }

  public rate(rating:any){
    //this.ratings.filter(r => r.selected = false);
   // this.ratings.filter(r => r.percentage == rating.percentage)[0].selected = true;
    this.commentForm.controls.rate.setValue(rating.percentage);
  }

}