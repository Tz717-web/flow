<template>
  <div 
    class="workflow-node" 
    :class="[
      `node-${nodeInfo.type}`,
      `node-shape-${nodeInfo.shape}`,
      { 'node-selected': isSelected }
    ]"
    :style="nodeStyles"
    @click="selectNode"
  >
    <!-- 节点主体 -->
    <div class="node-body">
      <!-- 图标区域 -->
      <div class="node-icon-wrapper">
        <div class="node-icon" :style="iconStyles">
          <font-awesome-icon :icon="nodeInfo.icon" />
        </div>
      </div>
      
      <!-- 标题区域 -->
      <div class="node-content">
        <div class="node-title">{{ nodeInfo.title }}</div>
        <div class="node-type-label">{{ nodeTypeDef[nodeInfo.type]?.title }}</div>
      </div>
      
      <!-- 状态指示器 -->
      <div class="node-status" v-if="nodeInfo.status">
        <div class="status-dot" :class="`status-${nodeInfo.status}`"></div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="node-toolbar">
      <div class="toolbar-group">
        <button 
          class="node-tool edit-tool" 
          @click.stop="editNode"
          title="编辑节点"
        >
          <font-awesome-icon icon="fa-solid fa-pen" />
        </button>
       
        <button 
          class="node-tool delete-tool" 
          @click.stop="deleteNode"
          title="删除节点"
        >
          <font-awesome-icon icon="fa-solid fa-trash" />
        </button>
      </div>
    </div>

    <!-- 节点边框装饰 -->
    <div class="node-border-decoration"></div>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed, ref } from 'vue';
import { groupMap,nodeTypeDef } from '../nodeTypeDef.js';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  graph: {
    type: Object,
    required: true
  }
});

const isSelected = ref(false);

const nodeInfo = reactive({
  id: null,
  type: null,
  title: null,
  color: "#3b82f6",
  bgColor: "#eff6ff",
  borderColor: "#93c5fd",
  icon: "fa-solid fa-play",
  shape: "rounded-rect",
  status: null
});

// 判断是否为网关节点
const isGatewayNode = computed(() => {
  return ['inclusive', 'exclusive', 'parallel'].includes(nodeInfo.type);
});

// 计算节点样式
const nodeStyles = computed(() => {
  const typeDef = nodeTypeDef[nodeInfo.type];
  return {
    '--node-primary-color': typeDef?.color || nodeInfo.color,
    '--node-bg-color': typeDef?.bgColor || nodeInfo.bgColor,
    '--node-border-color': typeDef?.borderColor || nodeInfo.borderColor,
  };
});

// 计算图标样式
const iconStyles = computed(() => {
  const typeDef = nodeTypeDef[nodeInfo.type];
  return {
    backgroundColor: typeDef?.color || nodeInfo.color,
    boxShadow: `0 4px 12px ${typeDef?.color || nodeInfo.color}40`
  };
});

onMounted(() => {
  const nodeData = props.node.getData();
  const nodeType = nodeTypeDef[nodeData.type];
  
  // 处理节点标题
  if (!nodeData.title && nodeData.id) {
    if (!nodeData.id.startsWith('node_')) {
      nodeData.title = nodeData.id;
    }
  }

  if (!nodeData.title) {
    if (nodeData.task) {
      if (nodeData.task.startsWith('#') || nodeData.task.startsWith('@') || nodeData.task.startsWith('$')) {
        nodeData.title = nodeData.task;
      } else {
        nodeData.title = '脚本代码';
      }
    } else {
      nodeData.title = nodeType?.title || '未命名节点';
    }

    props.node.setData({
      title: nodeData.title
    });
  }

  // 更新节点信息
  Object.assign(nodeInfo, nodeData, {
    color: nodeType?.color || "#3b82f6",
    bgColor: nodeType?.bgColor || "#eff6ff",
    borderColor: nodeType?.borderColor || "#93c5fd",
    icon: nodeType?.icon || "fa-solid fa-play",
    shape: nodeType?.shape || "rounded-rect",
    title: nodeData.title
  });

  // 监听数据变化
  props.node.on("node:data:changed", () => {
    const nodeData = props.node.getData();
    nodeInfo.title = nodeData.title;
  });

  // 监听选择状态
  props.node.on("node:selected", () => {
    isSelected.value = true;
  });

  props.node.on("node:unselected", () => {
    isSelected.value = false;
  });
});

function selectNode() {
  props.graph.emit("node:selected", props.node);
}

function deleteNode() {
  if (!confirm("确认删除该节点吗？")) return;
  props.graph.emit("node:toDel", props.node);
}

function editNode() {
  props.graph.emit("node:toEdit", props.node);
}

function copyNode() {
  props.graph.emit("node:toCopy", props.node);
}
</script>

