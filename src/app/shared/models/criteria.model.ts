import {IQuestion} from './question.model';

export interface ICriteria {
  name?: string;
  label?: string;
  id?: string;
  questions?: IQuestion[];
}

export class Criteria implements ICriteria {
  constructor(
    public name?: string,
    public label?: string,
    public id?: string,
    public questions?: IQuestion[],
  ) {
    this.name = name;
    this.label = label;
    this.id = id;
    this.questions = questions;
  }
}
