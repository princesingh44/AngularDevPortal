import { Answer } from './answer.model';
export class Question {
    _id:String;
    questionId: string;
    questionText: string;
    lastQuestion: Boolean;
    questionType: String;
    answer: Answer;
    
    constructor(){
        this.answer = new Answer();
    }
}
