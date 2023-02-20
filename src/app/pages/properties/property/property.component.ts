import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings, Settings } from 'src/app/app.settings';
import { CompareOverviewComponent } from 'src/app/shared/compare-overview/compare-overview.component';
import { EmbedVideoService } from 'ngx-embed-video'; 
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;  
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation:true
  };
  public sidenavOpen:boolean = true;
  public config: SwiperConfigInterface = {}; 
  public config2: SwiperConfigInterface = {}; 
  private sub: any;
  public featureList:any
  public property:Property; 
  public settings: Settings;  
  public embedVideo: any;
  public relatedProperties: Property[];
  public featuredProperties: Property[];
  public agent:any;
  public mortgageForm: UntypedFormGroup;
  public monthlyPayment:any;
  public contactForm: UntypedFormGroup;
  status=''
  statusVideo=''
  ids:any [];
  agents: any[];
  image: any;
  name: any;
  tel: any;
  constructor(public appSettings:AppSettings, 
              public appService:AppService, 
              private activatedRoute: ActivatedRoute, 
              private embedService: EmbedVideoService,
              public fb: UntypedFormBuilder) {
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {   
      this.getPropertyById(params['id']); 
    });
    //this.getAllAgents()
    this.getUserById()
  
    this.getRelatedProperties();
    this.getFeaturedProperties();
   // this.getAgent(1);
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
      if(this.sidenav){
        this.sidenav.close();
      } 
    };
    this.mortgageForm = this.fb.group({
      principalAmount: ['', Validators.required],
      downPayment: ['', Validators.required], 
      interestRate: ['', Validators.required],
      period: ['', Validators.required]
    });
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  } 

  ngOnDestroy() {
    this.sub.unsubscribe();
  }  

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true; 
  }

  public getPropertyById(id){
    this.appService.getPropertyById(id).subscribe(data=>{
      this.property = data;  
    this.status=data.propertyType
     console.log(data);
      
      this.embedVideo = this.embedService.embed(this.property.videos[0].link);
      this.statusVideo=this.property.videos[0].link
      setTimeout(() => { 
        this.config.observer = true;
        this.config2.observer = true; 
        this.swipers.forEach(swiper => { 
          if(swiper){
            swiper.setIndex(0);
          } 
        }); 
      });
    });
  }

  ngAfterViewInit(){
    this.config = {
      observer: false,
      slidesPerView: 1,
      spaceBetween: 0,       
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    };

    this.config2 = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 16,      
      keyboard: true,
      navigation: false,
      pagination: false, 
      grabCursor: true,       
      loop: false, 
      preloadImages: false,
      lazy: true,  
      breakpoints: {
        200: {
          slidesPerView: 2
        },
        480: {
          slidesPerView: 3
        },
        600: {
          slidesPerView: 4
        } 
      }
    } 

  }
  

  public onOpenedChange(){ 
    this.swipers.forEach(swiper => { 
      if(swiper){
        swiper.update();
      } 
    });     
  }
  getUserById(){
    const id=localStorage.getItem('userId')

    this.appService.getUserById(+id).subscribe(data=>{

  
   this.image=data.photo
   this.name=data.name
   this.tel=data.tel
  
    })
  }


  public selectImage(index:number){ 
    this.swipers.forEach(swiper => {
      if(swiper['elementRef'].nativeElement.id == 'main-carousel'){
        swiper.setIndex(index);
      }      
    }); 
  }

  public onIndexChange(index: number) {  
    this.swipers.forEach(swiper => { 
      let elem = swiper['elementRef'].nativeElement;
      if(elem.id == 'small-carousel'){
        swiper.setIndex(index);  
        for (let i = 0; i < elem.children[0].children.length; i++) {
          const element = elem.children[0].children[i]; 
          if(element.classList.contains('thumb-'+index)){
            element.classList.add('active-thumb'); 
          }
          else{
            element.classList.remove('active-thumb'); 
          }
        }
      } 
    });     
  }

  public addToCompare(){
    this.appService.addToCompare(this.property, CompareOverviewComponent, (this.settings.rtl) ? 'rtl':'ltr'); 
  }

  public onCompare(){
    return this.appService.Data.compareList.filter(item=>item.id == this.property.id)[0];
  }

  public addToFavorites(){
    this.appService.addToFavorites(this.property, (this.settings.rtl) ? 'rtl':'ltr');
  }

  public onFavorites(){
    return this.appService.Data.favorites.filter(item=>item.id == this.property.id)[0];
  }

  public getRelatedProperties(){
    this.appService.getRelatedProperties().subscribe(properties=>{
      this.relatedProperties = properties;
    })
  }

  public getFeaturedProperties(){
    this.appService.getFeaturedProperties().subscribe(properties=>{
      this.featuredProperties = properties.slice(0,3); 
      const res= this.property.features.map((x:any)=>x.desc)
      this.featureList=res
      
    })
  } 
  public getAllAgents( ){
     this.appService.getAgents().subscribe(data=>{
       this.agents =  data
        this.ids=data.map(x=>x.id)
      
      
      })
   }
  public getAgent(agentId:number ){
    
   var ids = [3,4,5,6]; //agent ids 
    
    
    agentId = ids[Math.floor(Math.random()*ids.length)]; //random agent id 
    this.appService.getAgentById(agentId).subscribe(data=>{
      this.agent =  data
     })
  }

  public onContactFormSubmit(values:Object){
    if (this.contactForm.valid) { 
    //  console.log(values);
    } 
  }

  public onMortgageFormSubmit(values:Object){ 
    if (this.mortgageForm.valid) { 
      var principalAmount = values['principalAmount']
      var down = values['downPayment']
      var interest = values['interestRate']
      var term = values['period']
      this.monthlyPayment = this.calculateMortgage(principalAmount, down, interest / 100 / 12, term * 12).toFixed(2);
    }     
  }
  public calculateMortgage(principalAmount:any, downPayment:any, interestRate:any, period:any){    
    return ((principalAmount-downPayment) * interestRate) / (1 - Math.pow(1 + interestRate, -period));
  } 

}