<template>
  <div class="converter-container">
    <h2>生产线数据转换器</h2>
    
    <div class="converter-form">
      <div class="form-group">
        <label>输入数据 (后端格式)</label>
        <button @click="loadSampleData" class="btn-sample">加载示例</button>
        <textarea 
          v-model="inputData" 
          placeholder="请粘贴后端数据..." 
          class="input-textarea"
        ></textarea>
      </div>
      
      <div class="converter-actions">
        <button @click="convertData" :disabled="isConverting" class="btn-convert">
          <span v-if="isConverting">转换中...</span>
          <span v-else>转换</span>
        </button>
      </div>
      
      <div class="form-group">
        <label>输出数据 (工作流格式)</label>
        <button @click="downloadWorkflow" :disabled="!outputData" class="btn-download">下载</button>
        <textarea 
          v-model="outputData" 
          placeholder="转换结果将显示在这里..." 
          class="output-textarea" 
          readonly
        ></textarea>
      </div>
    </div>
    
    <div v-if="nodeStats" class="stats-container">
      <h3>转换统计</h3>
      <div class="stats-badges">
        <span 
          v-for="(count, type) in nodeStats" 
          :key="type" 
          class="stats-badge"
        >
          {{ type }}: {{ count }}个节点
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { convertProductionLineToWorkflow } from './productionLineConverter';

export default {
  name: 'ProductionLineConverterDemo',
  data() {
    return {
      inputData: '',
      outputData: '',
      isConverting: false,
      sampleData: {
        productionDepartmentList: [
          {
            tempKey: null,
            id: 653379136036933,
            name: "分纸",
            productionLineId: 14634686270405,
            description: "32",
            isAutoCreateSemiFinishedProduct: true,
            smartDeviceMode: "Task",
            sort: 1,
            isChecked: false,
            createTime: "2025-03-11 16:26:33",
            updateTime: "2025-04-07 17:55:34",
            productionProcessIdList: null
          },
          {
            tempKey: null,
            id: 653377138307141,
            name: "卷筒",
            productionLineId: 14634686270405,
            description: "333",
            isAutoCreateSemiFinishedProduct: true,
            smartDeviceMode: "Task",
            sort: 2,
            isChecked: false,
            createTime: "2025-03-11 16:18:25",
            updateTime: "2025-04-07 17:55:34",
            productionProcessIdList: null
          },
          {
            tempKey: null,
            id: 14632901935941,
            name: "外筒车间",
            productionLineId: 14634686270405,
            description: "外筒车间",
            isAutoCreateSemiFinishedProduct: true,
            smartDeviceMode: "Report",
            sort: 3,
            isChecked: false,
            createTime: "2023-10-05 13:45:48",
            updateTime: "2025-04-07 17:55:34",
            productionProcessIdList: null
          },
          {
            tempKey: null,
            id: 14632911293509,
            name: "内筒车间",
            productionLineId: 14634686270405,
            description: "内筒车间",
            isAutoCreateSemiFinishedProduct: true,
            smartDeviceMode: "Report",
            sort: 4,
            isChecked: false,
            createTime: "2023-10-05 13:47:01",
            updateTime: "2025-04-07 17:55:34",
            productionProcessIdList: null
          },
          {
            tempKey: null,
            id: 631046108131397,
            name: "进效果车间",
            productionLineId: 14634686270405,
            description: "进效果车间",
            isAutoCreateSemiFinishedProduct: true,
            smartDeviceMode: "Report",
            sort: 5,
            isChecked: false,
            createTime: "2025-01-07 13:53:13",
            updateTime: "2025-04-07 17:55:34",
            productionProcessIdList: null
          },
          {
            tempKey: null,
            id: 645256609927237,
            name: "亮珠车间",
            productionLineId: 14634686270405,
            description: "亮珠车间",
            isAutoCreateSemiFinishedProduct: true,
            smartDeviceMode: "Report",
            sort: 6,
            isChecked: false,
            createTime: "2025-02-16 17:35:54",
            updateTime: "2025-04-07 17:55:34",
            productionProcessIdList: null
          },
          {
            tempKey: null,
            id: 14632911299141,
            name: "组装车间",
            productionLineId: 14634686270405,
            description: "组装车间",
            isAutoCreateSemiFinishedProduct: true,
            smartDeviceMode: "Task",
            sort: 7,
            isChecked: false,
            createTime: "2023-10-05 13:47:01",
            updateTime: "2025-04-07 17:55:34",
            productionProcessIdList: null
          },
          {
            tempKey: null,
            id: 626032201506885,
            name: "包装车间",
            productionLineId: 14634686270405,
            description: "包装车间",
            isAutoCreateSemiFinishedProduct: true,
            smartDeviceMode: "Report",
            sort: 8,
            isChecked: false,
            createTime: "2024-12-24 09:51:35",
            updateTime: "2025-04-07 17:55:34",
            productionProcessIdList: null
          }
        ],
        id: 14634686270405,
        code: null,
        name: "地礼线生产线",
        state: 1,
        description: "",
        createTime: "2023-10-05 17:38:08"
      }
    };
  },
  computed: {
    nodeStats() {
      if (!this.outputData) return null;
      
      try {
        const workflow = JSON.parse(this.outputData);
        const nodeTypes = workflow.layout.reduce((acc, node) => {
          acc[node.type] = (acc[node.type] || 0) + 1;
          return acc;
        }, {});
        
        return nodeTypes;
      } catch {
        return null;
      }
    }
  },
  methods: {
    loadSampleData() {
      this.inputData = JSON.stringify(this.sampleData, null, 2);
    },
    
    convertData() {
      if (!this.inputData.trim()) {
        this.$message ? this.$message.error('请输入要转换的数据') : alert('请输入要转换的数据');
        return;
      }
      
      this.isConverting = true;
      
      try {
        const data = JSON.parse(this.inputData);
        const workflow = convertProductionLineToWorkflow(data);
        
        this.outputData = JSON.stringify(workflow, null, 2);
      } catch (error) {
        this.$message ? this.$message.error('数据格式错误: ' + error.message) : alert('数据格式错误: ' + error.message);
      } finally {
        this.isConverting = false;
      }
    },
    
    downloadWorkflow() {
      if (!this.outputData) {
        this.$message ? this.$message.error('请先转换数据') : alert('请先转换数据');
        return;
      }
      
      const blob = new Blob([this.outputData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workflow.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
};
</script>

<style scoped>
.converter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.converter-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .converter-form {
    grid-template-columns: 1fr 1fr;
  }
  
  .converter-actions {
    grid-column: span 2;
    display: flex;
    justify-content: center;
  }
}

.form-group {
  position: relative;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.input-textarea,
.output-textarea {
  width: 100%;
  height: 400px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  resize: vertical;
}

.output-textarea {
  background-color: #f9f9f9;
}

.btn-sample,
.btn-download {
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px 8px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-convert {
  padding: 10px 20px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-convert:hover {
  background: #40a9ff;
}

.btn-convert:disabled {
  background: #bae7ff;
  cursor: not-allowed;
}

.stats-container {
  margin-top: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: #fafafa;
}

.stats-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.stats-badge {
  padding: 5px 10px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  font-size: 14px;
}
</style>
