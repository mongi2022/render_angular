import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Property, Location, Testimonial } from './app.models';
import { AppSettings } from './app.settings';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from './shared/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { TranslateService } from '@ngx-translate/core';

export class Data {
  constructor(public properties: Property[],
              public compareList: Property[],
              public favorites: Property[],
              public locations: Location[]) { }
}

@Injectable({
  providedIn: 'root'
})

export class AppService {
  public Data = new Data(
    [], // properties
    [], // compareList
    [], // favorites
    []  // locations
  )
  url1='https://nest-deploy5.onrender.com'
  url2='http://localhost:3000'
  public url = environment.url + '/assets/data/'; 
  public apiKey = 'AIzaSyAO7Mg2Cs1qzo_3jkKkZAKY6jtwIlm41-I';
  images: string | Blob;
  
  constructor(public http:HttpClient, 
              private bottomSheet: MatBottomSheet, 
              private snackBar: MatSnackBar,
              public appSettings:AppSettings,
              public dialog: MatDialog,
              public translateService: TranslateService,
              @Inject(PLATFORM_ID) private platformId: Object) { }
    
 /*  public getProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'properties.json');
  } */
  public getProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(`${this.url1}/property`);
  }
  public getPropertiesByUser(userId:number): Observable<any[]>{
    return this.http.get<any[]>(`${this.url1}/property/user/${userId}`);
  }
  public addProperties(userId:number,data:any): Observable<any>{
    return this.http.post<any>(`${this.url1}/property/user/${userId}`,data);
  } 
 public addGallery2(id:number,data:any): Observable<any>{
    return this.http.post(`${this.url1}/gallery/upload/${id}`, data);
  }
 public getUserByEmail(email:string):Observable<any>{
  return  this.http.post<any>(`${this.url1}/users/email`,email)
  }
  public register(data:any): Observable<any>{
    return this.http.post<any>(`${this.url1}/auth/signup`,data);
  } 
  public getUserById(id:number): Observable<any>{
    return this.http.get<any>(`${this.url1}/users/${id}`);
  } 
  public updateUser(id:number,data:any): Observable<any>{
    return this.http.patch<any>(`${this.url1}/users/${id}`,data);
  } 
  public uploadImageProfile(id:number,data:any):Observable<any>{
    return this.http.post<any>(`${this.url1}/users/upload/${id}`,data)
  }
  public getUserEmail(data:any): Observable<any>{
    return this.http.post<any>(`${this.url1}/users/email`,data);
  } 
  public logout(): Observable<any>{
    return this.http.get<any>(`${this.url1}/auth/logout`);
  } 
  public login(data:any): Observable<any>{
    return this.http.post<any>(`${this.url1}/auth/signin`,data);
  } 
  public addArea(id:number,area:any): Observable<Property>{
    return this.http.post<any>(`${this.url1}/area/property/${id}`,area);
  } 
  public addLocation(id:number,location:any): Observable<Property>{
    return this.http.post<any>(`${this.url1}/localisation/property/${id}`,location);
  } 
  public addFeature(id:number,feature:any): Observable<Property>{
    return this.http.post<any>(`${this.url1}/features/property/${id}`,feature);
  } 
  public addPrice(id:number,price:any): Observable<Property>{
    return this.http.post<any>(`${this.url1}/price/property/${id}`,price);
  } 
  public addGallery(id:number,gallery:any): Observable<any>{
    return this.http.post<any>(`${this.url1}/gallery/property/${id}`,gallery);
  } 
  public addVideo(id:number,video:any): Observable<any>{
    return this.http.post<any>(`{this.url1}/videos/property/${id}`,video);
  } 
  public getPropertyById(id): Observable<any>{
    return this.http.get<any>(`${this.url1}/property/${id}`) ;
  }
    public addFeatures(feature:any): Observable<any>{
    return this.http.post<any>(`${this.url1}/features`,feature);
  } 

