<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const mode = ref('analog') // 'analog' or 'digital'
const canvasRef = ref(null)
let animationFrame = null

// 绘制表盘
const drawClock = () => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const radius = canvas.width / 2
  const now = new Date()
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制表盘
  ctx.beginPath()
  ctx.arc(radius, radius, radius * 0.9, 0, 2 * Math.PI)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = radius * 0.05
  ctx.stroke()
  
  // 绘制刻度
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6) * Math.PI / 180
    const length = i % 5 === 0 ? radius * 0.1 : radius * 0.05
    ctx.beginPath()
    ctx.moveTo(
      radius + (radius * 0.85) * Math.sin(angle),
      radius - (radius * 0.85) * Math.cos(angle)
    )
    ctx.lineTo(
      radius + (radius * 0.85 - length) * Math.sin(angle),
      radius - (radius * 0.85 - length) * Math.cos(angle)
    )
    ctx.strokeStyle = '#333'
    ctx.lineWidth = i % 5 === 0 ? 3 : 1
    ctx.stroke()
  }
  
  // 绘制时针
  const hour = now.getHours() % 12
  const minute = now.getMinutes()
  const hourAngle = (hour * 30 + minute * 0.5) * Math.PI / 180
  ctx.beginPath()
  ctx.moveTo(radius, radius)
  ctx.lineTo(
    radius + radius * 0.5 * Math.sin(hourAngle),
    radius - radius * 0.5 * Math.cos(hourAngle)
  )
  ctx.strokeStyle = '#333'
  ctx.lineWidth = radius * 0.05
  ctx.stroke()
  
  // 绘制分针
  const minuteAngle = minute * 6 * Math.PI / 180
  ctx.beginPath()
  ctx.moveTo(radius, radius)
  ctx.lineTo(
    radius + radius * 0.7 * Math.sin(minuteAngle),
    radius - radius * 0.7 * Math.cos(minuteAngle)
  )
  ctx.strokeStyle = '#333'
  ctx.lineWidth = radius * 0.03
  ctx.stroke()
  
  // 绘制秒针
  const second = now.getSeconds()
  const secondAngle = second * 6 * Math.PI / 180
  ctx.beginPath()
  ctx.moveTo(radius, radius)
  ctx.lineTo(
    radius + radius * 0.8 * Math.sin(secondAngle),
    radius - radius * 0.8 * Math.cos(secondAngle)
  )
  ctx.strokeStyle = '#f44336'
  ctx.lineWidth = radius * 0.01
  ctx.stroke()
  
  // 中心点
  ctx.beginPath()
  ctx.arc(radius, radius, radius * 0.05, 0, 2 * Math.PI)
  ctx.fillStyle = '#f44336'
  ctx.fill()
  
  animationFrame = requestAnimationFrame(drawClock)
}

// 数字时钟格式化
const formatTime = () => {
  const now = new Date()
  return {
    time: now.toLocaleTimeString(),
    date: now.toLocaleDateString(),
    day: ['日','一','二','三','四','五','六'][now.getDay()]
  }
}

onMounted(() => {
  if (mode.value === 'analog') {
    const canvas = canvasRef.value
    canvas.width = 300
    canvas.height = 300
    drawClock()
  }
})

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div class="clock-container">
    <div v-if="mode === 'analog'">
      <canvas ref="canvasRef"></canvas>
    </div>
    <div v-else class="digital-clock">
      <div class="time">{{ formatTime().time }}</div>
      <div class="date">星期{{ formatTime().day }} {{ formatTime().date }}</div>
    </div>
    <button @click="mode = mode === 'analog' ? 'digital' : 'analog'">
      切换{{ mode === 'analog' ? '数字' : '模拟' }}时钟
    </button>
  </div>
</template>

<style scoped>
.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
}
.digital-clock {
  text-align: center;
  font-family: 'Courier New', monospace;
}
.digital-clock .time {
  font-size: 2rem;
  font-weight: bold;
}
.digital-clock .date {
  font-size: 1rem;
  margin-top: 0.5rem;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
