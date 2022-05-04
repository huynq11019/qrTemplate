import {ISurveyTemplate} from './survey-template.model';
import {ICriteria} from './criteria.model';

export interface ISurvey {
  id?: string;
  name?: string;
  criteria?: string;
  introduction?: string;
  notificationContent?: string;
  startAt?: number;
  endAt?: number;
  note?: string;
  buildingIds?: string[];
  buildingCode?: string[];
  organizationIds?: string[];
  floorIds?: string[];
  floor?: number[];
  deleted?: boolean;
  checked?: boolean;
  status?: string;
  surveyTemplate?: ISurveyTemplate;
  surveyTemplateId?: string;
  questionGroupExists?: ICriteria[];
  questionGroups?: ICriteria[];
}

export class Survey implements ISurvey {
  constructor(
    public id?: string,
    public name?: string,
    public criteria?: string,
    public introduction?: string,
    public notificationContent?: string,
    public startAt?: number,
    public endAt?: number,
    public note?: string,
    public buildingIds?: string[],
    public buildingCode?: string[],
    public floor?: number[],
    public floorIds?: string[],
    public organizationIds?: string[],
    public deleted?: boolean,
    public checked?: boolean,
    public status?: string,
    public surveyTemplate?: ISurveyTemplate,
    public surveyTemplateId?: string,
    public questionGroupExists?: ICriteria[],
    public questionGroups?: ICriteria[],
  ) {
    this.id = id;
    this.name = name;
    this.criteria = criteria;
    this.introduction = introduction;
    this.notificationContent = notificationContent;
    this.startAt = startAt;
    this.endAt = endAt;
    this.note = note;
    this.buildingIds = buildingIds;
    this.buildingCode = buildingCode;
    this.floor = floor;
    this.floorIds = floorIds;
    this.organizationIds = organizationIds;
    this.deleted = deleted;
    this.checked = checked;
    this.status = status;
    this.surveyTemplate = surveyTemplate;
    this.surveyTemplateId = surveyTemplateId;
    this.questionGroupExists = questionGroupExists;
    this.questionGroups = questionGroups;
  }
}
