import { environment } from '@env/environment';
import { SERVICE } from './gateway-routes-api.constant';

export const LANGUAGES_CONST = {
  VI: {
    label: 'common.vi',
    code: 'vi',
    icon: 'assets/img/icon/vietnam.png',
  },
  EN: {
    label: 'common.en',
    code: 'en',
    icon: 'assets/img/icon/english.png',
  },
};

export const API_IAM = environment.gateway + SERVICE.IAM;
export const API_BUILDING = environment.gateway + SERVICE.BUILDING;
export const API_STORAGE = environment.gateway + SERVICE.STORAGE;
export const API_SYSTEM = environment.gateway + SERVICE.SYSTEM;
export const API_NOTIFICATION = environment.gateway + SERVICE.NOTIFICATION;
export const API_TICKET = environment.gateway + SERVICE.TICKET;
export const API_SURVEY = environment.gateway + SERVICE.SURVEY;

export const PUBLIC_PATH = 'public';
