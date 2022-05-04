import {IAnswer} from './answer.model';

export interface IQuestion {
  id?: string;
  questionNumber?: number;
  content?: string;
  label?: string;
  group?: string;
  surveyId?: string;
  type?: string;
  rangeAnswer?: number;
  deleted?: boolean;
  answers?: IAnswer[];
}

export class Question implements IQuestion {
  constructor(
    public id?: string,
    public questionNumber?: number,
    public content?: string,
    public label?: string,
    public group?: string,
    public surveyId?: string,
    public type?: string,
    public rangeAnswer?: number,
    public deleted?: boolean,
    public answers?: IAnswer[],
  ) {
    this.id = id;
    this.questionNumber = questionNumber;
    this.content = content;
    this.label = label;
    this.group = group;
    this.surveyId = surveyId;
    this.type = type;
    this.rangeAnswer = rangeAnswer;
    this.deleted = deleted;
    this.answers = answers;
  }
}
