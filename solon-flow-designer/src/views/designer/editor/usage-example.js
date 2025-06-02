/**
 * 使用示例
 */
import {convertProductionLineToWorkflow} from './productionLineConverter';

// 示例1: 基本使用
export function convertProductionLine(productionLineData) {
  try {
    // 直接调用转换方法
    const workflowData = convertProductionLineToWorkflow(productionLineData);
    return workflowData;
  } catch (error) {
    console.error('转换失败:', error);
    return null;
  }
}

// 示例2: 自定义配置
export function convertWithCustomOptions(productionLineData) {
  // 自定义节点间距和层级间距
  const options = {
    nodeSpacing: 300, // 更大的节点间距
    levelSpacing: 200, // 更大的层级间距
    startX: -300, // 自定义起始X坐标
    startY: -200 // 自定义起始Y坐标
  };

  return convertProductionLineToWorkflow(productionLineData, options);
}

// 示例3: 异步使用
export async function fetchAndConvert(productionLineId) {
  try {
    // 假设有一个API来获取生产线数据
    const response = await fetch(`/api/production-lines/${productionLineId}`);
    const productionLineData = await response.json();

    // 转换数据
    return convertProductionLineToWorkflow(productionLineData);
  } catch (error) {
    console.error('获取或转换数据失败:', error);
    return null;
  }
}
