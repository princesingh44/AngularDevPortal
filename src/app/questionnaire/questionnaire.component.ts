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
    

    // this.question = new QuestionDetails();
    // this.question.questionId = "1";
    // this.question.questionText = "How will users access your app?";
    // this.question.questionOptionType = "checkbox";

    // let answerChoices: Array<AnswerChoice> = [];
    // let answerChoice = new AnswerChoice();
    // answerChoice.optionText = "Web Service application";
    // answerChoice.answerId = "a1";
    // //answerChoices[0] = answerChoice;
    // answerChoices.push(answerChoice);


    // answerChoice = new AnswerChoice();
    // answerChoice.optionText = "Mobile application";
    // answerChoice.answerId = "a2";
    // //answerChoices[1] = answerChoice;
    // answerChoices.push(answerChoice);

    // answerChoice = new AnswerChoice();
    // answerChoice.optionText = "UI application";
    // answerChoice.answerId = "a3";
    // answerChoices.push(answerChoice);
    
    // let answer = new Answer();
    // answer.answerChoice = answerChoices;

    // let answers: Array<Answer> = [];
    // answers.push(answer);

    // this.question.answer = answers;
    
    

    // this.postResponse();
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

  postResponse() {
    let obs: any;
    let body = {"appId":123}
    obs = this.http.post("http://localhost:3000/next/architecture?appId=123",this.question)
    obs.subscribe((response: any) => {
      console.log("post response is " + response);
    });
  }

  getResponse(){
    let obs:any;
    // let questionResponse: QuestionDetails;
    obs = this.http.get("http://localhost:3000/first/architecture?appId=123");

    obs.subscribe((response: any) => {
      console.log("the response is " , response);
      this.question = response;
      this.prevRequestQuestion = this.question;
      this.questions.push(this.question);

      console.log("questionID: " + this.question.questionId);
      console.log("questionText: " + this.question.questionText);
      console.log("questionType:" + this.question.questionType);
      //console.log("options: " + this.question.answer.answerChoiceType);
      //console.log("answer options: " + this.question.answer.answerChoice);
    },(err) => this.setError(err.message));

    // obs.subscribe((response: QuestionDetails) => {
    //   this.question = response;
    //   console.log("value of iterator: " + this.iterator)
    //   console.log("iterator: " + this.iterator + "    questionNumber: " + this.question.questionId    )
    //   this.clearFields();
    //   });
  }

  radioChangeHandler(event: any) {
    console.log("radio button selected is ")
    console.log(event.target.value)
    this.radioValue = event.target.value;
    console.log(this.radioValue)
  }

  clearRadios() {
    for (let i = 0; i < 3; i++) {
      this.qCheckbox[i] = false;
    }
  }

  clearFields() {
    this.comments = "";
    this.userText = "";
    this.radioValue = "";
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
    console.log("radioValue: " + this.radioValue);
    this.clearError();
    /*if (this.question.questionId === "3" && this.radioValue === "Yes") {
      console.log("inside if")
      obs = this.http.get('http://localhost:8000/app/question' + this.iterator + "a");
    } else {
      console.log("inside else")
      obs = this.http.get('http://localhost:8000/app/question' + this.iterator);
    }*/
    
    obs = this.http.post("http://localhost:3000/next/architecture?appId=123",this.buildNextQuestionRequest(this.question))

    
    obs.subscribe((response: any) => {
    this.question = response;
    this.questions.push(response);
    console.log("value of iterator: " + this.iterator)
    console.log("iterator: " + this.iterator + "    questionNumber: " + this.question.questionId    )
    //console.log(response);
    console.log(this.question);
    //ApplicationRef.tick()
    //this.ref.detectChanges();
    //IDetectorRef.detectChanges()
    //this.clearFields();
    },(err) => this.setError("Error while calling endpoint"));
  }

  buildNextQuestionRequest(resp : Question) : any{
    console.log("3333test");
    console.log(this.radioValue);
    /*if(this.radioValue !== ""){
      console.log("test111");
    resp.answer.answerChoice = [];
    let anchoice = {"optionText":this.radioValue};
    resp.answer.answerChoice.push(anchoice);
    }*/
    return resp;
  }


  onNextClick(){

    this.progressBarWidth = this.iterator / 4;
    let acs = this.question.answer.answerChoiceType;
    if ((acs === "multi-choice" || acs === "single-choice") ) {
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

    else if ((acs === "multi-choice" || acs === "single-choice") && this.question.questionId === "3") {
      if (this.radioValue === "Yes"){
        this.callBackend();
      
      } else if (this.radioValue === "No") {
        this.radioValue = "";
        this.iterator += 1;
        this.callBackend();
      }
      else if (this.radioValue === "NoSQL") {
        this.radioValue = "";
        this.iterator += 1;
        this.callBackend();
      }
      else if (this.radioValue === "SQL") {
        this.radioValue = "";
        this.iterator += 1;
        this.callBackend();
      }
      else {
        this.setError("Please select an option to continue");
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
    //   this.clearError();
    //   console.log("checkbox is " + this.isChecked);

    }
     else if (this.question.answer.answerChoiceType === "free-text") {

      if (this.userText === "") {
        this.setError("Please enter a number!");
      } /*else if (isNaN(Number(this.userText))) {
        this.setError("Only numbers are allowed!")
      } */else {
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

  onPreviousClick(){
    if (this.iterator >= 0) {
      this.iterator -= 1;
    }
    this.progressBarWidth = (this.iterator - 1) / 4;

    var obs : any;
    if(this.iterator === 1){
      obs = this.http.get("http://localhost:3000/first/architecture?appId=123");
    }else{
      obs = this.http.post("http://localhost:3000/next/architecture?appId=123",this.questions[this.extractQuestionNumber()-3]);
    }
    
    
    obs.subscribe((response: any) => {
      this.question = response;
      console.log("the prevoius response is " , response);
    },(err) => this.setError("Error while calling endpoint"));
  }
  
  handleError(error: HttpErrorResponse){
    this.setError(error.message);
    }
  
  extractQuestionNumber(): number{
     let quesNumber: number;
     let currQuesNumString = this.question.questionId.substring(1,2);
     quesNumber = parseInt(currQuesNumString);
     console.log("ques number: ", quesNumber);
 
     return quesNumber;
   } 
  
 
}
