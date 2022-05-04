import {Building} from './building.model';
import {Survey} from './survey.model';
import {Customer} from './customer.model';

export class SurveyResult {
  constructor(
    public building?: Building,
    public buildingId?: string,
    public averageScore?: number,
    public quantity?: number,
    public realScore?: number,
    public survey?: Survey,
    public surveyId?: string,
    public organization?: Customer,
    public organizationId?: string,
    public otherOpinions?: any,
    public totalScore?: number,
    public surveyAt?: number,
    public questionGroups?: any,
  ) {
    this.building = building;
    this.buildingId = buildingId;
    this.averageScore = averageScore;
    this.quantity = quantity;
    this.realScore = realScore;
    this.survey = survey;
    this.surveyId = surveyId;
    this.organization = organization;
    this.organizationId = organizationId;
    this.otherOpinions = otherOpinions;
    this.totalScore = totalScore;
    this.surveyAt = surveyAt;
    this.surveyAt = questionGroups;
  }
}
