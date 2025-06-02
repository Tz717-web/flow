/**
 * 生产线数据导入工具
 * 将生产线数据转换为工作流并导入到画布
 */
import {convertProductionLineToWorkflow} from '../editor/productionLineConverter';
import {prepareGraphData} from '../nodeForm/canvas-import-helper';

/**
 * 导入生产线数据到画布
 * @param {Object} flowCanvasRef - 画布组件引用
 * @param {Object} productionLineData - 生产线数据
 * @param {String} layoutType - 布局类型 TB(从上到下) 或 LR(从左到右)
 * @returns {Promise} 导入结果
 */
export async function importProductionLineToCanvas(flowCanvasRef, productionLineData, layoutType = 'TB') {
  try {
    // 1. 检查数据有效性
    if (!productionLineData || !productionLineData.productionDepartmentList) {
      throw new Error('生产线数据格式不正确，缺少productionDepartmentList字段');
    }

    // 2. 转换为工作流数据
    const workflowData = convertProductionLineToWorkflow(productionLineData);

    // 3. 检查转换结果
    if (!workflowData || !workflowData.layout) {
      throw new Error('转换后的工作流数据格式不正确');
    }
    console.log(workflowData);
    // 4. 准备画布数据
    const graphData = prepareGraphData(workflowData, layoutType);

    // 5. 清空当前画布
    flowCanvasRef.clear(false);

    // 6. 设置链数据
    flowCanvasRef.setChain(workflowData);

    // 7. 导入数据到画布
    flowCanvasRef.setData(graphData);

    return {success: true, message: '生产线数据导入成功', workflowData, graphData};
  } catch (error) {
    console.error('导入生产线数据失败:', error);
    throw error;
  }
}
