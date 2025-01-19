<template>
  <div
    class="outer gjh-warning"
    :class="{ 'd-none': currentSong.enabled && health.status == 'ALL_OK' }"
  >
    <div :class="{ 'd-none': currentSong.enabled }">
      <h2>Website is down</h2>
      <div>Currently down for maintainence</div>
    </div>
    <div :class="{ 'd-none': health.status == 'ALL_OK' }">
      <h2>System Error</h2>
      <div>The show is currently experiencing issues. Some features may not be working.</div>
    </div>
  </div>
  <!--outer -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
const display = displayStore()
const { currentSong, health } = storeToRefs(display)

onMounted(() => {
  display.fetchState()
  console.log(health, currentSong)
})
</script>

<style scoped>
.gjh-warning {
  background-color: red;
  color: white;
}
</style>
