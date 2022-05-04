import {ICriteria} from './criteria.model';

export interface ISurveyTemplate {
  id?: string;
  name?: string;
  otherOpinion?: string;
  type?: string;
  deleted?: boolean;
  questionGroups?: ICriteria[];
  // questionTemplates?: IQuestionTemplate[];
  // questionTemplateMaps?: any;
}

export class SurveyTemplate {
  constructor(
    public id?: string,
    public name?: string,
    public type?: string,
    public otherOpinion?: string,
    public deleted?: boolean,
    public questionGroups?: ICriteria[],
    // public questionGroup?: IQuestionTemplate[],
    // public questionTemplateMaps?: any
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.otherOpinion = otherOpinion;
    this.deleted = deleted;
    this.questionGroups = questionGroups;
    // this.questionTemplates = questionTemplates;
    // this.questionTemplateMaps = questionTemplateMaps;
  }
}


