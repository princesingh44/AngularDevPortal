import { Injectable } from '@angular/core';
import { Question } from  '../models/question.model';
import { Answer } from  '../models/answer.model';
import { HttpClient } from '@angular/common/http';
//import { MockGetQuestion } from '../mocks/first-question.json';
//import a = require("../mocks/first-question.jsona.json");
//import * as MockGetQuestion from "../mocks/first-question.json";


@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
   
  constructor(private http: HttpClient, ) { }

  getPreviousQuestionTypes(question: Question): Question {
    var obs = this.http.get('http://localhost:8000/app/question' );
    let respQuestion: Question;
    obs.subscribe((response: Question) => {
      respQuestion = response;
    })
    return respQuestion;
  }
  getNextQuestionTypes(question: Question): Question {
    var obs = this.http.get('http://localhost:8000/app/question' );
    let respQuestion: Question;
    
    obs.subscribe((response: Question) => {
      respQuestion = response;
      //console.log("value of iterator: " + this.iterator)
      //console.log("iterator: " + this.iterator + "    questionNumber: " + this.question.questionId    )
      //this.clearFields();
    });
    return respQuestion;
  }
  getFirstQuestionTypes(): Question {

  //  const data: Question = require('../mocks/first-question.json').Question;

  //  console.log("-----Load----");
  //  console.log(data);
        
    let question = new Question();
    question.questionId = "1";
    question.questionText = "How will users access your app?";

    let answer = new Answer();
    answer.answerChoiceType = "checkbox"
    //let answerChoices = [{"optionText":"Web Service application"}, "Mobile application" , "UI application"]
    //answer.answerChoice = answerChoices

    let answers: Array<Answer> = [];
    answers.push(answer);

    question.answer = answer;
    return question;
  }

}
