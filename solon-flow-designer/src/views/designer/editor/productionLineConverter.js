/**
 * 生产线数据转换工具
 * 将后端生产线数据转换为工作流格式
 */

// 生成唯一ID的工具函数
function generateId(prefix = 'node') {
  return `${prefix}_${Math.random().toString(36).substr(2, 10)}`;
}

// 生成端口名称
function generatePortName(type = 'port', direction = 't', index = 1) {
  return `${type}_${direction}${index}`;
}

/**
 * 生产线数据转换器类
 */
class ProductionLineConverter {
  constructor(options = {}) {
    this.nodeSpacing = options.nodeSpacing || 440; // 节点间距
    this.levelSpacing = options.levelSpacing || 280; // 层级间距
    this.startX = options.startX || -240; // 起始X坐标
    this.startY = options.startY || -190; // 起始Y坐标
  }

  /**
   * 主转换函数 - 将生产线数据转换为工作流数据
   * @param {Object} productionLineData - 后端返回的生产线数据
   * @returns {Object} 工作流数据
   */
  convertProductionLineToWorkflow(productionLineData) {
    const {productionDepartmentList, name: lineName, id: lineId} = productionLineData;

    // 按sort字段排序
    const sortedDepartments = [...productionDepartmentList].sort((a, b) => a.sort - b.sort);

    const workflow = {
      id: generateId('chain'),
      layout: []
    };

    // 创建开始节点（生产线）
    const startNode = this.createStartNode(lineName, lineId);
    workflow.layout.push(startNode);

    // 创建包含网关（用于分发到各个工序）
    const gatewayNode = this.createInclusiveGateway(startNode.id);
    workflow.layout.push(gatewayNode);

    // 创建工序节点
    const departmentNodes = [];
    const parallelGateways = [];

    sortedDepartments.forEach((dept, index) => {
      // 创建工序活动节点
      const deptNode = this.createDepartmentNode(dept, index);
      departmentNodes.push(deptNode);

      // 为每个工序创建并行网关（除了最后一个）
      if (index < sortedDepartments.length - 1) {
        const parallelGateway = this.createParallelGateway(deptNode.id, index);
        parallelGateways.push(parallelGateway);

        // 连接工序节点到并行网关
        deptNode.link.push(this.createLink(deptNode.id, 'port_r1', parallelGateway.id, 'port_l1'));
      }
    });

    // 添加所有节点到布局
    workflow.layout.push(...departmentNodes);
    workflow.layout.push(...parallelGateways);

    // 创建结束节点
    const endNode = this.createEndNode(departmentNodes.length);
    workflow.layout.push(endNode);

    // 建立连接关系
    this.establishConnections(workflow.layout, sortedDepartments);

    return workflow;
  }

  // 创建开始节点
  createStartNode(lineName, lineId) {
    return {
      id: generateId('node'),
      type: 'activity',
      title: lineName || '生产线',
      task: '',
      when: '',
      meta: {originalId: lineId},
      v_x: this.startX,
      v_y: this.startY,
      link: []
    };
  }

  // 创建包含网关
  createInclusiveGateway(sourceId) {
    return {
      id: generateId('node'),
      type: 'inclusive',
      title: '包含网关',
      v_x: this.startX,
      v_y: this.startY + this.levelSpacing,
      link: []
    };
  }

  // 创建工序节点
  createDepartmentNode(department, index) {
    const baseX = -1060 + index * this.nodeSpacing;

    return {
      id: generateId('node'),
      type: 'activity',
      title: department.name,
      task: department.description || '',
      when: '',
      meta: {
        originalId: department.id,
        smartDeviceMode: department.smartDeviceMode,
        isAutoCreateSemiFinishedProduct: department.isAutoCreateSemiFinishedProduct,
        sort: department.sort
      },
      v_x: baseX,
      v_y: this.startY + this.levelSpacing * 2,
      link: []
    };
  }

  // 创建并行网关
  createParallelGateway(sourceId, index) {
    const baseX = -800 + index * this.nodeSpacing;

    return {
      id: generateId('node'),
      type: 'parallel',
      title: '并行网关',
      v_x: baseX,
      v_y: this.startY + this.levelSpacing * 2,
      link: []
    };
  }

  // 创建结束节点
  createEndNode(departmentCount, index) {
    const baseX = index * this.nodeSpacing;
    return {
      id: generateId('node'),
      type: 'end',
      title: '结束',
      v_x: baseX,
      v_y: this.startY + this.levelSpacing * 3,
      link: []
    };
  }

  // 创建连接
  createLink(sourceId, sourcePort, targetId, targetPort) {
    return {
      v_source: sourceId,
      v_sourcePort: sourcePort,
      v_target: targetId,
      v_targetPort: targetPort,
      nextId: targetId,
      id: generateId('edge')
    };
  }

  // 建立所有连接关系
  establishConnections(layout, departments) {
    const nodes = layout.reduce((acc, node) => {
      acc[node.type] = acc[node.type] || [];
      acc[node.type].push(node);
      return acc;
    }, {});

    // 连接开始节点到包含网关
    if (nodes.activity && nodes.inclusive) {
      const startNode = nodes.activity[0]; // 第一个activity是生产线节点
      const gateway = nodes.inclusive[0];

      startNode.link.push(this.createLink(startNode.id, 'port_b1', gateway.id, 'port_t1'));

      // 连接包含网关到所有工序节点
      const departmentNodes = nodes.activity.slice(1); // 除了第一个生产线节点
      departmentNodes.forEach((deptNode) => {
        gateway.link.push(this.createLink(gateway.id, 'port_b1', deptNode.id, 'port_t1'));
      });
    }

    // 连接工序节点到并行网关，再到下一个工序
    if (nodes.parallel && nodes.activity) {
      const departmentNodes = nodes.activity.slice(1); // 除了生产线节点
      const parallelGateways = nodes.parallel;

      parallelGateways.forEach((gateway, index) => {
        if (index < departmentNodes.length - 1) {
          // 连接并行网关到下一个工序节点
          gateway.link.push(this.createLink(gateway.id, 'port_r1', departmentNodes[index + 1].id, 'port_l1'));
        }
      });

      // 连接最后一个工序到结束节点
      if (departmentNodes.length > 0 && nodes.end) {
        const lastDeptNode = departmentNodes[departmentNodes.length - 1];
        const endNode = nodes.end[0];

        lastDeptNode.link.push(this.createLink(lastDeptNode.id, 'port_b1', endNode.id, 'port_t1'));
      }
    }
  }
}

/**
 * 导出转换方法
 * @param {Object} productionLineData - 后端返回的生产线数据
 * @param {Object} options - 配置选项
 * @returns {Object} 工作流数据
 */
export function convertProductionLineToWorkflow(productionLineData, options = {}) {
  const converter = new ProductionLineConverter(options);
  return converter.convertProductionLineToWorkflow(productionLineData);
}

/**
 * 导出转换器类，用于更高级的自定义
 */
export {ProductionLineConverter};

/**
 * 默认导出转换方法
 */
export default convertProductionLineToWorkflow;
