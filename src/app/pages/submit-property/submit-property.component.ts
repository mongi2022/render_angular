/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { MapsAPILoader } from '@agm/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-submit-property',
  templateUrl: './submit-property.component.html',
  styleUrls: ['./submit-property.component.scss']
})
export class SubmitPropertyComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper; 
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  public submitForm:UntypedFormGroup; 
  public features = [];
  public featuresTerrain = [];
  public featuresCommerce = [];
  public propertyTypes = [];
  public propertyStatuses = [];
  public cities = [];
  public neighborhoods = [];
    public streets = [];
  public lat: number = 33.8933;
  public lng: number =  10.1029;
  public zoom: number = 12;  
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  urls=[]
  url: string | ArrayBuffer;
  properties:any;
  arr: number[];
  files=[]
  myFiles= []
  datax= []
  listfeatures: string[]=[];
  type=false
  status=''
  featureValue=''
  constructor(public appService:AppService, 
              private fb: UntypedFormBuilder, 
              private mapsAPILoader: MapsAPILoader, 
              private ngZone: NgZone,
              private http:HttpClient) { }

  ngOnInit() {
    this.getProperties()
    

   // this.getFeaturedList()
    this.features = this.appService.getFeatures();
    this.featuresTerrain = this.appService.getFeaturesTerrain();
    this.featuresCommerce = this.appService.getFeaturesCommerce(); 
    this.propertyTypes = this.appService.getPropertyTypes();
    this.propertyStatuses = this.appService.getPropertyStatuses();
    this.getCities();
  this.streets = this.appService.getStreets();  

    this.submitForm = this.fb.group({
      basic: this.fb.group({
        title: [null, Validators.required],
        desc: null,
        priceDollar: null,
        priceEuro: null,
        propertyType: [null, Validators.required],
        propertyStatus: null, 
        gallery: null
      }),
      address: this.fb.group({
        location: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: '',
        neighborhood: '',
        adresse: ''
      }),
      additional: this.fb.group({
        bedrooms: '',
        bathrooms: '',
        garages: '',
        area: '',
        yearBuilt: '',
        features: this.buildFeatures(this.datax)
      }),
      media: this.fb.group({
        videos: this.fb.array([ this.createVideo() ]),
        plans: this.fb.array([ this.createPlan() ]), 
        additionalFeatures: this.fb.array([ this.createFeature() ]),
        featured: false
      })
    }); 

    this.setCurrentPosition();
    this.placesAutocomplete();
  }

  public getFeaturedProperties(){
    this.appService.getFeaturedProperties().subscribe(data=>{
     // const res= this.property.features.map((x:any)=>x.desc)
    //  console.log(data);
      
      
    })
  } 
  getCities(){
     this.appService.getCities().subscribe(data=>{
    this.cities=data
  })
  }
  selectFile(event: any): void {
    
/*       if (event.target.files && event.target.files[0]) {
          var filesAmount = event.target.files.length;
          for (let i = 0; i < filesAmount; i++) {
                  var reader = new FileReader();
  
                  reader.onload = (event:any) => {
                     this.urls.push(event.target.result); 
                  }
  
                  reader.readAsDataURL(event.target.files[i]);
          }
      }
    
   this.selectedFiles = event.target.files; */
   //console.log(this.currentFile);
   for  (var i =  0; i <  event.target.files.length; i++)  {  
    this.files.push(event.target.files[i]);
    console.log(this.files);
    
}
    
  }
 
      
  


  
 


  getNeighborhoods(id:number){
    this.appService.getNeighborhoodByCityId(id).subscribe(data=>{
      this.neighborhoods=data
    
  })}
  public addProperty(e){
    const userId=parseInt(localStorage.getItem('userId'))

   const propertyType = Object.values(this.submitForm.get('basic').value)[4]['name']
   const title = Object.values(this.submitForm.get('basic').value)[0]
   const priceDollar =parseInt(`${Object.values(this.submitForm.get('basic').value)[2]}`) 
   const propertyStatus = Object.values(this.submitForm.get('basic').value)[5][0]['name']
   const desc = Object.values(this.submitForm.get('basic').value)[1]

   //const gallery = Object.values(this.submitForm.get('basic').value)[3]

   const  basicfinal ={title,propertyType,propertyStatus,desc}
 
   const adresse = Object.values(this.submitForm.get('address').value)[4]
   //const location = Object.values(this.submitForm.get('address').value)[0]
   const city = Object.values(this.submitForm.get('address').value)[1]['name']
   const zipCode = Object.values(this.submitForm.get('address').value)[2]
   const neighborhood = Object.values(this.submitForm.get('address').value)[3][0]['name']

  const  addressfinal ={city,zipCode,neighborhood,adresse}

  const bedrooms = parseInt(`${Object.values(this.submitForm.get('additional').value)[0]}`)
  const bathrooms =parseInt( `${Object.values(this.submitForm.get('additional').value)[1]}`)
  const yearBuilt = parseInt(`${Object.values(this.submitForm.get('additional').value)[4]}`)
  const garages = parseInt(`${Object.values(this.submitForm.get('additional').value)[2]}`)
  const area =parseInt(`${Object.values(this.submitForm.get('additional').value)[3]}`)
 // console.log(Object.values(features));
  
  const  additionalfinal ={garages,area,yearBuilt,bathrooms,bedrooms} 

  const name =Object.values(this.submitForm.get('media').value)[0][0]['name']
  const link =Object.values(this.submitForm.get('media').value)[0][0]['link']

  const  mediafinal ={name,link} 
 
  const data={...basicfinal,...additionalfinal,...addressfinal}
   

   this.appService.addProperties(userId,data).subscribe(data=>{
  //console.log(data.id);
   const lastid=data.id
   for (let index = 0; index < this.listfeatures.length; index++) {

   
    this.appService.addFeature(lastid,{desc:`${this.listfeatures[index]}`}).subscribe(data=>{
    console.log(data);
  
  
  
  })
  
  
  
  } 


   if (propertyStatus=="A vendre") {
     this.appService.addPrice(lastid,{rent:null,sale:priceDollar}).subscribe(data=>{
  // console.log("price=",data);
   
 })
   }else{
    this.appService.addPrice(lastid,{rent:priceDollar,sale:null}).subscribe(data=>{
      // console.log("price=",data);
       
     })
   }
   this.appService.addLocation(lastid,{lat:30,lng:10}).subscribe(data=>{
    // console.log("area=",data);
     
   })

 

 this.appService.addArea(lastid,{value:area,unit:"m²"}).subscribe(data=>{
  // console.log("area=",data);
   
 })

  // const features =Object.values((Object.values(this.submitForm.get('additional').value))[5])
  //  console.log(features);
 //console.log("frrrg",e);
//  console.log(e.source.value);
 
/*  let arr=Array(this.listfeatures.push(e.source.value)) */

 
 this.appService.addVideo(lastid,mediafinal).subscribe(data=>{

 })

 


 this.uploadImages(lastid)
 //const small=`assets/images/${lastid}small-1366-${file.originalname}`
 //console.log(this.listfeatures);



})   

//console.log(data);


  }

  onFileChange(event)  {
    for  (var i =  0; i <  event.target.files.length; i++)  {  
        this.files.push(event.target.files[i]);
    }
  }

  uploadImages(id:number){

  const formData =  new  FormData();
  for  (var i =  0; i <  this.files.length; i++)  {  
      formData.append("file[]",  this.files[i]);
      
  } 


  this.appService.addGallery2(id,formData).subscribe(res =>  {
    
    for  (var i =  0; i <  this.files.length; i++)  { 
   //let originalname=buffer.from(res[i].originalname, 'latin1').toString('utf8');
 
   // Uint8Array[98, 101, 101, 114, 33, 240, 159, 141, 187]
 //  console.log(decoder.decode(new Uint8Array([98, 101, 101, 114, 33, 240, 159, 141, 187])));
// let originalname=Buffer.from((res[i].originalname), 'latin1').toString('utf8');
 // console.log(originalname);

var decodedMessage = ((`${res[i].originalname}`));
console.log("decode=",decodedMessage);
 
      let big=(`assets/images/${id}/big-1366-${res[i].originalname}`);
      let medium=(`assets/images/${id}/medium-640-${res[i].originalname}`);
      let small=(`assets/images/${id}/small-240-${res[i].originalname}`);
      this.appService.addGallery(id,{small:small,medium:medium,big:big}).subscribe(data=>{
        console.log(data);
        
    }) 

     

    }
  })
  }

