<template>
  <div class="outer" v-bind:class="showMe">
    <h2>Current Song</h2>
    <div class="song">
      <b>{{ currentSongClean }}</b> {{ timePart }}
    </div>
  </div>
  <!--outer -->
</template>
<style scoped>
.song {
  color: rgb(228, 58, 58);
}
</style>
<script setup>
import { computed } from 'vue'
import { displayStore } from '@/stores/display'
const display = displayStore()

const currentSongClean = computed(() => {
  let c = display.currentSong
  if ('idle' === c.status) {
    return 'System Idle'
  } else {
    return c.title
  }
})

const showMe = computed(() => {
  return {
    'd-none': display.currentSong.status === 'idle' || !display.currentSong.isDisplayHours,
  }
})

const timePart = computed(() => {
  let c = display.currentSong
  if (c.secondsRemaining <= 0) {
    return ''
  }

  return convertTime(c.secondsRemaining) + ' / ' + convertTime(c.secondsTotal)
})

const convertTime = function (input) {
  if (input <= 0) {
    return ''
  }
  let minutes = Math.floor(input / 60)
  let seconds = input % 60
  return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
}
</script>
