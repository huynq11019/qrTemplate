export interface IAnswer {
  id?: string;
  questionId?: string;
  value?: string;
  typed?: string;
  deleted?: boolean;
}

export class Answer implements IAnswer {
  constructor(
    public id?: string,
    public questionId?: string,
    public value?: string,
    public typed?: string,
    public deleted?: boolean
  ) {
    this.id = id;
    this.questionId = questionId;
    this.value = value;
    this.typed = typed;
    this.deleted = deleted;
  }
}
