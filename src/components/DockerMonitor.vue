<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 创建Docker API客户端
const docker = axios.create({
  socketPath: '/var/run/docker.sock',
  baseURL: 'http://localhost/v1.41'
})

// 容器数据
const containers = ref([])
const stats = ref({})

// 获取容器列表
const fetchContainers = async () => {
  const res = await docker.get('/containers/json?all=true')
  containers.value = res.data
}

// 获取容器状态
const fetchContainerStats = async (id) => {
  const res = await docker.get(`/containers/${id}/stats?stream=false`)
  const data = res.data
  
  // 计算CPU使用率
  const cpuDelta = data.cpu_stats.cpu_usage.total_usage - 
                  data.precpu_stats.cpu_usage.total_usage
  const systemDelta = data.cpu_stats.system_cpu_usage - 
                     data.precpu_stats.system_cpu_usage
  const cpuPercent = (cpuDelta / systemDelta) * 100
  
  // 计算内存使用率
  const memPercent = (data.memory_stats.usage / data.memory_stats.limit) * 100
  
  stats.value[id] = {
    cpu: cpuPercent.toFixed(2),
    memory: memPercent.toFixed(2)
  }
}

// 容器操作
const startContainer = async (id) => {
  await docker.post(`/containers/${id}/start`)
  fetchContainers()
}

const stopContainer = async (id) => {
  await docker.post(`/containers/${id}/stop`)
  fetchContainers()
}

onMounted(() => {
  fetchContainers()
  setInterval(fetchContainers, 5000)
})
</script>

<template>
  <div class="docker-monitor">
    <h2>Docker容器监控</h2>
    <table>
      <thead>
        <tr>
          <th>容器ID</th>
          <th>名称</th>
          <th>状态</th>
          <th>CPU使用率</th>
          <th>内存使用率</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in containers" :key="c.Id">
          <td>{{ c.Id.slice(0, 12) }}</td>
          <td>{{ c.Names[0].replace('/', '') }}</td>
          <td>{{ c.State }}</td>
          <td>{{ stats[c.Id]?.cpu || '-' }}%</td>
          <td>{{ stats[c.Id]?.memory || '-' }}%</td>
          <td>
            <button 
              v-if="c.State === 'running'" 
              @click="stopContainer(c.Id)"
            >停止</button>
            <button 
              v-else 
              @click="startContainer(c.Id)"
            >启动</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.docker-monitor {
  margin-top: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ddd;
  text-align: left;
}
button {
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
</style>
