<template>
    <a-space>
        <!--
        <a-button type="primary">放大</a-button>
        <a-button type="primary">缩小</a-button>
        <a-button type="primary">恢复</a-button>
        <a-divider type="vertical" style="background-color: #afafaf"/>
        <a-button type="primary">前进</a-button>
        <a-button type="primary">后退</a-button>
        <a-divider type="vertical" style="background-color: #afafaf"/>
-->
         <a-dropdown>
            <template #overlay>
                <a-menu @click="toproductionLine">
                    <a-menu-item key="json">地礼线生产线</a-menu-item>
                    <a-menu-item key="json">模压坨生产线</a-menu-item>
                </a-menu>
            </template>
            <a-button type="primary">
                查看生产线
            </a-button>
        </a-dropdown>
        <a-dropdown>
            <template #overlay>
                <a-menu @click="toImport">
                    <a-menu-item key="json">JSON格式</a-menu-item>
                    <a-menu-item key="yaml">YAML格式</a-menu-item>
                </a-menu>
            </template>
            <a-button type="primary">
                导入
            </a-button>
        </a-dropdown>
      <a-dropdown>
        <template #overlay>
          <a-menu @click="toExport">
            <a-menu-item key="json">JSON格式</a-menu-item>
            <a-menu-item key="yaml">YAML格式</a-menu-item>
          </a-menu>
        </template>
        <a-button type="primary">
          导出
        </a-button>
      </a-dropdown>

        <a-button type="primary" @click="toClear">清空</a-button>
        <a-divider type="vertical" style="background-color: #afafaf"/>
        <a-button type="primary" @click="editChainConfig">Chain 配置</a-button>
    </a-space>
</template>
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['editChainConfig','toExport','toImport','toClear','toproductionLine'])

function editChainConfig() { 
    emit('editChainConfig')
} // 打开编辑 Chain 配置的对话框

function toExport(e) { // 导出当前画布的内容为 JSON 格式的字符串，用于保存或分享
    emit('toExport', e.key)
}

function toImport(e) { // 导入 JSON 格式的字符串，用于加载或分享的画布内容
    emit('toImport',e.key)
}
function toproductionLine(e) { // 导入 JSON 格式的字符串，用于加载或分享的画布内容
    emit('toproductionLine',e.key)
}

function toClear() { // 清空当前画布的内容
    emit('toClear')
}
</script>