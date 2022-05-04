export const ROUTER_UTILS = {
  base: {
    home: '',
    dashboard: 'dashboard',
    freeRoute: '**',
  },
  authentication: {
    root: 'authentication',
    login: 'login',
  },
  ticket: {
    root: 'ticket',
    create: 'create',
    createByComplaint: 'create-by-complaint/:id',
    detail: ':ticketId/detail',
  },
  survey: {
    root: 'survey',
    list: 'list',
    result: 'result',
    detailResult: 'result/:surveyId/detail/:type',
    create: 'create',
    update: ':id/update',
    detail: ':id/detail',
  },
  building: {
    root: 'building',
    list: 'list',
    detail: ':id/detail',
    create: 'create',
    unit: 'unit',
    unitCreate: 'unit/create',
    unitUpdate: 'unit/:unitId/update',
    unitDetail: 'unit/:unitId/detail',
  },
  partnerContract: {
    root: 'partner-contract',
  },
  customer: {
    root: 'customer',
    create: 'create',
    update: ':customerId/update',
  },
  notification: {
    root: 'notification',
    create: 'create/:type',
    update: ':notificationId/update/:type',
    detail: ':notificationId/detail/:type',
  },
  setting: {
    root: 'setting',
    user: 'user',
    userCreate: 'user/create',
    userUpdate: 'user/:id/update',
    role: 'role',
    actionLog: 'action-log',
    actionLogDetail: 'action-log/:id/detail',
  },
  privacyPolicy: {
    root: 'privacy-policy',
  },
  report: {
    root: 'report',
  },
  feedback: {
    public: 'feedback-public',
  },
  home: {
    root: 'home',
  },
  complaint: {
    root: 'complaint',
    list: 'list',
    detail: ':id/complaint-detail',
    qrCreate: 'create-qr',
    qrUpdate: ':id/qr-update',
    qrList: 'qr-list',
    report: 'report',
  },
  error: {
    notFound: '404',
    permissionDenied: '403',
    systemError: '500',
  },
};
