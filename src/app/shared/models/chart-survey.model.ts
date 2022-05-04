import {BuildingSurvey} from './building-survey.model';

export interface IChartSurvey{
  labels?: Array<string>;
  data?: Array<BuildingSurvey>;
}

export class ChartSurvey implements IChartSurvey{
  constructor(
    public labels?: Array<string>,
    public data?: Array<BuildingSurvey>
  ) {
    this.labels = labels;
    this.data = data;
  }
}
