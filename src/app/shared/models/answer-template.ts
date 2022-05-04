export interface IAnswerTemplate {
  id?: string;
  value?: string;
  type?: string;
  questionTemplateId?: string;
  deleted?: boolean;
}

export class AnswerTemplate implements IAnswerTemplate {
  constructor(
    public id?: string,
    public value?: string,
    public type?: string,
    public questionTemplateId?: string,
    public deleted?: boolean,
  ) {
    this.id = id;
    this.value = value;
    this.type = type;
    this.questionTemplateId = questionTemplateId;
    this.deleted = deleted;
  }
}
