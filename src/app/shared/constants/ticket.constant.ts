export const RECEIVED = 'RECEIVED';
export const CLOSED = 'CLOSED';
export const OPEN = 'OPEN';
export const IN_PROGRESS = 'IN_PROGRESS';
export const DRAFT = 'DRAFT';
export const CANCELLED = 'CANCELLED';
export const OVER_DUE = 'OVER_DUE';
export const STATUS_RECEIVED_TITLE = 'model.ticket.receivedStatus';
export const STATUS_OPEN_TITLE = 'model.ticket.waitingStatus';
export const STATUS_IN_PROGRESS_TITLE = 'model.ticket.processingStatus';
export const STATUS_CLOSED_TITLE = 'model.ticket.doneStatus';
export const STATUS_DRAFT_TITLE = 'model.ticket.draftStatus';
export const STATUS_CANCELLED_TITLE = 'model.ticket.cancelledStatus';
export const STATUS_OVER_DUE_TITLE = 'model.ticket.overDueStatus';
export const TECHNICAL = 'TECHNICAL';
export const SERVICE = 'SERVICE';
export const TECHNICAL_TITLE = 'model.ticket.service.technicalManagement';
export const SERVICE_TITLE = 'model.ticket.service.serviceManagement';
export const SATISFIED = 'SATISFIED';

export const TICKET_STATUS = [
  { value: OPEN, label: STATUS_OPEN_TITLE},
  { value: RECEIVED, label: STATUS_RECEIVED_TITLE},
  { value: IN_PROGRESS, label: STATUS_IN_PROGRESS_TITLE},
  { value: CLOSED, label: STATUS_CLOSED_TITLE},
];

export const TICKET_STATUS_ALL = {
  RECEIVED,
  CLOSED,
  OPEN,
  IN_PROGRESS,
  STATUS_RECEIVED_TITLE,
  STATUS_OPEN_TITLE,
  STATUS_IN_PROGRESS_TITLE,
  STATUS_CLOSED_TITLE,
};

export const TICKET_SERVICE = [
  { value: 'TECHNICAL', label: 'model.ticket.service.technicalManagement' }, // Dịch vụ kĩ thuật tòa nhà
  { value: 'SERVICE', label: 'model.ticket.service.serviceManagement' }, // Dịch vụ tòa nhà
];

export const TICKET_REQUEST = [
  { value: 'NB', label: 'model.ticket.nb'},
  {value: 'YC', label: 'model.ticket.yc'}
];

export const TICKET_SERVICE_TITLE = {
  TECHNICAL,
  SERVICE,
  TECHNICAL_TITLE,
  SERVICE_TITLE
};

export const TICKET_SEARCH_OPTION = [
  {value: 1, label: 'model.ticket.search.searchByTicketCode'},
  {value: 2, label: 'model.ticket.search.searchByBuildingCode'},
  {value: 3, label: 'model.ticket.search.searchByService'},
];


export const chartOption = {
  height: '130%',
  title: {
    text: 'Báo cáo phần trăm hệ thống',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontStyle: 'normal',
      fontFamily: 'roboto',
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'right',
  //   data: ['Yêu cầu xử lý', 'Yêu cầu đang xử lý', 'yêu cầu tiếp nhận', 'yêu cầu đã xử lý'],
  //   textStyle: {
  //     color: '#000000',
  //     fontSize: 14,
  //     fontStyle: 'normal',
  //     fontFamily: 'roboto',
  //   }
  // },
  series: [
    {
      top: '10%',
      name: 'Thống kê yêu cầu',
      type: 'pie',
      radius: '55%',
      center: ['50%', '40%'],
      // emphasis: {
      //   label: {
      //     show: true,
      //     color: 'rgba(0, 0, 0, 1)',
      //     formatter: '{b} : {c} ({d}%)',
      //     textStyle: {
      //       color: '#000',
      //       fontSize: 14
      //     },
      //     position: 'outside'
      //   }
      // },
      label: {
        show: true,
        color: 'rgba(0, 0, 0, 1)',
        // formatter: '{b} : {c} ({d}%)',
        formatter: (params: any) => {
          if (params.percent < 1) {
            return '';
          }
          // return params.name + ' : ' + params.value + ' (' + params.percent + '%)';
          return  params.percent + '%';
        },
        textStyle: {
          color: '#000',
          // fontSize: 14
        },
        position: 'inside'
      },
      labelLine: {
        show: false,
        length: 10,
        length2: 20,
        lineStyle: {
          color: '#000'
        }
      },
      data: [
        {value: 335, name: 'Yêu cầu xử lý'},
        {value: 310, name: 'Yêu cầu đang xử lý'},
        {value: 234, name: 'yêu cầu tiếp nhận'},
        {value: 135, name: 'yêu cầu đã xử lý'},
      ],
      color: ['#9FC4EF', '#177DDF', '#0054A5', '#EC1A3B', '#D0DEEA'],
    }
  ]
};