<style lang="less" scoped>
foreignObject{
 height: 100px !important;
}
body{
  height: 100px !important;
}
.workflow-node {
  position: relative;
  min-width: 160px;
  min-height: 80px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  // 基础样式变量
  --node-primary-color: #3b82f6;
  --node-bg-color: #eff6ff;
  --node-border-color: #93c5fd;
  --node-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --node-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --node-shadow-selected: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--node-shadow-hover);
    
    .node-toolbar {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }

  &.node-selected {
    transform: translateY(-3px);
    box-shadow: var(--node-shadow-selected);
    
    .node-border-decoration {
      opacity: 1;
    }
  }
}

.node-body {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--node-bg-color);
  border: 2px solid var(--node-border-color);
  border-radius: 12px;
  box-shadow: var(--node-shadow);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  .workflow-node.node-shape-circle & {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    padding: 12px;
    justify-content: center;
    flex-direction: column;
  }

  .workflow-node.node-shape-diamond & {
    border-radius: 8px;
    transform: rotate(45deg);
    width: 80px;
    height: 80px;
    padding: 8px;
    
    .node-icon-wrapper,
    .node-content {
      transform: rotate(-45deg);
    }
    
    .node-content {
      text-align: center;
    }
    
    .node-title {
      font-size: 12px;
      line-height: 1.2;
    }
    
    .node-type-label {
      font-size: 9px;
    }
  }
}

.node-icon-wrapper {
  flex-shrink: 0;
  margin-right: 12px;

  .workflow-node.node-shape-circle & {
    margin-right: 0;
    margin-bottom: 8px;
  }
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;

  .workflow-node.node-shape-circle & {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
}

.node-content {
  flex: 1;
  min-width: 0;

  .workflow-node.node-shape-circle & {
    text-align: center;
  }
}

.node-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
  line-height: 1.4;
  word-break: break-word;
}

.node-type-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.node-status {
  position: absolute;
  top: 8px;
  right: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  
  &.status-running {
    background: #10b981;
    animation: pulse 2s infinite;
  }
  
  &.status-error {
    background: #ef4444;
  }
  
  &.status-warning {
    background: #f59e0b;
  }
}


.node-toolbar {
  position: absolute;
  top: -45px;
  right: 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.toolbar-group {
  display: flex;
  gap: 6px;
  padding: 6px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.node-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.edit-tool {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.copy-tool {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.delete-tool {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
}

.node-border-decoration {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid var(--node-primary-color);
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  
  .workflow-node.node-shape-circle & {
    border-radius: 50%;
  }
  
  .workflow-node.node-shape-diamond & {
    border-radius: 10px;
    transform: rotate(45deg);
  }
}

// 动画
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 不同节点类型的特殊样式
.node-start {
  .node-body {
    left: 20px;
    top: 10px;
    background: linear-gradient(135deg, #f8f4f4 0%, #d1fae5 100%);
  }
}

.node-end {
  .node-body {
    left: 20px;
    top: 10px;
    background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  }
}

.node-activity {
  .node-body {
    background: linear-gradient(135deg, #eff6ff 0%, #6196dc 100%);
  }
}

.node-inclusive,
.node-exclusive,
.node-parallel {
  .node-body {
    left: 20px;
    top: 10px;
    background: linear-gradient(135deg, var(--node-bg-color) 0%, rgba(255, 255, 255, 0.8) 100%);
  }
}

// 为网关节点添加连接点指示器
.workflow-node.node-shape-diamond {
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border: 1px dashed var(--node-border-color);
    border-radius: 8px;
    transform: translate(-50%, -50%) rotate(45deg);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
  }
  
  &:hover::before {
    opacity: 0.3;
  }
}

// 连接点的响应式调整
@media (max-width: 768px) {
  .workflow-node {
    min-width: 140px;
    min-height: 70px;
  }
  
  .node-body {
    padding: 12px;
  }
  
  .node-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .node-title {
    font-size: 13px;
  }
  
  .node-type-label {
    font-size: 10px;
  }

  .connection-points {
    .connection-point {
      width: 10px;
      height: 10px;
    }
    
    // 移动端菱形连接点距离调整
    .workflow-node.node-shape-diamond {
      .connection-input.input-diamond {
        transform: translate(-50%, -50%) rotate(-45deg) translateX(-40px) rotate(45deg);
      }
      
      .connection-output.output-diamond {
        transform: translate(50%, -50%) rotate(-45deg) translateX(40px) rotate(45deg);
      }
      
      .connection-top.top-diamond {
        transform: translate(-50%, -50%) rotate(-45deg) translateY(-40px) rotate(45deg);
      }
      
      .connection-bottom.bottom-diamond {
        transform: translate(-50%, 50%) rotate(-45deg) translateY(40px) rotate(45deg);
      }
    }
  }
}
</style>
