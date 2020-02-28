import { Component, OnInit, Input, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Question} from './models/question.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Recommendation } from './models/recommendation-model';

@Component({
  selector: 'app-question',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {

  @Input('question') question: Question;

  prevRequestQuestion: Question;
  questions: Question[];
  qCheckbox = [];
  iterator: number;
  radioValue: string;
  show: boolean;
  comments: string;
  raiseError: boolean;
  errorMessage: string;
  isChecked: boolean;
  userText: string;
  toggled: any;
  progressBarWidth: number;
  recommendation: any;
  technology: Recommendation;
  showRecommendation: boolean;
  checkBoxValues: any[];
  tech_stack_loaded: boolean;
  quesNum: number;

  // answerChoiceType : String;

  constructor(private http: HttpClient){
    this.iterator = 0;
    this.question = new Question();
    this.technology = new Recommendation();
    this.tech_stack_loaded = false;
    
    this.radioValue = ""
    this.show = false;
    this.raiseError = false;
    this.isChecked = false;
    this.userText = "";
    this.clearRadios();
    this.progressBarWidth = 0;
    this.showRecommendation = false;
    this.questions = [];
    this.checkBoxValues = [];
   }

  ngOnInit(){
    this.getResponse();
  }

  showRecommendationPage(){
    this.showRecommendation = true;
    let obs: any;
    let body: any;
    
    body = {
      "componentName": ["SQL","NOSQL","Security","language", "WebUI"]
    }

    this.recommendation =  this.http.post("http://a29c7a33b58be11eaa27e0a668647ca6-1545753706.us-east-2.elb.amazonaws.com:9005/getRecommendation",body);
    this.recommendation.subscribe((response: Recommendation) => {
      this.technology = response;
      this.tech_stack_loaded = true;
      // console.log("technology")
      // console.log(this.technology)
      // console.log(this.technology.webUI)
      // console.log("recommendation response is " + response.Technology.WebUI);
    },(err) => this.setError("Error while calling endpoint"));
  }

  getResponse(){
    let obs:any;
    var url: string = "http://ae693b71a58c711ea94a0025b25b975f-1194880435.us-east-2.elb.amazonaws.com:9003/v1/questionnaire/first/architecture?appId=123";
    
    // url = "http://localhost:3400/v1/questionnaire/first/architecture?appId=123"
    console.log("url: " + url)
    obs = this.http.get(url);

    obs.subscribe((response: any) => {
      this.question = response;
      this.extractQuestionNumber();
      this.prevRequestQuestion = this.question;
      this.questions.push(this.question);
      
    },(err) => this.setError(err.message));
  }

  radioChangeHandler(event: any) {
    this.radioValue = event.target.value;
    console.log("inside radiochangehandler" + this.radioValue)
  }

  clearRadios() {
    for (let i = 0; i < 3; i++) {
      this.qCheckbox[i] = false;
    }
  }

  onCheckBoxChange(event) {
    if (event.target.checked){
      this.checkBoxValues.push(event.target.value);
    } else {
      for (var i = 0; i < this.checkBoxValues.length; i++) {
        if (this.checkBoxValues[i] === event.target.value) {
          this.checkBoxValues.splice(i, 1);
        }
      }
    }
  }

  clearFields() {
    this.comments = "";
    this.userText = "";
    this.radioValue = "";
    this.checkBoxValues = [];
  }

  checkBox(index: number) {
    this.qCheckbox[index] = !this.qCheckbox[index];
  }

  setError(errormsg : string) {
    this.errorMessage = errormsg;
    this.raiseError = true;
  }

  clearError() {
    this.errorMessage = "";
    this.raiseError = false;
  }

  callBackend() {

    this.progressBarWidth = this.iterator / 8;
    let obs:any;
    this.clearError();  
    var url: string = "http://ae693b71a58c711ea94a0025b25b975f-1194880435.us-east-2.elb.amazonaws.com:9003/v1/questionnaire/next/architecture?appId=123";
    // url = "http://localhost:3400/v1/questionnaire/next/architecture?appId=123";
    obs = this.http.post(url, this.buildNextQuestionRequest(this.question));
    
    // console.log("before")
    obs.subscribe((response: any) => {
      this.question = response;
      this.extractQuestionNumber();
      this.questions.push(response);
      this.clearFields();

      if (response.answer.answerChoiceType === "multi-choice") {
        this.qCheckbox = new Array(response.answer.answerChoice.length).fill(false);
      }
    },(err) => this.setError("Error while calling endpoint"));
  }

  questionClear() {
    this.question = new Question();
  }

  buildNextQuestionRequest(resp : Question) : any{
    this.questionClear();
    if(this.radioValue !== ""){
      resp.answer.answerChoice = [];
      let anchoice = {"optionText":this.radioValue};
      resp.answer.answerChoice.push(anchoice);

    } else if(this.userText !== ""){
      resp.answer.answerChoice = [];
      let anchoice = {"optionText":this.userText};
      resp.answer.answerChoice.push(anchoice);

    } else if (this.checkBoxValues.length !== 0) {
      console.log(this.checkBoxValues)
      resp.answer.answerChoice = this.checkBoxValues;
    }
    return resp;
  }


  onNextClick(){

    let acs = this.question.answer.answerChoiceType;

    if (acs === "multi-choice") {
      console.log("qcheckbox: " + this.qCheckbox);
      for (var i = 0; i < this.qCheckbox.length; i++) {
        console.log(this.qCheckbox[i]);
        if (this.qCheckbox[i]) {
          this.checkBoxValues.push({"optionText":this.question.answer.answerChoice[i].optionText});
        }
      }

      if (this.checkBoxValues.length === 0) {
        this.setError("Please select an option to continue");
      }
      else {
        this.toggled = null;
        this.iterator += 1;
        this.callBackend();
      }
    }

    else if (acs === "single-choice") {
      if (this.radioValue === "") {
        this.setError("Please select an option to continue");
      } else {
        this.toggled = null;
        this.iterator += 1;
        this.callBackend();
      }
    }

    else if (acs === "free-text") {
      if (this.userText === "") {
        this.setError("Please enter a name for the app!");
      }
      else {
        this.iterator += 1;
        this.callBackend();
      }
    }

    else if (acs === "numeric") {

      if (this.userText === "") {
        this.setError("Please enter a number!");
      } 
      else if (isNaN(Number(this.userText))/*/^\d+$/.test(this.userText)*/) {
        this.setError("Please enter only numbers!");
      }
      else {
        this.iterator += 1;
        this.callBackend();
      }
    } 
  }

  // onPreviousClick(){
  //   if (this.iterator >= 0) {
  //     this.iterator -= 1;
  //   }
  //   this.progressBarWidth = (this.iterator - 1) / 8;

  //   var obs : any;
  //   if(this.iterator === 1){
  //     obs = this.http.get("http://localhost:3000/first/architecture?appId=123");
  //   }else{
  //     obs = this.http.post("http://localhost:3000/next/architecture?appId=123",this.questions[this.extractQuestionNumber()-3]);
  //   }
    
    
  //   obs.subscribe((response: any) => {
  //     this.question = response;
  //     console.log("the prevoius response is " , response);
  //   },(err) => this.setError("Error while calling endpoint"));
  // }

  extractQuestionNumber() {
    this.quesNum = parseInt(this.question.questionId.substring(1));
  }
  
  handleError(error: HttpErrorResponse){
    this.setError(error.message);
    } 
}
