<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import systeminformation from 'systeminformation'

// 图表引用
let cpuChart = null
let memChart = null
let netChart = null

// 数据
const cpuData = ref([])
const memUsage = ref(0)
const netStats = ref({
  rx: 0,
  tx: 0
})

// 初始化图表
const initCharts = () => {
  // CPU折线图
  cpuChart = echarts.init(document.getElementById('cpu-chart'))
  cpuChart.setOption({
    title: { text: 'CPU负载' },
    tooltip: {},
    xAxis: { type: 'category', data: [] },
    yAxis: { max: 100 },
    series: [{
      type: 'line',
      data: [],
      smooth: true,
      areaStyle: {}
    }]
  })

  // 内存环形图
  memChart = echarts.init(document.getElementById('mem-chart'))
  memChart.setOption({
    title: { text: '内存使用' },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      label: { show: false },
      data: [
        { value: 0, name: '已用' },
        { value: 100, name: '可用' }
      ]
    }]
  })

  // 网络流量图
  netChart = echarts.init(document.getElementById('net-chart'))
  netChart.setOption({
    title: { text: '网络吞吐量' },
    tooltip: {},
    xAxis: { type: 'category', data: ['接收', '发送'] },
    yAxis: {},
    series: [{
      type: 'bar',
      data: [0, 0]
    }]
  })
}

// 获取硬件信息
let interval = null
const getHardwareInfo = async () => {
  // CPU负载
  const cpu = await systeminformation.currentLoad()
  cpuData.value.push(cpu.currentLoad.toFixed(2))
  if (cpuData.value.length > 10) cpuData.value.shift()
  
  // 内存使用
  const mem = await systeminformation.mem()
  memUsage.value = (mem.used / mem.total * 100).toFixed(2)
  
  // 网络流量
  const net = await systeminformation.networkStats()
  netStats.value = {
    rx: (net[0].rx_bytes / 1024 / 1024).toFixed(2),
    tx: (net[0].tx_bytes / 1024 / 1024).toFixed(2)
  }
  
  // 更新图表
  updateCharts()
}

// 更新图表
const updateCharts = () => {
  // CPU图表
  cpuChart.setOption({
    xAxis: { data: Array.from({length: cpuData.value.length}, (_,i) => i+1) },
    series: [{ data: cpuData.value }]
  })
  
  // 内存图表
  memChart.setOption({
    series: [{
      data: [
        { value: memUsage.value, name: '已用' },
        { value: 100 - memUsage.value, name: '可用' }
      ]
    }]
  })
  
  // 网络图表
  netChart.setOption({
    series: [{ data: [netStats.value.rx, netStats.value.tx] }]
  })
}

onMounted(() => {
  initCharts()
  getHardwareInfo()
  interval = setInterval(getHardwareInfo, 2000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
  cpuChart.dispose()
  memChart.dispose()
  netChart.dispose()
})
</script>

<template>
  <div class="hardware-monitor">
    <h2>硬件状态监控</h2>
    <div class="chart-container">
      <div id="cpu-chart" class="chart"></div>
      <div id="mem-chart" class="chart"></div>
      <div id="net-chart" class="chart"></div>
    </div>
  </div>
</template>

<style scoped>
.hardware-monitor {
  margin-top: 2rem;
}
.chart-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>
