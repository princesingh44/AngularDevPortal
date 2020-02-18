import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-apps',
  templateUrl: './my-apps.component.html',
  styleUrls: ['./my-apps.component.css']
})
export class MyAppsComponent implements OnInit {

  showDiv:boolean = false;
  appDetails: any;

  constructor() { 
    this.appDetails = {
      platform: "Docker",
      scrumTeam: "Olympics",
      jiraKey: "SE-314743",
      requestType: "Microservices",
      projectKey: "SOADAS",
      serviceHealthURL: "www.sit-interlock.anthem.com",
      serviceName: "App1",
      contextRoot: "/tst/App1/1.0",
      archetype: "docker-prototype-ms",
      userID: "AD18279",
      bitbucketURL: "www.bitbucket.anthem.com",
      bambooURL: "www.bamboo.anthem.com"
    }
  }

  ngOnInit() {
    
  }

  showDetails(){
    this.showDiv = !this.showDiv;
  }

}
