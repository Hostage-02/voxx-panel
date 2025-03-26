<script setup>
import { ref, computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { storage } from '../storage'

// 导航数据
const groups = ref([])
const loadGroups = async () => {
  groups.value = await storage.getGroups()
}
loadGroups()

// 当前环境
const isInternal = ref(window.location.hostname.includes('.local'))

// 右键菜单
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  item: null
})

const showContextMenu = (e, item) => {
  e.preventDefault()
  contextMenu.value = {
    show: true,
    x: e.clientX,
    y: e.clientY,
    item
  }
}

const closeContextMenu = () => {
  contextMenu.value.show = false
}

// 分组折叠状态
const expandedGroups = ref({})
const toggleGroup = (groupId) => {
  expandedGroups.value[groupId] = !expandedGroups.value[groupId]
}
</script>

<template>
  <div class="smart-nav" @click="closeContextMenu">
    <VueDraggableNext 
      v-for="group in groups"
      :key="group.id"
      v-model="group.items"
      group="navItems"
      item-key="id"
      @end="() => storage.saveGroups(groups)"
    >
      <template #header>
        <div class="group-header" @click="toggleGroup(group.id)">
          <span>{{ group.name }}</span>
          <span>{{ expandedGroups[group.id] ? '▲' : '▼' }}</span>
        </div>
      </template>

      <template v-if="expandedGroups[group.id]">
        <div 
          v-for="item in group.items"
          :key="item.id"
          class="nav-item"
          @click="storage.openNewWindow(item, isInternal)"
          @contextmenu="showContextMenu($event, item)"
        >
          <img v-if="item.icon" :src="item.icon" class="icon">
          <span>{{ item.name }}</span>
        </div>
      </template>
    </VueDraggableNext>

    <!-- 右键菜单 -->
    <div 
      v-if="contextMenu.show"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div @click="openNewWindow(contextMenu.item)">新窗口打开</div>
      <div @click="editItem(contextMenu.item)">编辑</div>
      <div @click="deleteItem(contextMenu.item)">删除</div>
    </div>
  </div>
</template>

<style scoped>
.smart-nav {
  display: grid;
  gap: 1rem;
}
.group-header {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem;
  background: var(--color-primary);
  color: white;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
}
.nav-item:hover {
  background: rgba(0,0,0,0.1);
}
.icon {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
}
.context-menu {
  position: fixed;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 100;
}
.context-menu div {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.context-menu div:hover {
  background: #f0f0f0;
}
</style>
