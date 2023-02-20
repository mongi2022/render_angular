import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AppService } from '../../app.service'; 

@Component({
  selector: 'app-properties-search',
  templateUrl: './properties-search.component.html',
  styleUrls: ['./properties-search.component.scss']
})
export class PropertiesSearchComponent implements OnInit {
  @Input() variant:number = 1;
  @Input() vertical:boolean = false;
  @Input() searchOnBtnClick:boolean = false;
  @Input() removedSearchField:string;
  @Output() onSearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchClick: EventEmitter<any> = new EventEmitter<any>();
  public showMore: boolean = false;
  public form: UntypedFormGroup;
  public propertyTypes = [];
  public propertyStatuses = [];
  public cities : any[];
  public neighborhoods = [];
  public streets = [];
  public features = [];
  public featuresTerrain = [];
  public featuresCommerce = [];
  public status=''
  public type=false
  public datax=[]
  public show=false

  constructor(public appService:AppService, public fb: UntypedFormBuilder) { }

  ngOnInit() {
    if(this.vertical){
      this.showMore = true;
    };
    this.featuresCommerce=this.appService.getFeaturesCommerce()
    this.featuresTerrain=this.appService.getFeaturesTerrain()
    this.features=this.appService.getFeatures()

  //  this.getFeaturedList()
    this.propertyTypes = this.appService.getPropertyTypes();
    this.propertyStatuses = this.appService.getPropertyStatuses();
    this.getCities();
   // this.form.controls.features.setValue(null, {emitEvent: false});

   // this.getNeighborhoods();
/*     this.streets = this.appService.getStreets();
 */    
    this.form = this.fb.group({
      propertyType: null,
      propertyStatus: null, 
      price: this.fb.group({
        from: null,
        to: null 
      }),
      city: null,
      zipCode: null,
      neighborhood: null,
      street: null,
      bedrooms: this.fb.group({
        from: null,
        to: null 
      }),
      bathrooms: this.fb.group({
        from: null,
        to: null 
      }),
      garages: this.fb.group({
        from: null,
        to: null 
      }),
      area: this.fb.group({
        from: null,
        to: null 
      }),
      yearBuilt: this.fb.group({
        from: null,
        to: null 
      }),       
      features: this.buildFeatures(this.datax)
    }); 
    this.onSearchChange.emit(this.form);
    
  }
 
  getNeighborhoods(id:number){
    this.appService.getNeighborhoodByCityId(id).subscribe(data=>{
      this.neighborhoods=data
      
    })
  }

  public buildFeatures(data) {
   
   // this.form.controls.features.setValue(null, {emitEvent: false});

    const arr = data.map(feature => { 
      return this.fb.group({
        id: feature.id,
        name: feature.name,
        selected: feature.selected
      });
    })   
    return this.fb.array(arr);
  }
  
  getCities(){
    this.appService.getCities().subscribe(data=>{
      this.cities=data
      
    })
  }

 
  change(e) {
    this.status=this.form['controls'].propertyType.value
  //  this.form.get('additional')['controls'].bedrooms=  null

    if (e.value.name==="Terrain"){
      this.status='Terrain'
      this.form['controls'].features=  this.buildFeatures(this.featuresTerrain)
      this.form.get('additional')['controls'].bedrooms=  null
      
    }else    if (e.value.name==="Maison"){ 
      this.status='Maison'
      this.form['controls'].features=  this.buildFeatures(this.features)

    }else  if (e.value.name==="Appartement"){  
      this.status='Maison'

      this.form['controls'].features=  this.buildFeatures(this.features)
    }else  if (e.value.name==="Commerce"){  

      this.status='Commerce'
      this.form['controls'].features=  this.buildFeatures(this.featuresCommerce)
    }

  }
  ngOnChanges(e){ 

    //console.log(e.value.name);
   


   
      
         if(this.removedSearchField){ 
      if(this.removedSearchField.indexOf(".") > -1){
        let arr = this.removedSearchField.split(".");
        this.form.controls[arr[0]]['controls'][arr[1]].reset();
      } 
      else if(this.removedSearchField.indexOf(",") > -1){        
        let arr = this.removedSearchField.split(","); 
        this.form.controls[arr[0]]['controls'][arr[1]]['controls']['selected'].setValue(false);  
      }
      else{
        this.form.controls[this.removedSearchField].reset();
      }  
    }  
    
 
  }

  public reset(){     
    this.form.reset({ 
      propertyType: null,
      propertyStatus: null, 
      price: {
        from: null,
        to: null 
      },
      city: null,
      zipCode: null,
      neighborhood: null,
      street: null,
      bedrooms: {
        from: null,
        to: null 
      },
      bathrooms: {
        from: null,
        to: null 
      },
      garages: {
        from: null,
        to: null 
      },
      area: {
        from: null,
        to: null 
      },
      yearBuilt: {
        from: null,
        to: null 
      },       
      features: this.features    
    }); 
  }

  public search(){
    
 //console.log(this.form.controls['propertyStatus'].value.name);
    this.onSearchClick.emit(); 
  }

  public onSelectCity(){
    this.form.controls['neighborhood'].setValue(null, {emitEvent: false});
   this.getNeighborhoods(this.form.controls['city'].value.id)
   
    // this.form.controls['street'].setValue(null, {emitEvent: false});
  }
  public onSelectNeighborhood(){
  // this.form.controls['street'].setValue(null, {emitEvent: false});
  }

  public getAppearance(){
    return (this.variant != 3) ? 'outline' : '';
  }
  public getFloatLabel(){
    return (this.variant == 1) ? 'always' : '';
  }
/*   getFeaturedList(){
    this.appService.getFeatureList().subscribe(data=>{

     this.features=data

    })
  } */

}
