<script setup>
import SmartNav from './components/SmartNav.vue'
import NetworkAdapter from './components/NetworkAdapter.vue'
import DockerMonitor from './components/DockerMonitor.vue'
import HardwareMonitor from './components/HardwareMonitor.vue'
import ClockComponent from './components/ClockComponent.vue'
import WallpaperSwitcher from './components/WallpaperSwitcher.vue'
</script>

<template>
  <div class="app">
    <WallpaperSwitcher />
    
    <header>
      <h1>NAS智能导航系统</h1>
      <ClockComponent />
    </header>
    
    <main>
      <SmartNav />
      <NetworkAdapter />
      <DockerMonitor />
      <HardwareMonitor />
    </main>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 1rem;
  background: var(--color-bg);
  color: var(--color-text);
}

.app {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

main {
  display: grid;
  gap: 2rem;
}
</style>
