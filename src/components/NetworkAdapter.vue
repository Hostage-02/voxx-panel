<script setup>
import { ref, computed } from 'vue'
import { storage } from '../storage'

// 当前环境
const isInternal = ref(window.location.hostname.includes('.local'))

// 服务列表
const services = ref([
  { 
    name: 'Jellyfin', 
    internal: 'http://nas.local:8096',
    external: 'https://demo.com',
    icon: '/icons/jellyfin.svg'
  }
])

// 获取当前环境URL
const getServiceUrl = (service) => {
  return isInternal.value ? service.internal : service.external
}

// 切换环境
const toggleNetwork = () => {
  isInternal.value = !isInternal.value
}
</script>

<template>
  <div class="network-adapter">
    <div class="status-bar">
      <span>当前环境: {{ isInternal ? '内网' : '外网' }}</span>
      <button @click="toggleNetwork">切换</button>
    </div>

    <div class="service-list">
      <a 
        v-for="service in services"
        :key="service.name"
        :href="getServiceUrl(service)"
        class="service-item"
      >
        <img v-if="service.icon" :src="service.icon" class="icon">
        <span>{{ service.name }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.network-adapter {
  margin-top: 1rem;
}
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-bg-secondary);
}
.service-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  text-decoration: none;
  color: var(--color-text);
}
.service-item:hover {
  background: rgba(0,0,0,0.05);
}
.icon {
  width: 32px;
  height: 32px;
  margin-bottom: 0.25rem;
}
</style>
