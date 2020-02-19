import { Component, OnInit, Input } from '@angular/core';
import { Question} from './models/question.model';
import { QuestionnaireService } from './services/questionnaire.service';


@Component({
  selector: 'app-question',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {

  @Input('question') question: Question;

 
  aSelectedCheckbox = [];
  
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

  constructor(protected questionnaireService : QuestionnaireService){
    this.iterator = 1;
    
    this.radioValue = ""
    this.show = false;
    this.raiseError = false;
    this.isChecked = false;
    this.userText = "";
    //this.clearRadios();
    this.progressBarWidth = 10;
 
    
   }

  ngOnInit(){
    this.getFirstQuestionTypes();
  }


  getFirstQuestionTypes(): void {
    this.question = this.questionnaireService.getFirstQuestionTypes();
  }

  radioChangeHandler(event: any) {
    console.log("radio button selected is " + event.target.value)
    this.radioValue = event.target.value;
  }

  clearRadios() {
    for (let i = 0; i < 3; i++) {
      this.aSelectedCheckbox[i] = false;
    }
  }

  clearFields() {
    this.comments = "";
    this.userText = "";
    this.radioValue = "";
  }

  checkBox(index: number) {
    this.aSelectedCheckbox[index] = !this.aSelectedCheckbox[index];
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

    let respQuestion: Question;
    console.log("radioValue: " + this.radioValue);
    this.clearError();
    if (this.question.questionId === "3" && this.radioValue === "Yes") {
      console.log("inside if")
      respQuestion = this.questionnaireService.getNextQuestionTypes(this.question);// this.http.get('http://localhost:8000/app/question' + this.iterator + "a");
    } else {
      console.log("inside else")
      respQuestion = this.questionnaireService.getNextQuestionTypes(this.question);//this.http.get('http://localhost:8000/app/question' + this.iterator);
    }
    
    
  }

  onNextClick(){

    // this.progressBarWidth = this.question.questionNumber / 4;

    if (this.question.answer[0].answerChoiceType === "radio" && this.question.questionId === "2") {
      if (this.radioValue === "") {
        this.setError("Please select an option to continue");
      } else {
      this.toggled = null;
      this.radioValue = "";
        // this.clearError();
        this.iterator += 1;
        this.callBackend();
      }
    }

    else if (this.question.answer[0].answerChoiceType === "radio" && this.question.questionId === "3") {
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

    else if (this.question.answer[0].answerChoiceType === "checkbox") {
      let selected = false;
      for (let i = 0; i < 3; i++) {
        if (!selected)
          selected = this.aSelectedCheckbox[i];
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
     else if (this.question.answer[0].answerChoiceType === "text") {

      if (this.userText === "") {
        this.setError("Please enter a number!");
      } else if (isNaN(Number(this.userText))) {
        this.setError("Only numbers are allowed!")
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

  onPreviousClick(){
    if (this.iterator > 0) {
      this.iterator -= 1;
    }
    this.progressBarWidth = (this.iterator - 1) / 4;

    var obs = this.questionnaireService.getPreviousQuestionTypes(this.question);//this.http.get('http://localhost:8000/app/question' + this.iterator);
    
  }
  

}