getProperties(){
  this.appService.getProperties().subscribe(data=>{
    this.properties=data

    
    
  })
}

  public addFeatures(){
    this.appService.addFeatures(this.submitForm).subscribe(data=>{

     // console.log('data2=',data);
      
    })
  }
  public onSelectionChange(e:any){ 
    if(e.selectedIndex == 4){   
      this.horizontalStepper._steps.forEach(step => step.editable = false);
     // console.log(this.submitForm.value);      
    }
  }
  public reset(){
    this.listfeatures=[]
    this.horizontalStepper.reset(); 

    const videos = <UntypedFormArray>this.submitForm.controls.media.get('videos');
    while (videos.length > 1) {
      videos.removeAt(0)
    }
    const plans = <UntypedFormArray>this.submitForm.controls.media.get('plans');
    while (plans.length > 1) {
      plans.removeAt(0)
    }
    const additionalFeatures = <UntypedFormArray>this.submitForm.controls.media.get('additionalFeatures');
    while (additionalFeatures.length > 1) {
      additionalFeatures.removeAt(0)
    }
    
    this.submitForm.reset({
      additional: {
        features: this.features
      },
      media:{ 
        featured: false
      }
    });   
     
  }

  

  // -------------------- Address ---------------------------  
  public onSelectCity(){
   this.submitForm.controls.address.get('neighborhood').setValue(null, {emitEvent: false});
    this.getNeighborhoods(this.submitForm.value.address.city.id)

  }
  public onSelectNeighborhood(){
    //this.submitForm.controls.address.get('adresse').setValue(null, {emitEvent: false}); 
  }

  private setCurrentPosition() {
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => { 
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude; 
      });
    }
  }
  private placesAutocomplete(){  
    this.mapsAPILoader.load().then(() => { 
      let autocomplete = new google.maps.places.Autocomplete(this.addressAutocomplete.nativeElement, {
        types: ["address"]
      });  
      autocomplete.addListener("place_changed", () => { 
        this.ngZone.run(() => { 
          let place: google.maps.places.PlaceResult = autocomplete.getPlace(); 
          if (place.geometry === undefined || place.geometry === null) {
            return;
          };
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng(); 
          this.getAddress();
        });
      });
    });
  } 
  
  // public getAddress(){    
  //   this.mapsAPILoader.load().then(() => {
  //     let geocoder = new google.maps.Geocoder();
  //     let latlng = new google.maps.LatLng(this.lat, this.lng); 
  //     geocoder.geocode({'location': latlng}, (results, status) => {
  //       if(status === google.maps.GeocoderStatus.OK) {
  //         console.log(results); 
  //         //this.addresstext.nativeElement.focus();  
  //         let address = results[0].formatted_address; 
  //         this.submitForm.controls.location.setValue(address); 
  //         this.setAddresses(results[0]);          
  //       }
  //     });
  //   });
  // }
  public getAddress(){    
    this.appService.getAddress(this.lat, this.lng).subscribe(response => {  
     // console.log(response);
      if(response['results'].length){
        let address = response['results'][0].formatted_address; 
        this.submitForm.controls.address.get('location').setValue(address); 
        this.setAddresses(response['results'][0]); 
      } 
    })
  }
  public onMapClick(e:any){
    this.lat = e.coords.lat;
    this.lng = e.coords.lng; 
    this.getAddress();
  }
  public onMarkerClick(e:any){
    //console.log(e);
  }
  
  public setAddresses(result){
    this.submitForm.controls.address.get('city').setValue(null);
    this.submitForm.controls.address.get('zipCode').setValue(null);
    this.submitForm.controls.address.get('adresse').setValue(null); 

    var newCity, newStreet, newNeighborhood;
    
    result.address_components.forEach(item =>{
      if(item.types.indexOf('locality') > -1){  
        if(this.cities.filter(city => city.name == item.long_name)[0]){
          newCity = this.cities.filter(city => city.name == item.long_name)[0];
        }
        else{
          newCity = { id: this.cities.length+1, name: item.long_name };
          this.cities.push(newCity); 
        }
        this.submitForm.controls.address.get('city').setValue(newCity);    
      }
      if(item.types.indexOf('postal_code') > -1){ 
        this.submitForm.controls.address.get('zipCode').setValue(item.long_name);
      }
    });

    if(!newCity){
      result.address_components.forEach(item =>{
        if(item.types.indexOf('administrative_area_level_1') > -1){  
          if(this.cities.filter(city => city.name == item.long_name)[0]){
            newCity = this.cities.filter(city => city.name == item.long_name)[0];
          }
          else{
            newCity = { 
              id: this.cities.length+1, 
              name: item.long_name 
            };
            this.cities.push(newCity); 
          }
          this.submitForm.controls.address.get('city').setValue(newCity);    
        } 
      });
    }

    if(newCity){
      result.address_components.forEach(item =>{ 
        if(item.types.indexOf('neighborhood') > -1){ 
          let neighborhood = this.neighborhoods.filter(n => n.name == item.long_name && n.cityId == newCity.id)[0];
          if(neighborhood){
            newNeighborhood = neighborhood;
          }
          else{
            newNeighborhood = { 
              id: this.neighborhoods.length+1, 
              name: item.long_name, 
              cityId: newCity.id 
            };
            this.neighborhoods.push(newNeighborhood);
          }
          this.neighborhoods = [...this.neighborhoods];
          this.submitForm.controls.address.get('neighborhood').setValue([newNeighborhood]); 
        }  
      })
    }

    if(newCity){
      result.address_components.forEach(item =>{            
        if(item.types.indexOf('route') > -1){ 
          if(this.streets.filter(adresse => adresse.name == item.long_name && adresse.cityId == newCity.id)[0]){
            newStreet = this.streets.filter(adresse => adresse.name == item.long_name && adresse.cityId == newCity.id)[0];
          }
          else{
            newStreet = { 
              id: this.streets.length+1, 
              name: item.long_name, 
              cityId: newCity.id, 
              neighborhoodId: (newNeighborhood) ? newNeighborhood.id : null 
            };
            this.streets.push(newStreet);
          }          
          this.streets = [...this.streets];
          this.submitForm.controls.address.get('adresse').setValue([newStreet]); 
        }
      })
    }

  }



   
  // -------------------- Additional ---------------------------  
  public buildFeatures(data) {
    const arr = data.map(feature => { 
      return this.fb.group({
        id: feature.id,
        name: feature.name,
        selected: feature.selected
      });
    })   
   // console.log(arr);
    
    return this.fb.array(arr);

  }
  


  
  // -------------------- Media --------------------------- 
  public createVideo(): UntypedFormGroup {
    return this.fb.group({
      id: null,
      name: null, 
      link: null 
    });
  }
  public addVideo(): void {
    const videos = this.submitForm.controls.media.get('videos') as UntypedFormArray;
    videos.push(this.createVideo());
  }
  public deleteVideo(index) {
    const videos = this.submitForm.controls.media.get('videos') as UntypedFormArray;
    videos.removeAt(index);
  }
  
  public createPlan(): UntypedFormGroup {
    return this.fb.group({
      id: null,
      name: null, 
      desc: null,
      area: null,
      rooms: null,
      baths: null,
      image: null
    });
  }
  public addPlan(): void {
    const plans = this.submitForm.controls.media.get('plans') as UntypedFormArray;
    plans.push(this.createPlan());
  }
  public deletePlan(index) {
    const plans = this.submitForm.controls.media.get('plans') as UntypedFormArray;
    plans.removeAt(index);
  } 


  public createFeature(): UntypedFormGroup {
    return this.fb.group({
      id: null,
      name: null, 
      value: null 
    });
  }
  public addFeature(): void {
    const features = this.submitForm.controls.media.get('additionalFeatures') as UntypedFormArray;
    features.push(this.createFeature());
  }
  public deleteFeature(index) {
    const features = this.submitForm.controls.media.get('additionalFeatures') as UntypedFormArray;
    features.removeAt(index);
  } 
  changeFeature(e:MatCheckboxChange){
    console.log(e.source.value);
    console.log(e.checked); 
   // this.featureValue=e.source.value
//    const features =Object.values((Object.values(this.submitForm.get('additional').value))[5])
 //   console.log(e.source.);
   // this.listfeatures.push(e.source.value)
   (this.listfeatures.push(e.source.value))
    console.log(this.listfeatures);
    
 /* var children =<HTMLElement>document.getElementById("mat-checkbox-1")[0].innerHTML;
console.log(children); */

  //  console.log(this.lastid2);
   // 
  /*   
    if (this.featureValue!=null ) {

      this.appService.addFeature(this.lastid2,{name:this.featureValue,propertyId:this.lastid2}).subscribe(data=>{
   console.log(this.featureValue);
  
    })
    }  */

   
    
  }
  
      
      
       

  
  change(e) {
    this.status=this. submitForm.get('basic')['controls'].propertyType.value.name
  //  submitForm.get('additional')['controls'].features['controls']
    if (e.value.name==="Terrain"){
      this.status='Terrain'

      this.submitForm.get('additional')['controls'].features=  this.buildFeatures(this.featuresTerrain)

      
    }else    if (e.value.name==="Maison"){ 
      this.status='Maison'
     console.log( this.submitForm.get('additional')['controls'].features);
      
      this.submitForm.get('additional')['controls'].features=  this.buildFeatures(this.features)

    }else  if (e.value.name==="Appartement"){  
      this.status='Maison'
      this.submitForm.get('additional')['controls'].features=  this.buildFeatures(this.features)
    }else  if (e.value.name==="Commerce"){  
      this.status='Commerce'
      this.submitForm.get('additional')['controls'].features=  this.buildFeatures(this.featuresCommerce)
    }

  }
/*   getFeaturedList(){
    this.appService.getFeatureList().subscribe(data=>{
      this.features=data
     // console.log(data);
      
    })
  } */

}