<script setup>
import { ref, onMounted } from 'vue'

const wallpapers = ref([])
const currentWallpaper = ref('')
const blurEnabled = ref(false)
const transitionEnabled = ref(true)

// 模拟从目录读取壁纸
const loadWallpapers = async () => {
  // 实际项目中应替换为真实的文件系统访问
  wallpapers.value = [
    '/wallpapers/1.jpg',
    '/wallpapers/2.jpg',
    '/wallpapers/3.jpg'
  ]
  if (wallpapers.value.length > 0) {
    currentWallpaper.value = wallpapers.value[0]
  }
}

// 切换壁纸
const changeWallpaper = (index) => {
  if (transitionEnabled.value) {
    currentWallpaper.value = ''
    setTimeout(() => {
      currentWallpaper.value = wallpapers.value[index]
    }, 500)
  } else {
    currentWallpaper.value = wallpapers.value[index]
  }
}

// 随机切换壁纸
const randomWallpaper = () => {
  const randomIndex = Math.floor(Math.random() * wallpapers.value.length)
  changeWallpaper(randomIndex)
}

onMounted(() => {
  loadWallpapers()
})
</script>

<template>
  <div class="wallpaper-switcher">
    <div 
      class="wallpaper-container"
      :style="{
        backgroundImage: `url(${currentWallpaper})`,
        transition: transitionEnabled ? 'background-image 0.5s ease' : 'none',
        filter: blurEnabled ? 'blur(5px)' : 'none'
      }"
    ></div>
    
    <div class="controls">
      <button 
        v-for="(wallpaper, index) in wallpapers" 
        :key="index"
        @click="changeWallpaper(index)"
      >
        壁纸 {{ index + 1 }}
      </button>
      
      <button @click="randomWallpaper">随机切换</button>
      
      <label>
        <input type="checkbox" v-model="blurEnabled">
        模糊效果
      </label>
      
      <label>
        <input type="checkbox" v-model="transitionEnabled">
        过渡动画
      </label>
    </div>
  </div>
</template>

<style scoped>
.wallpaper-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: cover;
  background-position: center;
}

.controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

label {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
