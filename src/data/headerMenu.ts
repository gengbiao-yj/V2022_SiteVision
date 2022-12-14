// 智能推荐POIs
export const POIs: Array<POIItem> = [
  {
    name: 'traffic',
    title: '交通：',
    items: [
      {
        label: '公交',
        value: 'Bus'
      },
      {
        label: '地铁',
        value: 'Metro'
      },
      {
        label: '火车站',
        value: 'Railway'
      },
      {
        label: '汽车站',
        value: 'BusStation'
      },
      {
        label: '机场',
        value: 'Airport'
      },
      {
        label: '停车场',
        value: 'Parking'
      }
    ]
  },
  {
    name: 'mall',
    title: '商场：',
    items: [
      {
        label: '购物中心',
        value: 'ShoppingMall'
      },
      {
        label: '商场',
        value: 'Mall'
      },
      {
        label: '超市',
        value: 'Market'
      },
      {
        label: '便利店',
        value: 'Convenience'
      }
    ]
  },
  {
    name: 'education',
    title: '学校：',
    items: [
      {
        label: '学校',
        value: 'School'
      },
      {
        label: '培训机构',
        value: 'Training'
      }
    ]
  },
  {
    name: 'common',
    title: '公共：',
    items: [
      { label: '餐饮', value: 'Food' },
      { label: '住宿', value: 'Hotel' },
      { label: '景点', value: 'Tourism' },
      { label: '药店', value: 'Medical_Store' },
      { label: '医院', value: 'Medical_Store' },
      { label: '政府', value: 'Goverment' }
    ]
  }
];

// 评估报告
export const SmartReportType: Array<MenuItem> = [
  { label: '缓冲区', value: 'bufferArea' },
  { label: '等时圈', value: 'timeCircle' },
  { label: '自定义', value: 'userDefined' }
];

// 数据管理
export const DataTableType: Array<MenuItem> = [
  { label: 'tableType.pipeline', path: '/Main/DataList/Pipeline' },
  { label: 'tableType.store', path: '/Main/DataList/Store' },
  { label: 'tableType.competitor', path: '/Main/DataList/Competitor' },
  { label: 'tableType.businessCircle', path: '/Main/DataList/BusinessCircle' }
];
