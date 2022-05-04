export const COMPLAINT_STATUS = {
  ACTIVE: {
    label: 'model.complaint.complaint-list.active',
    value: 'ACTIVE',
  },
  INACTIVE: {
    label: 'model.complaint.complaint-list.inactive',
    value: 'INACTIVE',
  },
  RECEIVED: {
    label: 'model.complaint.complaint-list.received',
    value: 'RECEIVED'
  },
  OPEN: {
    label: 'model.complaint.complaint-list.waiting',
    value: 'OPEN'
  },
  IN_PROGRESS: {
    label: 'model.complaint.complaint-list.processing',
    value: 'IN_PROGRESS'
  },
  CLOSED: {
    label: 'model.complaint.complaint-list.done',
    value: 'CLOSED'
  }

};

export const COMPLAINT_STATUS_ARR = [
  {
    label: 'model.complaint.complaint-list.waiting',
    value: 'OPEN'
  },
  {
    label: 'model.complaint.complaint-list.processing',
    value: 'IN_PROGRESS'
  },
  {
    label: 'model.complaint.complaint-list.done',
    value: 'CLOSED'
  }

];


export const COMPLAINT_TYPE = {
  SERVICE_QUALITY: {
    label: 'model.complaint.complaint-type.quality-complaint',
    value: 'SERVICE_QUALITY',
  },
  UNDEFINED: {
    label: 'model.complaint.complaint-type.undefine',
    value: 'UNDEFINED',
  },
  SPAM: {
    label: 'model.complaint.complaint-type.spam',
    value: 'SPAM',
  },
  MIS_CLASSIFICATION: {
    label: 'model.complaint.complaint-type.mis-classification',
    value: 'MIS_CLASSIFICATION',
  },
};

export const COMPLAINT_RATING = {
  SATIFIED: {
    label: 'model.complaint.rating-type.satified',
    value: true,
  },
  UNSATIFIED: {
    label: 'model.complaint.rating-type.unsatified',
    value: false,
  },
};


export const COMPLAINT_TYPE_ARR = [
  {
    label: 'model.complaint.complaint-type.quality-complaint',
    value: 'SERVICE_QUALITY',
  },
  {
    label: 'model.complaint.complaint-type.undefine',
    value: 'UNDEFINED',
  },
  {
    label: 'model.complaint.complaint-type.spam',
    value: 'SPAM',
  },
  {
    label: 'model.complaint.complaint-type.mis-classification',
    value: 'MIS_CLASSIFICATION',
  },

];

export const COMPLAINT_RATING_ARR = [
  {
    label: 'model.complaint.rating-type.satified',
    value: 'true',
  },
  {
    label: 'model.complaint.rating-type.unsatified',
    value: 'false',
  },
]

export const QR_STATUS = {
  ACTIVE: {
    label: 'model.qr-manager.qr-create.active',
    value: 'ACTIVE',
  },
  INACTIVE: {
    label: 'model.qr-manager.qr-create.inactive',
    value: 'INACTIVE',
  }
};
export const QR_STATUS_LIST = [
  {
    label: 'model.qr-manager.qr-create.active',
    value: 'ACTIVE',
  },
  {
    label: 'model.qr-manager.qr-create.inactive',
    value: 'INACTIVE',
  }
];

export const TEMPLATE_CHANGE_ACTION = [
  {
    label: 'model.qr-manager.histories.active',
    value: 'ACTIVE',
  },
  {
    label: 'model.qr-manager.histories.inactive',
    value: 'INACTIVE',
  },
  {
    label: 'model.qr-manager.histories.updated',
    value: 'UPDATE',
  }
];

export const COMPLAINT_REPORT_CHART = {
  title: {
    text: 'Báo cáo phần trăm hệ thống',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontStyle: 'normal',
      fontFamily: 'arial',
      color: '#000000',
      lineHeight: 20,
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'left',
  //   data: ['Chờ xử lý', 'Đang xử lý', 'chưa phân loại']
  // },
  series: [
    {
      name: 'Báo cáo góp ý',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        {value: 335, name: 'Chờ xử lý'},
        {value: 310, name: 'Đang xử lý'},
        {value: 234, name: 'chưa phân loại'},
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: false,
        length: 10,
        length2: 20,
        lineStyle: {
          color: '#000'
        }
      },
      selectedMode: 'multiple',
      avoidLabelOverlap: false,
      startAngle: 113,
      cursor: 'pointer',
      bottom: '30%',
      height: '100%',
      label: {
        color: 'rgb(9,8,8)',
        // show: false,
        // position: 'outside',
        normal: {
          show: true,

          color: 'rgb(9,8,8)',
          position: 'inner',
          // formatter: '{b} : {c} ({d}%)',
          formatter: (params: any) => {
            if (params.percent < 1) {
              return '';
            }
            // return params.name + ' : ' + params.value + ' (' + params.percent + '%)';
            return params.percent.toFixed(1) + '%';
          },
          padding: [0, 0, 0, 0],
          textStyle: {
            fontSize: '13',
            fontStyle: 'normal',
            fontFamily: 'roboto',
          }
        }
      },
      color: ['#EC1A3B', '#0054A5', '#D0DEEA'],
    }
  ]
};

