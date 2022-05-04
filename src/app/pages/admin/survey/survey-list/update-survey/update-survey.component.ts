import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { STATUS } from '@shared/constants/status.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IBuilding } from '@shared/models/building.model';
import { Criteria, ICriteria } from '@shared/models/criteria.model';
import { ICustomer } from '@shared/models/customer.model';
import { IFloor } from '@shared/models/floor.model';
import { IQuestion, Question } from '@shared/models/question.model';
import {
  ISurveyTemplate,
  SurveyTemplate,
} from '@shared/models/survey-template.model';
import { ISurvey, Survey } from '@shared/models/survey.model';
import { AccountService } from '@shared/services/account.service';
import { BuildingService } from '@shared/services/building.service';
import { CustomerService } from '@shared/services/customer.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { QuestionGroupService } from '@shared/services/question-group.service';
import { SurveyTemplateService } from '@shared/services/survey-template.service';
import { SurveyService } from '@shared/services/survey.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-update-survey',
  templateUrl: './update-survey.component.html',
  styleUrls: ['./update-survey.component.scss'],
})
export class UpdateSurveyComponent implements OnInit {
  id = '';
  isUpdate = false;
  isDetail = false;
  isCreateSurveyTemplate = false;
  survey: Survey = new Survey();
  criteriaQuestions: ICriteria[] = [];
  form: FormGroup = new FormGroup({});
  pathTranslate = 'model.survey.';
  buildings: IBuilding[] = [];
  floors: IFloor[] = [];
  organizations: ICustomer[] = [];
  surveyTemplates: ISurveyTemplate[] = [];
  surveyTemplate: ISurveyTemplate = new SurveyTemplate();
  oldSurveyTemplate: ISurveyTemplate = new SurveyTemplate();
  checkQuestions = false;
  checkCriteria = false;
  delay: any;
  questionGroups: ICriteria[] = [];
  oldQuestion: IQuestion[] = [];
  startAt = new Date();
  DONE = 'DONE';
  keySurveyTemplate = '';
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private modalService: NzModalService,
    private toast: ToastService,
    private surveyService: SurveyService,
    private buildingService: BuildingService,
    private surveyTemplateService: SurveyTemplateService,
    private customerService: CustomerService,
    private questionGroupService: QuestionGroupService,
    private router: ActivatedRoute,
    private route: Router,
    private accountService: AccountService
  ) {
    this.router.paramMap.subscribe((response) => {
      this.id = response.get('id') || '';
    });
    // this.initForm();
  }

  @ViewChild('startPicker') startPicker!: NzDatePickerComponent;

  @ViewChild('endPicker') endPicker!: NzDatePickerComponent;

  ngOnInit(): void {
    if (!!this.id) {
      const action = this.route.url.slice(this.route.url.lastIndexOf('/') + 1);
      if (action.includes('detail')) {
        this.isDetail = true;
      } else {
        this.isUpdate = true;
      }
      this.initForm();
      this.initSurvey(this.id);
    } else {
      this.initForm();
    }
    // this.initForm();
    this.initData();
    this.valueChangesForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [
        {
          value: this.isUpdate || this.isDetail ? this.survey?.name : null,
          disabled: this.isDetail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      introduction: [
        {
          value:
            this.isUpdate || this.isDetail ? this.survey?.introduction : null,
          disabled: this.isDetail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CONTENT_MAX_LENGTH.MAX),
        ],
      ],
      notificationContent: [
        {
          value:
            this.isUpdate || this.isDetail
              ? this.survey?.notificationContent
              : null,
          disabled: this.isDetail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CONTENT_MAX_LENGTH.MAX),
        ],
      ],
      otherOpinion: [
        {
          value:
            this.isUpdate || this.isDetail
              ? this.survey?.surveyTemplate?.otherOpinion
              : '',
          disabled: this.isDetail,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.OPINION_MAX_LENGTH.MAX),
        ],
      ],
      note: [
        {
          value: this.isUpdate || this.isDetail ? this.survey?.note : '',
          disabled: this.isDetail,
        },
        [Validators.maxLength(LENGTH_VALIDATOR.NOTE_MAX_LENGTH.MAX)],
      ],
      buildingIds: [
        {
          value: this.isUpdate || this.isDetail ? this.survey?.buildingIds : [],
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      floorIds: [
        {
          value: this.isUpdate || this.isDetail ? this.survey?.floorIds : [],
          disabled: !(this.isUpdate || this.isDetail) || this.isDetail,
        },
      ],
      organizationIds: [
        {
          value:
            this.isUpdate || this.isDetail ? this.survey?.organizationIds : [],
          disabled: this.isDetail || !(this.isUpdate || this.isDetail),
        },
      ],
      startAt: [
        {
          value:
            this.isUpdate || this.isDetail
              ? new Date(this?.survey?.startAt || 0)
              : new Date(),
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      endAt: [
        {
          value:
            this.isUpdate || this.isDetail
              ? new Date(this?.survey?.endAt || 0)
              : new Date(),
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      surveyTemplateId: [
        {
          value:
            this.isUpdate || this.isDetail
              ? this.survey?.surveyTemplateId
              : null,
          disabled: this.isDetail,
        },
        [
          Validators.maxLength(LENGTH_VALIDATOR.ID_MAX_LENGTH.MAX),
          Validators.required,
        ],
      ],
      surveyTemplateName: [
        { value: '', disabled: this.isDetail },
        [Validators.maxLength(LENGTH_VALIDATOR.TITLE_MAX_LENGTH.MAX)],
      ],
      criteria: this.fb.array([]),
    });
  }

  initData(): void {
    this.accountService.getBuildings(true).subscribe((res: any) => {
      this.buildings = res?.body?.data;
    });
    if (this.isDetail) {
      // this.buildings.push(this.s)
    }
    // this.buildingService.searchBuildingAutoComplete({}).subscribe((response: any) => {
    //   this.buildings = response?.body?.data as Array<Building>;
    // });
    // this.customerService.search({}).subscribe((res: any) => {
    //   this.organizations = res?.body?.data as Array<Customer>;
    // });
    this.surveyTemplateService
      .search({ sortBy: 'name.asc' }, true)
      .subscribe((response: any) => {
        this.surveyTemplates = response?.body?.data;
      });
    // this.questionGroupService.getAll().subscribe((res: any) => {
    //   this.questionGroups = res.body?.data as Array<Criteria>;
    // });
  }

  onUpdateSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const survey = this.handleMapSurvey(this.form);
    this.surveyService
      .update(survey, this.survey?.id, true)
      .subscribe((res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success(this.getTranslate('success.msg'));
          this.onCancel();
        } else {
          this.toast.success(this.getTranslate('error.msg'));
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const survey = this.handleMapSurvey(this.form);
    this.surveyService.create(survey, true).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.survey.success.create-survey');
        window.history.back();
      }
    });
  }

  handleMapSurveyTemplate(criteria: Criteria[]): SurveyTemplate {
    criteria.forEach((item: Criteria) => {
      item.questions?.map((q) => {
        q.group = item.name;
        return q;
      });
    });
    let surveyTemplate: SurveyTemplate;
    if (this.isCreateSurveyTemplate) {
      surveyTemplate = {
        name: this.form?.get('surveyTemplateName')?.value,
        otherOpinion: this.form?.get('otherOpinion')?.value,
        questionGroups: [...criteria],
      };
    } else {
      surveyTemplate = {
        id: this.surveyTemplate.id,
        name: this.surveyTemplate.name,
        otherOpinion: this.surveyTemplate.otherOpinion,
        // questionGroups: this.questionGroups
        questionGroups: [...criteria],
      };
    }
    return surveyTemplate;
  }

  handleMapSurvey(form: FormGroup): Survey {
    const criteria = [...this.criteria().getRawValue()];
    const survey = new Survey();
    survey.id = this.survey?.id;
    survey.surveyTemplate = this.handleMapSurveyTemplate(criteria);
    survey.startAt = CommonUtil.getStartOfDay(
      new Date(form?.get('startAt')?.value).getTime()
    );
    survey.endAt = CommonUtil.getEndOfDay(
      new Date(form?.get('endAt')?.value).getTime()
    );
    survey.surveyTemplateId = form?.get('surveyTemplateId')?.value;
    survey.name = form?.get('name')?.value;
    survey.introduction = form?.get('introduction')?.value;
    survey.buildingIds = form?.get('buildingIds')?.value;
    survey.floorIds = form?.get('floorIds')?.value;
    survey.organizationIds = form?.get('organizationIds')?.value;
    survey.note = form?.get('note')?.value;
    survey.notificationContent = form?.get('notificationContent')?.value;

    return CommonUtil.trim(survey);
  }

  initSurvey(id: string): void {
    this.surveyService.findBySurveyId(id, true).subscribe((response: any) => {
      this.survey = response.body?.data;
      if (this.survey?.status === this.DONE && this.isUpdate) {
        window.history.back();
        this.isDetail = true;
        this.isUpdate = false;
      }
      this.handleMapFormToSurvey(response.body?.data);
      this.customerService
        .findIds({ ids: response.body?.data?.organizationIds }, true)
        .subscribe((res: any) => {
          if (res?.body?.data && res?.body?.data?.length > 0) {
            const data = res.body.data;
            this.organizations = [...this.organizations, ...data];
          }
        });
      // this.surveyTemplateService.search({}, true).subscribe((res: any) => {
      //   this.surveyTemplates = res?.body?.data;
      // });
      // this.changeSurveyTemplate(this.survey.surveyTemplateId);
    });
  }

  handleMapFormToSurvey(survey: ISurvey): void {
    this.form.get('organizationIds')?.setValue(survey?.organizationIds || null);
    this.form.get('floorIds')?.setValue(survey?.floorIds || []);
    this.form.get('buildingIds')?.setValue(survey?.buildingIds || null);
    this.form.get('name')?.setValue(survey?.name || null);
    this.form.get('introduction')?.setValue(survey?.introduction || null);
    this.form
      .get('otherOpinion')
      ?.setValue(survey?.surveyTemplate?.otherOpinion || null);
    this.form.get('note')?.setValue(survey?.note || null);
    this.form.get('startAt')?.setValue(survey?.startAt || null);
    this.form.get('endAt')?.setValue(survey?.endAt || null);
    this.form
      .get('surveyTemplateId')
      ?.setValue(survey?.surveyTemplateId || null);
    this.form.get('surveyTemplateName')?.setValue('');
    this.form
      .get('notificationContent')
      ?.setValue(survey?.notificationContent || null);
    this.startAt = moment(survey?.startAt).toDate();
  }

  onCancel(): void {
    window.history.back();
  }

  getTranslate(str: string): string {
    return this.translateService.instant(this.pathTranslate + '' + str);
  }

  // searchBuilding(keyword: any): void {
  //   clearTimeout(this.delay);
  //   this.delay = setTimeout(() => {
  //     const option = {
  //       keyword: keyword?.trim()
  //     };
  //     this.buildingService.searchBuildingAutoComplete(option).subscribe((response: any) => {
  //       this.buildings = response?.body?.data;
  //     });
  //   }, SEARCH_TIME_WAIT);
  // }

  // changeBuilding(buildingIds: any): void {
  //   if (!!buildingIds && buildingIds.length > 0) {
  //     this.form.get('organizationIds')?.enable();
  //     this.customerService.findByBuildings({ids: buildingIds}).subscribe((res: any) => {
  //       this.organizations = res?.body?.data;
  //     });
  //   }
  //   else{
  //     this.form.get('organizationIds')?.reset();
  //     this.form.get('organizationIds')?.disable();
  //   }
  //   if (!!buildingIds && buildingIds.length === 1) {
  //     this.form.get('floorIds')?.enable();
  //     if (!!this.buildings) {
  //       this.buildings = new Array();
  //     }
  //     buildingIds.forEach((i: any) => {
  //       this.buildingService.getById(i).subscribe((res: any) => {
  //         if (res?.body?.success) {
  //           const building = res.body?.data;
  //           if (this.buildings.indexOf(building) === -1) {
  //             this.buildings.push(building);
  //           }
  //         }
  //       });
  //     });
  //
  //     this.buildingService.searchFloorByBuilding(this.form?.get('buildingIds')?.value, {})
  //       .subscribe((response: any) => {
  //         this.floors = response?.body?.data;
  //       });
  //   } else {
  //     this.form.get('floorIds')?.reset();
  //     this.form.get('floorIds')?.disable();
  //   }
  //   this.searchBuilding('');
  // }

  // searchFloorByBuilding(keyword: any): void {
  //   clearTimeout(this.delay);
  //   this.delay = setTimeout(() => {
  //     const option = {
  //       keyword: keyword?.trim()
  //     };
  //     this.buildingService.searchFloorByBuilding(this.form?.get('buildingIds')?.value, option)
  //       .subscribe((response: any) => {
  //         this.floors = response?.body?.data as Array<Floor>;
  //       });
  //   }, SEARCH_TIME_WAIT);
  // }

  searchFloorByBuilding(event: any): void {
    const option = {
      keyword: event?.target?.value.trim(),
      sortBy: 'name.asc',
    };
    this.buildingService
      .searchFloorByBuilding(this.form?.get('buildingIds')?.value, option, true)
      .subscribe((response: any) => {
        this.floors = response?.body?.data;
      });
  }

  // searchOrganization(keyword: any): void {
  //   clearTimeout(this.delay);
  //   this.delay = setTimeout(() => {
  //     const option = {
  //       keyword: keyword?.trim()
  //     };
  //     this.customerService.search(option).subscribe((res: any) => {
  //       this.organizations = res?.body?.data;
  //     });
  //   }, SEARCH_TIME_WAIT);
  // }

  //  Survey Template
  createNewSurveyTemplate(): void {
    this.isCreateSurveyTemplate = !this.isCreateSurveyTemplate;
    this.clearSurveyTemplate();
    if (this.isCreateSurveyTemplate) {
      this.form?.controls?.surveyTemplateName?.setValidators(
        Validators.required
      );
      this.form?.controls?.surveyTemplateName?.updateValueAndValidity();
      this.form?.controls?.surveyTemplateId?.clearValidators();
      this.form?.controls?.surveyTemplateId?.updateValueAndValidity();
      this.addItemCriteriaControl();
    } else {
      this.form?.controls?.surveyTemplateId?.setValidators(Validators.required);
      this.form?.controls?.surveyTemplateId?.updateValueAndValidity();
      this.form?.controls?.surveyTemplateName?.clearValidators();
      this.form?.controls?.surveyTemplateName?.updateValueAndValidity();
      this.removeItemCriteriaControl(0);
    }
    this.form?.get('surveyTemplateName')?.reset();
    this.form.get('surveyTemplateId')?.reset();
  }

  //  Criteria
  // createNewCriteria(idx: number): void {
  //   this.criteria().at(idx).get('isCreate')?.setValue(!this.criteria().at(idx).get('isCreate')?.value);
  //   this.clearCriteria(idx);
  //   // this.clearSurveyTemplate();
  //   // this.form.get('surveyTemplateId')?.reset();
  // }

  clearSurveyTemplate(): void {
    this.oldSurveyTemplate = this.surveyTemplate;
    let idx = 0;
    if (!!this.oldSurveyTemplate?.id) {
      this.form.get('otherOpinion')?.reset();
      this.form.get('otherOpinion')?.enable();
      for (const key of this.oldSurveyTemplate?.questionGroups || []) {
        if (!!key) {
          this.criteriaQuestions.pop();
          this.criteria().clear();
          idx++;
        }
      }
    }
  }

  clearCriteria(idx: number): void {
    this.questions(idx).clear();
    this.criteria().at(idx).get('name')?.reset();
    this.criteria().at(idx).get('id')?.reset();
  }

  createSurveyTemplate(surveyTemplate: ISurveyTemplate): void {
    if (!!surveyTemplate.id) {
      this.form.get('otherOpinion')?.setValue(surveyTemplate.otherOpinion);
      this.form.get('otherOpinion')?.disable();
      let idx = 0;
      for (const key of surveyTemplate?.questionGroups || []) {
        if (!!key) {
          this.criteriaQuestions.push(
            new Criteria(key.name, key.label, key.id, key.questions)
          );
          const c = new Criteria(key.name, key.label, key.id, key.questions);
          this.criteria().push(this.createItemCriteriaControl(c));
          this.criteria().disable();
          c.questions?.forEach((item) => {
            this.questions(idx).push(this.createItemControl(item));
            this.questions(idx).disable();
          });
          idx++;
        }
      }
    }
  }

  // searchSurveyTemplate(keyword: string): void {
  //   clearTimeout(this.delay);
  //   this.delay = setTimeout(() => {
  //     const option = {
  //       keyword: keyword?.trim()
  //     };
  //     this.keySurveyTemplate = keyword?.trim();
  //     this.surveyTemplateService.search(option)
  //       .subscribe((response: any) => {
  //         // this.oldSurveyTemplate = this.surveyTemplate;
  //         this.surveyTemplates = response?.body?.data as Array<ISurveyTemplate>;
  //       });
  //   }, SEARCH_TIME_WAIT);
  // }

  searchSurveyTemplate(event: any): void {
    const keyword = event?.target?.value;
    const option = {
      keyword: keyword?.trim(),
      sortBy: 'name.asc',
    };
    this.keySurveyTemplate = keyword?.trim();
    this.surveyTemplateService
      .search(option, true)
      .subscribe((response: any) => {
        this.surveyTemplates = response?.body?.data;
      });
  }

  changeSurveyTemplate(surveyTemplateId: any): void {
    if (!!surveyTemplateId) {
      this.surveyTemplateService
        .getById(surveyTemplateId, true)
        .subscribe((response: any) => {
          if (response?.body?.success) {
            this.clearSurveyTemplate();
            this.surveyTemplate = response?.body?.data;
            this.form
              ?.get('surveyTemplateName')
              ?.setValue(this.surveyTemplate?.name);
            if (
              this.surveyTemplates?.filter(
                (item) => item?.id === this.surveyTemplate?.id
              ).length <= 0
            ) {
              if (!this.surveyTemplates) {
                this.surveyTemplates = [];
              }
              this.surveyTemplates?.push(this.surveyTemplate);
            }
            this.createSurveyTemplate(this.surveyTemplate);
          }
        });
    }
  }

  // changeCriteria(criteriaId: string, idx: number): void {
  //   if (!!criteriaId) {
  //     this.questionGroupService.getById(criteriaId).subscribe((rs: any) => {
  //       const criteria = rs?.body?.data;
  //       this.criteria().removeAt(idx);
  //       this.criteria().push(this.createItemCriteriaControl(criteria));
  //       criteria.questions?.forEach((item: Criteria) => {
  //         this.questions(idx).push(this.createItemControl(item));
  //         this.questions(idx).disable();
  //       });
  //     });
  //   }
  // }

  //  criteria
  criteria(): FormArray {
    return this.form.get('criteria') as FormArray;
  }

  addItemCriteriaControl(): void {
    (this.form.get('criteria') as FormArray).push(
      this.createItemCriteriaControl(new Criteria())
    );
    this.checkCriteria = false;
    this.addItemControl(this.criteria()?.length - 1);
  }

  createItemCriteriaControl(data?: ICriteria): AbstractControl {
    if (!!data?.id) {
      return this.fb.group({
        name: [data ? data?.name : null],
        label: [data ? data?.label : null],
        id: [data ? data?.id : null],
        questions: this.fb.array([]),
        isCreate: [false],
      });
    } else {
      return this.fb.group({
        name: [''],
        label: [''],
        id: [null],
        questions: this.fb.array([]),
        isCreate: [false],
      });
    }
  }

  removeItemCriteriaControl(index: number): void {
    // const criteria = (this.form.get('criteria') as FormArray).controls[index]?.value;
    // if (criteria && criteria?.id) {
    //     // this.questionId.push(questionId?.abnormalHandlingImproveId);
    // }
    (this.form.get('criteria') as FormArray).removeAt(index);
    this.checkCriteria = !(this.form.get('criteria') as FormArray).length;
  }

  //  Questions
  questions(idx: number): FormArray {
    return this.criteria()?.at(idx)?.get('questions') as FormArray;
  }

  addItemControl(index: number): void {
    (this.criteria()?.at(index)?.get('questions') as FormArray).push(
      this.createItemControl(new Question())
    );
    this.checkQuestions = false;
  }

  createItemControl(data?: IQuestion): AbstractControl {
    if (!!data?.content) {
      return this.fb.group({
        id: [data ? data?.id : null],
        content: [data ? data?.content : null, [Validators.required]],
        label: [data ? data?.label : null, [Validators.required]],
        group: [data ? data?.group : null],
        type: [data ? data?.type : 'RATING'], // Hiện tại chỉ có 1 type duy nhất là Rating nên k có nhập type và mặc định là RATING
        rangeAnswer: [data ? data?.rangeAnswer : 5], //  rangeAnswer mặc định là 5 với type Rating
      });
    } else {
      return this.fb.group({
        id: [null],
        content: [null, [Validators.required]],
        label: [null, [Validators.required]],
        group: [null],
        type: ['RATING'],
        rangeAnswer: [5],
      });
    }
  }

  removeItemControl(idxCriteria: number, index: number): void {
    // const question = (this.criteria().at(idxCriteria).get('questions') as FormArray).controls[index]?.value;
    // if (question && question?.id) {
    // }
    (this.criteria().at(idxCriteria).get('questions') as FormArray).removeAt(
      index
    );
    this.checkQuestions = !(
      this.criteria().at(idxCriteria).get('questions') as FormArray
    ).length;
  }

  getTitle(): string {
    if (this.isDetail) {
      this.form.get('note')?.disable();
      return this.getTranslate('detail');
    } else if (this.isUpdate) {
      return this.getTranslate('update');
    } else {
      return this.getTranslate('create');
    }
  }

  getQuestionInGroup(idx: number): string {
    let content = '';
    this.questions(idx).controls.forEach((item, i) => {
      content += `<p class="question m-0"><b class="p-3"><u class="pb-2">${this.getTranslate(
        'question.title'
      )}
                    ${i + 1}:</u></b> ${item.get('content')?.value || ''}</p>`;
    });
    return content;
  }

  disabledBeforeToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  disabledBeforeStartAt(current: Date): boolean {
    const date = document.getElementById('startPicker') as HTMLInputElement;

    return (
      differenceInCalendarDays(
        current,
        moment(date?.value, 'DD/MM/yyyy').toDate()
      ) < 0
    );
  }

  disabledDate = (value: Date) => {
    const form = this.form;
    // Can not select days before today and today
    return value < form.get('startDate')?.value;
  };

  enterDatePicker(event: any, nameDate: string): void {
    const date = event?.target?.value;
    if (nameDate === 'startAt') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        return;
      } else if (!this.disabledBeforeToday(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.startPicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.startPicker.close();
      }
    } else if (nameDate === 'endAt') {
      if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
        this.endPicker.close();
      } else if (!this.disabledBeforeStartAt(CommonUtil.newDate(date))) {
        this.form.controls[nameDate].setValue(CommonUtil.newDate(date));
        this.endPicker.close();
      } else {
        this.form.controls[nameDate].setValue(
          this.form.controls[nameDate].value
        );
        this.endPicker.close();
      }
    }
  }

  changeStartAt(): void {
    this.startAt = moment(
      this.form?.controls?.startAt?.value,
      'DD/MM/yyyy'
    )?.toDate();
    if (this.startAt?.toString() !== 'Invalid Date') {
      if (
        differenceInCalendarDays(
          this.form.controls.endAt?.value,
          this.form.controls.startAt?.value
        ) < 0
      ) {
        this.form.controls.endAt?.setValue(this.form.controls.startAt?.value);
      }
    }
  }

  valueChangesForm(): void {
    this.form?.controls.buildingIds?.valueChanges?.subscribe((value) => {
      let floorTmp = this.form.get('floorIds')?.value;
      let orgTmp = this.form.get('organizationIds')?.value as Array<string>;
      // this.form.get('floorIds')?.reset();
      // this.form.get('organizationIds')?.reset();
      if (value?.length === 1) {
        this.buildingService
          .searchFloorByBuilding(
            this.form?.get('buildingIds')?.value,
            { sortBy: 'name.asc' },
            true
          )
          .subscribe((response: any) => {
            this.floors = response?.body?.data;
            floorTmp = floorTmp?.filter((item: string) => {
              return response?.body?.data
                ?.map((floor: IFloor) => {
                  return floor?.id;
                })
                ?.includes(item);
            });
            this.form.get('floorIds')?.setValue(floorTmp);
          });
        // this.customerService.findCustomers({ids: value}, true).subscribe((res: any) => {
        //   this.organizations = res?.body?.data;
        //   orgTmp = orgTmp?.filter((item: string) => {
        //     return res?.body?.data?.map((org: ICustomer) => {
        //       return org?.id;
        //     })?.includes(item);
        //   });
        //   this.form.get('organizationIds')?.setValue(orgTmp);
        // });
      } else {
        this.form.controls?.floorIds?.setValue([]);
        this.customerService
          .findCustomers({ ids: value }, true)
          .subscribe((res: any) => {
            this.organizations = res?.body?.data;
            orgTmp = orgTmp?.filter((item: string) => {
              return res?.body?.data
                ?.map((org: ICustomer) => {
                  return org?.id;
                })
                ?.includes(item);
            });
            this.form.get('organizationIds')?.setValue(orgTmp);
          });
        this.floors = [];
      }
    });
    this.form?.controls.floorIds?.valueChanges?.subscribe((value) => {
      let orgTmp = this.form.get('organizationIds')?.value;
      // this.form.get('organizationIds')?.reset();
      if (value?.length > 0) {
        this.customerService
          .findFloors({ ids: value })
          .subscribe((res: any) => {
            this.organizations = res?.body?.data;
            orgTmp = orgTmp?.filter((item: string) => {
              return res?.body?.data
                ?.map((org: ICustomer) => {
                  return org?.id;
                })
                ?.includes(item);
            });
            this.form.get('organizationIds')?.setValue(orgTmp);
          });
      } else {
        orgTmp = this.form.get('organizationIds')?.value;
        const buildingIds = this.form?.controls.buildingIds.value;
        this.customerService
          .findCustomers({ ids: buildingIds }, true)
          .subscribe((res: any) => {
            this.organizations = res?.body?.data;
            orgTmp = orgTmp?.filter((item: string) => {
              return res?.body?.data
                ?.map((org: ICustomer) => {
                  return org?.id;
                })
                ?.includes(item);
            });
            this.form.get('organizationIds')?.setValue(orgTmp);
          });
      }
    });

    this.form?.controls.surveyTemplateId?.valueChanges.subscribe((value) => {
      if (!!value && !this.isCreateSurveyTemplate) {
        this.changeSurveyTemplate(value);
      } else {
        this.clearSurveyTemplate();
      }
    });

    this.form?.controls.startAt?.valueChanges.subscribe((value) => {
      if (!!value) {
        this.changeStartAt();
      }
    });
  }

  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    } else {
      if (controls === 'buildingIds') {
        formControl.setValue(this.mappingBuildings(value));
      } else if (controls === 'floorIds') {
        formControl.setValue(this.mappingFloors(value));
      } else if (controls === 'organizationIds') {
        formControl.setValue(this.mappingOrganizations(value));
      }
    }
  }

  mappingBuildings(buildings: IBuilding[]): any {
    return buildings.map((building: IBuilding) => building.id);
  }

  mappingFloors(floors: IFloor[]): any {
    return floors.map((floor: IFloor) => floor.id);
  }

  mappingOrganizations(customers: ICustomer[]): any {
    return customers.map((customer: ICustomer) => customer.id);
  }

  onChangeData(type: string, content: string): void {
    this.form.get(type)?.setValue(content);
  }

  getLimitLength(str: string, length: number = 20): string {
    return CommonUtil.getLimitLength(str, length);
  }
}
