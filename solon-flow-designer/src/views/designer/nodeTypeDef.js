const nodeTypeDef = {
  start: {
    type: 'start',
    title: '开始',
    color: '#10b981', // 更现代的绿色
    bgColor: '#ecfdf5', // 浅绿背景
    borderColor: '#6ee7b7',
    icon: 'fa-solid fa-play',
    shape: 'circle',
    connectionPoints: {input: 0, output: 1}
  },
  end: {
    type: 'end',
    title: '结束',
    color: '#ef4444', // 现代红色
    bgColor: '#fef2f2', // 浅红背景
    borderColor: '#fca5a5',
    icon: 'fa-solid fa-stop',
    shape: 'circle',
    connectionPoints: {input: 1, output: 0}
  },
  inclusive: {
    type: 'inclusive',
    title: '包含网关',
    color: '#f59e0b', // 现代橙色
    bgColor: '#fffbeb', // 浅橙背景
    borderColor: '#fcd34d',
    icon: 'fa-solid fa-genderless',
    shape: 'diamond',
    connectionPoints: {input: 1, output: 2, sides: 4}
  },
  exclusive: {
    type: 'exclusive',
    title: '排他网关',
    color: '#8b5cf6', // 现代紫色
    bgColor: '#f5f3ff', // 浅紫背景
    borderColor: '#c4b5fd',
    icon: 'fa-solid fa-xmark',
    shape: 'diamond',
    connectionPoints: {input: 1, output: 2, sides: 4}
  },
  parallel: {
    type: 'parallel',
    title: '并行网关',
    color: '#06b6d4', // 现代青色
    bgColor: '#ecfeff', // 浅青背景
    borderColor: '#67e8f9',
    icon: 'fa-solid fa-plus',
    shape: 'diamond',
    connectionPoints: {input: 1, output: 2, sides: 4}
  },
  activity: {
    type: 'activity',
    title: '活动节点',
    color: '#3b82f6', // 现代蓝色
    bgColor: '#eff6ff', // 浅蓝背景
    borderColor: '#93c5fd',
    icon: 'fa-solid fa-user',
    shape: 'rounded-rect',
    connectionPoints: {input: 1, output: 1}
  },
  activity2: {
    type: 'activity',
    title: '活动节点',
    color: '#3b82f6', // 现代蓝色
    bgColor: '#eff6ff', // 浅蓝背景
    borderColor: '#93c5fd',
    icon: 'fa-solid fa-user',
    shape: 'rounded-rect',
    connectionPoints: {input: 1, output: 1}
  },
  activity3: {
    type: 'activity',
    title: '活动节点',
    color: '#3b82f6', // 现代蓝色
    bgColor: '#eff6ff', // 浅蓝背景
    borderColor: '#93c5fd',
    icon: 'fa-solid fa-user',
    shape: 'rounded-rect',
    connectionPoints: {input: 1, output: 1}
  },
  activity4: {
    type: 'activity',
    title: '活动节点',
    color: '#3b82f6', // 现代蓝色
    bgColor: '#eff6ff', // 浅蓝背景
    borderColor: '#93c5fd',
    icon: 'fa-solid fa-user',
    shape: 'rounded-rect',
    connectionPoints: {input: 1, output: 1}
  }
};

const groupMap = [
  {title: '开关节点', value: 'switch', nodes: ['start', 'end']},
  {title: '网关节点', value: 'gateway', nodes: ['inclusive', 'exclusive', 'parallel']},
  {title: '活动节点', value: 'activity', nodes: ['activity', 'activity2', 'activity3', 'activity4']}
];

export {nodeTypeDef, groupMap};
