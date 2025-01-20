<template>
  <div>
    <div v-bind:class="showDisplayHours">
      <h2>The Show is Off</h2>
      <div>The show runs from 5pm-11pm each night.</div>
    </div>
    <div v-bind:class="isShortList">
      <h2>Reduced Play List</h2>
      <div>Due to expected traffic, we are running a reduced playlist right now.</div>
    </div>
    <div v-bind:class="showDebug">
      <h2>In debug mode</h2>
      <div>The show is running in debug mode.</div>
    </div>
  </div>
  <!--outer -->
</template>
<script setup>
import { computed } from 'vue'
import { displayStore } from '@/stores/display'
const display = displayStore()

const showDebug = computed(() => {
  return {
    alert: true,
    'alert-danger': true,
    'gjh-alert': true,
    'd-none': !display.currentSong.debug,
  }
})

const isShortList = computed(() => {
  return {
    alert: true,
    'alert-danger': true,
    'gjh-alert': true,
    'd-none': !display.currentSong.isShortList,
  }
})

const showDisplayHours = computed(() => {
  return {
    alert: true,
    'alert-danger': true,
    'gjh-alert': true,
    'd-none': display.currentSong.isDisplayHours,
  }
})
</script>

<style scoped>
.gjh-alert {
  border: 2px;
  border-style: none;
  border-radius: 25px;
  margin: 0px;
}

.gjh-alert h2 {
  color: #721c24;
}
</style>
