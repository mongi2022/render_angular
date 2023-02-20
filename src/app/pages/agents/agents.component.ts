import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  public agents;
  properties: import("/home/tpc/Bureau/PROJET_TEST/NODEJS/real-estate-front/real-estate-front/src/app/app.models").Property[];
  constructor(public appService:AppService) { }

  ngOnInit() {
   this.getAgents()
   this.getProperties()
  }
  getProperties(){
    this.appService.getProperties().subscribe(data=>{
  console.log(data);
  
     
        this.properties=data

    })    
    
    
    
    
  }
  getAgents(){
    this.appService.getAgents().subscribe(data=>{
      this.agents=data
      
      
    })  }
}
