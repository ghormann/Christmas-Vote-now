<template>
  <div>
    <div v-bind:class="showDisplayHours">
      <template v-if="facts.inSeason">
        <h2>The Show is Off</h2>
        <div>{{ nightlyText }}</div>
      </template>
      <template v-else>
        <h2>The Show is Off for the Season</h2>
        <div>We open {{ facts.openText }}, nightly from {{ facts.showHours }}.</div>
      </template>
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
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
import { factsStore } from '@/stores/facts'
const display = displayStore()
const factStore = factsStore()
const { facts } = storeToRefs(factStore)

onMounted(() => {
  factStore.fetchFacts()
})

const nightlyText = computed(() => {
  const f = facts.value
  const through = f.closeText ? ` through ${f.closeText}` : ''
  return `The show runs nightly from ${f.showHours}${through}.`
})
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
