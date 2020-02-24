import { Component, OnInit, Input, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Question} from './models/question.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
  technology: any;
  showRecommendation: boolean;
  checkBoxValues: string[];
  // answerChoiceType : String;

  constructor(private http: HttpClient){
    this.iterator = 1;
    this.question = new Question();
    
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
    
    body = [
        {
          "componentName": "SQL"
        },
        {
          "componentName": "webUI"
        },
        {
          "componentName": "NoSQL"
        },
        {
          "componentName": "Security"
        }
      ];
    this.recommendation =  this.http.post("https://demo9790040.mockable.io/getRecommendation",body);
    this.recommendation.subscribe((response: any) => {
      this.technology = response;
      console.log("recommendation response is " + response.Technology.WebUI);
    },(err) => this.setError("Error while calling endpoint"));
  }

  getResponse(){
    let obs:any;
    // let questionResponse: QuestionDetails;
    obs = this.http.get("http://localhost:3000/first/architecture?appId=123");

    obs.subscribe((response: any) => {
      // console.log("the response is " , response);
      this.question = response;
      this.prevRequestQuestion = this.question;
      this.questions.push(this.question);
      
    },(err) => this.setError(err.message));
  }

  radioChangeHandler(event: any) {
    // console.log("radio button selected is ")
    // console.log(event.target.value)
    this.radioValue = event.target.value;
    // console.log(this.radioValue)
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
    console.log(this.checkBoxValues);
    // this.question.answer.answerChoice = this.checkBoxValues;
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

    let obs:any;
    // console.log("radioValue: " + this.radioValue);
    this.clearError();    
    obs = this.http.post("http://localhost:3000/next/architecture?appId=123",this.buildNextQuestionRequest(this.question))

    obs.subscribe((response: any) => {
      this.question = response;
      this.questions.push(response);
      this.clearFields();
      
      if (response.answer.answerChoiceType === "free-text" || response.answer.answerChoiceType === "numeric") {
        this.userText = "";
      }
      if (response.answer.answerChoiceType === "multi-choice") {
        this.qCheckbox = new Array(response.answer.answerChoice.length).fill(false);
      }
    },(err) => this.setError("Error while calling endpoint"));
  }

  buildNextQuestionRequest(resp : Question) : any{
    
    if(this.radioValue !== ""){
      resp.answer.answerChoice = [];
      let anchoice = this.radioValue;
      resp.answer.answerChoice.push(anchoice);

    } else if(this.userText !== ""){
      resp.answer.answerChoice = [];
      let anchoice = this.userText;
      resp.answer.answerChoice.push(anchoice);
      
    } else if (this.checkBoxValues.length !== 0) {
      resp.answer.answerChoice = this.checkBoxValues;
    }
    return resp;
  }


  onNextClick(){

    this.progressBarWidth = this.iterator / 8;
    let acs = this.question.answer.answerChoiceType;

    if (acs === "multi-choice") {
      console.log("qcheckbox: " + this.qCheckbox);
      for (var i = 0; i < this.qCheckbox.length; i++) {
        if (this.qCheckbox[i]) {
          this.checkBoxValues.push(this.question.answer.answerChoice[i]);
        }
      }

      if (this.checkBoxValues.length === 0) {
        this.setError("Please select an option to continue");
      }
      else {
        // console.log("hello")
        this.toggled = null;
        this.iterator += 1;
        this.callBackend();
      }
    }

    if (acs === "single-choice") {
      if (this.radioValue === "") {
        this.setError("Please select an option to continue");
      } else {
      this.toggled = null;
      //this.radioValue = "";
        // this.clearError();
        this.iterator += 1;
        this.callBackend();
      }
    }

    else if (this.question.answer.answerChoiceType === "checkbox-1") {
      let selected = false;
      for (let i = 0; i < 3; i++) {
        if (!selected)
          selected = this.qCheckbox[i];
      }
      if (!selected) {
        this.setError("Please select at least one option to continue");
      }
      else {
        this.iterator += 1;
        this.callBackend();
      }

    }
     else if (this.question.answer.answerChoiceType === "free-text" || this.question.answer.answerChoiceType === "numeric") {

      if (this.userText === "") {
        this.setError("Please enter a number!");
      } else {
        this.iterator += 1;
        this.callBackend();
      }
      console.log("user entered text " + this.userText);

    } else {
      this.radioValue = "";
      this.iterator += 1;
      this.callBackend();
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
  
  handleError(error: HttpErrorResponse){
    this.setError(error.message);
    } 
}
