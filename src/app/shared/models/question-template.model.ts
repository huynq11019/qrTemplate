import {IAnswerTemplate} from './answer-template';

export interface IQuestionTemplate {
  id?: string;
  content?: string;
  surveyTemplateId?: string;
  type?: string;
  rangeAnswer?: number;
  deleted?: boolean;
  answerTemplates?: IAnswerTemplate[];
}

export class QuestionTemplate implements IQuestionTemplate {
  constructor(
    public id?: string,
    public content?: string,
    public surveyTemplateId?: string,
    public type?: string,
    public rangeAnswer?: number,
    public deleted?: boolean,
    public answerTemplates?: IAnswerTemplate[]
  ) {
    this.id = id;
    this.content = content;
    this.surveyTemplateId = surveyTemplateId;
    this.type = type;
    this.rangeAnswer = rangeAnswer;
    this.deleted = deleted;
    this.answerTemplates = answerTemplates;
  }
}
