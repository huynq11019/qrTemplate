export interface IBuildingSurvey{
  title?: string;
  values?: number[];
}

export class BuildingSurvey implements IBuildingSurvey{
  constructor(
    public title?: string,
    public values?: Array<number>
  ) {
    this.title = title;
    this.values = values;
  }
}