/*   public getPropertyById(id): Observable<Property>{
    return this.http.get<Property>(this.url + 'property-' + id + '.json');
  } */

  public getFeaturedProperties(): Observable<Property[]>{
    return this.http.get<any>(`${this.url1}/property`);
  } 
  public getAllComments(): Observable<any[]>{
    return this.http.get<any>(`${this.url1}/comment`);
  } 

  public getRelatedProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'related-properties.json');
  }

  public getPropertiesByAgentId(agentId): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'properties-agentid-' + agentId + '.json');
  }

  public getLocations(): Observable<Location[]>{
    return this.http.get<Location[]>(this.url + 'locations.json');
  }
  public deleteProperty(id:number):Observable<Property>{
    return this.http.delete<Property>(`${this.url1}/property/${id}`);
  }
  public getAddress(lat = 40.714224, lng = -73.961452){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey);
  }

  public getLatLng(address){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?key='+this.apiKey+'&address='+address);
  }

  public getFullAddress(lat = 40.714224, lng = -73.961452){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey).subscribe(data =>{ 
      return data['results'][0]['formatted_address'];
    });
  }

  public addToCompare(property:Property, component, direction){ 
    if(!this.Data.compareList.filter(item=>item.id == property.id)[0]){
      this.Data.compareList.push(property);
      this.bottomSheet.open(component, {
        direction: direction
      }).afterDismissed().subscribe(isRedirect=>{  
        if(isRedirect){
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0,0);
          }
        }        
      }); 
    } 
  }

  public addToFavorites(property:Property, direction){
    if(!this.Data.favorites.filter(item=>item.id == property.id)[0]){
      this.Data.favorites.push(property);
      this.snackBar.open('The property "' + property.title + '" has been added to favorites.', '×', {
        verticalPosition: 'top',
        duration: 3000,
        direction: direction 
      });  
    }    
  }

  public openConfirmDialog(title:string, message:string) {  
    const dialogData = new ConfirmDialogModel(title, message); 
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    }); 
    return dialogRef; 
  }

  public openAlertDialog(message:string) {   
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "400px",
      data: message
    }); 
    return dialogRef; 
  }

  public getTranslateValue(key:string, param:string = null){  
    let value = null;
    this.translateService.get(key, { param: param }).subscribe((res: string) => {
      value = res;
    }) 
    return value; 
  }

  public getPropertyTypes(){
    return [ 
      { id: 1, name: 'Maison' },
      { id: 2, name: 'Appartement' },
      { id: 3, name: 'Terrain' },
      { id: 4, name: 'Commerce' }
    

    ]
  }

  public getPropertyStatuses(){
    return [ 
      { id: 1, name: 'A vendre' },
      { id: 2, name: 'A louer' },
  
    ]
  }

  public getCities():Observable<any>{
    return this.http.get<any>(`${this.url1}/ville`);
  }
  public getNeighborhoodByCityId(id:number){
    return this.http.get<any>(`${this.url1}/neighborhood/region/${id}`);

  }


  public getNeighborhoods(){
    return this.http.get<any>(`${this.url1}/neighborhood`);

  }






  public getStreets(){
    return [      
      { id: 1, name: 'Astoria Street #1', cityId: 1, neighborhoodId: 1},
      { id: 2, name: 'Astoria Street #2', cityId: 1, neighborhoodId: 1},
      { id: 3, name: 'Midtown Street #1', cityId: 1, neighborhoodId: 2 },
      { id: 4, name: 'Midtown Street #2', cityId: 1, neighborhoodId: 2 },
      { id: 5, name: 'Chinatown Street #1', cityId: 1, neighborhoodId: 3 }, 
      { id: 6, name: 'Chinatown Street #2', cityId: 1, neighborhoodId: 3 },
      { id: 7, name: 'Austin Street #1', cityId: 2, neighborhoodId: 4 },
      { id: 8, name: 'Austin Street #2', cityId: 2, neighborhoodId: 4 },
      { id: 9, name: 'Englewood Street #1', cityId: 2, neighborhoodId: 5 },
      { id: 10, name: 'Englewood Street #2', cityId: 2, neighborhoodId: 5 },
      { id: 11, name: 'Riverdale Street #1', cityId: 2, neighborhoodId: 6 }, 
      { id: 12, name: 'Riverdale Street #2', cityId: 2, neighborhoodId: 6 },
      { id: 13, name: 'Hollywood Street #1', cityId: 3, neighborhoodId: 7 },
      { id: 14, name: 'Hollywood Street #2', cityId: 3, neighborhoodId: 7 },
      { id: 15, name: 'Sherman Oaks Street #1', cityId: 3, neighborhoodId: 8 },
      { id: 16, name: 'Sherman Oaks Street #2', cityId: 3, neighborhoodId: 8 },
      { id: 17, name: 'Highland Park Street #1', cityId: 3, neighborhoodId: 9 },
      { id: 18, name: 'Highland Park Street #2', cityId: 3, neighborhoodId: 9 },
      { id: 19, name: 'Belltown Street #1', cityId: 4, neighborhoodId: 10 },
      { id: 20, name: 'Belltown Street #2', cityId: 4, neighborhoodId: 10 },
      { id: 21, name: 'Queen Anne Street #1', cityId: 4, neighborhoodId: 11 },
      { id: 22, name: 'Queen Anne Street #2', cityId: 4, neighborhoodId: 11 },
      { id: 23, name: 'Green Lake Street #1', cityId: 4, neighborhoodId: 12 },
      { id: 24, name: 'Green Lake Street #2', cityId: 4, neighborhoodId: 12 }      
    ]
  }

  public getFeatures(){
    return [



    

      { id: 1, name: 'Meublé', selected: false },
      { id: 2, name: 'Climatisé', selected: false },
      { id: 3, name: 'Chauffage Centrale', selected: false },
      { id: 4, name: 'Gas de ville', selected: false }, 
      { id: 5, name: 'Balcon/ Terrasse', selected: false },
      { id: 6, name: 'Cave', selected: false },
      { id: 7, name: 'Jardin', selected: false },
      { id: 8, name: 'Piscine', selected: false },
      { id: 9, name: 'Système de sécurité', selected: false },
      { id: 10, name: 'Accenseur', selected: false },
      { id: 11, name: 'Parking voiture', selected: false },
      { id: 12, name: 'Titre bleu', selected: false },
      { id: 13, name: 'Etage', selected: false },


    ]
  }
 
  public getFeaturesTerrain(){
    return [



    

      { id: 1, name: 'Urbaine', selected: false },
      { id: 2, name: 'Agricole', selected: false },
      { id: 3, name: 'Eau', selected: false },
      { id: 4, name: 'Electricité', selected: false },


    ]
  }
  public getFeaturesCommerce(){
    return [



    

      { id: 1, name: 'Bureau', selected: false },
      { id: 2, name: 'Café', selected: false },
      { id: 3, name: 'Restaurant', selected: false },
      { id: 4, name: 'Electricité', selected: false },
      { id: 5, name: 'Fond de commerce', selected: false },
    ]
  }
  public getHomeCarouselSlides(){
    return this.http.get<any[]>(this.url + 'slides.json');
  }


  public filterData(data, params: any, sort?, page?, perPage?){ 
   
    if(params){

      if(params.propertyType){
        data = data.filter(property => property.propertyType == params.propertyType.name)
      }
      if(params.propertyStatus){
        data = data.filter(property => property.propertyStatus === params.propertyStatus[0].name)

      }
    /*   if(params.propertyStatus && params.propertyStatus.length){       
        let statuses = [];
        params.propertyStatus.forEach(status => { 
          
          statuses.push(status) });           
        let properties = [];
        data.filter(property =>
          property.propertyStatus.forEach(status => {             
            if(statuses.indexOf(status) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      } */

      if(params.price){
        if(this.appSettings.settings.currency == 'TND'){          
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale >= params.price.from ){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent >= params.price.from ){
                return true;
              } 
              return false;
            });
          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale <= params.price.to){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent <= params.price.to){
                return true;
              } 
              return false;
            });          
          }
        }
