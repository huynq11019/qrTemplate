import { ROUTER_UTILS } from '@shared/utils/router.utils';

export const SidebarConstant = [
  {
    path: `${ROUTER_UTILS.base.dashboard}`,
    title: 'sidebar.dashboard',
    icon: 'appstore',
    root: true,
    authorities: [],
  },
  {
    title: 'sidebar.building',
    icon: 'home',
    root: false,
    authorities: ['building:view', 'unit:view'],
    submenu: [
      {
        path: `/${ROUTER_UTILS.building.root}/${ROUTER_UTILS.building.list}`, //  ROUTER_UTILS.building.list = LIST
        title: 'sidebar.building',
        authorities: ['building:view'],
      },
      {
        path: `${ROUTER_UTILS.building.root}/${ROUTER_UTILS.building.unit}`,
        title: 'sidebar.unit',
        authorities: ['unit:view'],
      },
    ]
  },
  {
    path: `${ROUTER_UTILS.customer.root}`,
    title: 'sidebar.customer',
    icon: 'team',
    root: true,
    authorities: ['organization:view'],
  },
  {
    title: 'sidebar.survey',
    icon: 'form',
    root: false,
    authorities: ['survey:view', 'survey:report'],
    submenu: [
      {
        // path: '/survey/list',
        path: `${ROUTER_UTILS.survey.root}/${ROUTER_UTILS.survey.list}`,
        title: 'sidebar.survey-list',
        authorities: ['survey:view'],
      },
      {
        // path: '/survey/result',
        path: `${ROUTER_UTILS.survey.root}/${ROUTER_UTILS.survey.result}`,
        title: 'sidebar.survey-result',
        authorities: ['survey:report'],
      },
    ]
  },
  {
    title: 'sidebar.ticket',
    icon: 'tags',
    root: false,
    authorities: ['ticket:view', 'ticket:report'],
    submenu: [
      {
        // path: '/ticket',
        path: `${ROUTER_UTILS.ticket.root}`,
        title: 'sidebar.ticket-list',
        authorities: ['ticket:view'],
      },
      {
        path: `${ROUTER_UTILS.report.root}`,
        title: 'sidebar.ticket-report',
        authorities: ['ticket:report'],
      }
    ]
  },
  {
    title: 'sidebar.complaint',
    icon: 'audit',
    root: false,
    authorities: ['complaint:view', 'complaint_template:view'],
    submenu: [
      {
        path: `${ROUTER_UTILS.complaint.root}/${ROUTER_UTILS.complaint.qrList}`,
        title: 'sidebar.qr-code',
        authorities: ['complaint_template:view'],
      },
      {
        path: `${ROUTER_UTILS.complaint.root}/${ROUTER_UTILS.complaint.list}`,
        title: 'sidebar.complaint',
        authorities: ['complaint:view']
      },
      {
        path: `${ROUTER_UTILS.complaint.root}/${ROUTER_UTILS.complaint.report}`,
        title: 'sidebar.complaint-report',
        authorities: ['complaint:report']
      },
    ]
  },
  {
    path: '/notification',
    title: 'sidebar.notification',
    icon: 'bell',
    root: true,
    authorities: ['notification:view'],
  },
  {
    title: 'sidebar.settings',
    icon: 'setting',
    root: false,
    authorities: ['user:view', 'role:view'],
    submenu: [
      {
        // path: '/setting/user',
        path: `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.user}`,
        title: 'sidebar.user',
        authorities: ['user:view'],
      },
      {
        // path: '/setting/role',
        path: `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.role}`,
        title: 'sidebar.role',
        authorities: ['role:view'],
      },
      // {
      //   // path: '/setting/action-log',
      //   path: `${ROUTER_UTILS.setting.root}/${ROUTER_UTILS.setting.actionLog}`,
      //   title: 'sidebar.action-log',
      //   authorities: ['action_log:view'],
      // }
    ]
  }
];
