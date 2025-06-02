/**
 * 画布导入辅助工具
 * 将工作流数据转换为AntV X6可用的格式
 */

/**
 * 将工作流数据转换为画布可用的格式
 * @param {Object} workflowData - 工作流数据
 * @param {String} dirType - 布局方向 TB(从上到下) 或 LR(从左到右)
 * @returns {Object} 画布数据
 */
export function prepareGraphData(workflowData, dirType = 'TB') {
  if (!workflowData || !workflowData.layout || !Array.isArray(workflowData.layout)) {
    throw new Error('工作流数据格式不正确');
  }

  const portPosDef = dirType === 'LR' ? ['port_r1', 'port_l1'] : ['port_b1', 'port_t1'];
  const graphData = {cells: []};

  // 处理节点
  workflowData.layout.forEach((node) => {
    // 创建节点数据
    const nodeData = {
      id: node.id,
      shape: node.type,
      data: {
        id: node.id,
        type: node.type,
        title: node.title,
        task: node.task,
        when: node.when,
        meta: node.meta
      },
      position: {
        x: node.v_x || 0,
        y: node.v_y || 0
      }
    };

    graphData.cells.push(nodeData);

    // 处理连接
    if (node.link && Array.isArray(node.link)) {
      node.link.forEach((link) => {
        const edgeData = {
          id: link.id,
          shape: 'flow-edge',
          source: {cell: link.v_source, port: link.v_sourcePort},
          target: {cell: link.v_target, port: link.v_targetPort},
          data: {
            id: link.id,
            nextId: link.v_target,
            title: link.title,
            condition: link.condition
          }
        };

        if (link.title) {
          edgeData.labels = [link.title];
        } else if (link.condition) {
          edgeData.labels = [link.condition];
        }

        graphData.cells.push(edgeData);
      });
    }
  });

  return graphData;
}

/**
 * 导入工作流数据到画布
 * @param {Object} graph - AntV X6 Graph实例
 * @param {Object} workflowData - 工作流数据
 * @param {String} dirType - 布局方向
 * @param {Boolean} autoLayout - 是否自动布局
 */
export function importWorkflowToGraph(graph, workflowData, dirType = 'TB', autoLayout = true) {
  if (!graph || !workflowData) {
    throw new Error('参数不能为空');
  }

  // 清空画布
  graph.clearCells();

  // 准备数据
  const graphData = prepareGraphData(workflowData, dirType);

  // 导入数据
  graph.fromJSON(graphData);

  // 自动布局
  if (autoLayout) {
    // 假设graph对象有autoLayout方法
    if (typeof graph.autoLayout === 'function') {
      graph.autoLayout(dirType);
    }
  }

  return graphData;
}