/*         if(this.appSettings.settings.currency == 'EUR'){
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale >= params.price.from ){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent >= params.price.from ){
                return true;
              } 
              return false;
            });

          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale <= params.price.to){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent <= params.price.to){
                return true;
              } 
              return false;
            });
          }
        }   */      
      }  

      if(params.city){
        
        
        data = data.filter(property => property.city == params.city.name)
      //  console.log(data);
      }

      if(params.zipCode){
        data = data.filter(property => property.zipCode == params.zipCode)
      }
      
      if(params.neighborhood /* && params.neighborhood.length */){   
    
          data = data.filter(property => property.neighborhood === params.neighborhood[0].name)
  
        
/*         console.log(params.neighborhood);
            
        let neighborhoods = [];
        params.neighborhood.forEach(item => { neighborhoods.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.neighborhood.forEach(item => {             
            if(neighborhoods.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties; */
      }

      if(params.street && params.street.length){       
        let streets = [];
        params.street.forEach(item => { streets.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.street.forEach(item => {             
            if(streets.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.bedrooms){
        if(params.bedrooms.from){
          data = data.filter(property => property.bedrooms >= params.bedrooms.from)
        }
        if(params.bedrooms.to){
          data = data.filter(property => property.bedrooms <= params.bedrooms.to)
        }
      } 
      
      if(params.bathrooms){
        if(params.bathrooms.from){
          data = data.filter(property => property.bathrooms >= params.bathrooms.from)
        }
        if(params.bathrooms.to){
          data = data.filter(property => property.bathrooms <= params.bathrooms.to)
        }
      } 

      if(params.garages){
        if(params.garages.from){
          data = data.filter(property => property.garages >= params.garages.from)
        }
        if(params.garages.to){
          data = data.filter(property => property.garages <= params.garages.to)
        }
      } 

      if(params.area){
        if(params.area.from){
          data = data.filter(property => property.area.value >= params.area.from)
        }
        if(params.area.to){
          data = data.filter(property => property.area.value <= params.area.to)
        }
      } 

      if(params.yearBuilt){
        if(params.yearBuilt.from){
          data = data.filter(property => property.yearBuilt >= params.yearBuilt.from)
        }
        if(params.yearBuilt.to){
          data = data.filter(property => property.yearBuilt <= params.yearBuilt.to)
        }
      }

      if(params.features){       
        let arr = [];
        params.features.forEach(feature => { 
        
        //  console.log(feature);

          if(feature.selected)
            arr.push(feature.name);
        });  
        if(arr.length > 0){
          let properties = [];
          data.filter(property =>
            property.features.forEach(feature => {             
              if(arr.indexOf(feature) > -1){                 
                if(!properties.includes(property)){
                  properties.push(property);
                }                
              }
            })
          );
          data = properties;
          
        }         
        
      }
      
    }

    // console.log(data)

    //for show more properties mock data 
  /*   for (var index = 0; index < 2; index++) {
      data = data.concat(data);        
    }     
      */
    this.sortData(sort, data);
    return this.paginator(data, page, perPage)
  }

  public sortData(sort, data){
    if(sort){
      switch (sort) {
        case 'Le plus récent':
          data = data.sort((a, b)=> {return <any>new Date(b.published) - <any>new Date(a.published)});           
          break;
        case 'Le plus ancien':
          data = data.sort((a, b)=> {return <any>new Date(a.published) - <any>new Date(b.published)});           
          break;
        case 'Populaire':
          data = data.sort((a, b) => { 
            if(a.ratingsValue/a.ratingsCount < b.ratingsValue/b.ratingsCount){
              return 1;
            }
            if(a.ratingsValue/a.ratingsCount > b.ratingsValue/b.ratingsCount){
              return -1;
            }
            return 0; 
          });
          break;
        case 'Prix (croissant)':
          if(this.appSettings.settings.currency == 'TND'){
            data = data.sort((a,b) => {
              if((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)){
                return 1;
              }
              if((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          if(this.appSettings.settings.currency == 'EUR'){
            data = data.sort((a,b) => {
              if((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.v.rent)){
                return 1;
              }
              if((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.priceEuro.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          break;
        case 'Price (decroissant)':
          if(this.appSettings.settings.currency == 'TND'){
            data = data.sort((a,b) => {
              if((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)){
                return 1;
              }
              if((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          if(this.appSettings.settings.currency == 'EUR'){
            data = data.sort((a,b) => {
              if((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.v.rent)){
                return 1;
              }
              if((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.priceEuro.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          break;
        default:
          break;
      }
    }
    return data;
  }

  public paginator(items, page?, perPage?) { 
    var page = page || 1,
    perPage = perPage || 4,
    offset = (page - 1) * perPage,   
    paginatedItems = items.slice(offset).slice(0, perPage),
    totalPages = Math.ceil(items.length / perPage);
    return {
      data: paginatedItems,
      pagination:{
        page: page,
        perPage: perPage,
        prePage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
      }
    };
  }



  public getTestimonials():Observable<Testimonial[]>{
    return this.http.get<Testimonial[]>(`${this.url1}/testimonial`);

  }


  public getFeatureList():Observable<any[]>{
    return this.http.get<any[]>(`${this.url1}/featurelist`);

  }

  public getAgents(){
    return this.http.get<any[]>(`${this.url1}/agent`);
    
  }
  public getAgentById(id:number){
    return this.http.get<any[]>(`${this.url1}/agent/${id}`);
    
  }
  public getClients():Observable<any[]>{
    return this.http.get<any[]>(`${this.url1}/client`);

  }




}
