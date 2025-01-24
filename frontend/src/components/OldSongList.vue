<template>
  <div>
    <div class="outer" v-bind:class="showMe">
      <h2>Recently Played</h2>
      <div class="my-intro-text">These will come available for voting soon....</div>
      <div class="songs">
        <ul class="song-list">
          <li v-for="song in allOldSongs" v-bind:key="song.id" class="song-item">
            {{ song.title }}
          </li>
        </ul>
      </div>
    </div>
    <div class="outer" v-bind:class="isShortList">
      <h2>Disabled Songs</h2>
      <div class="my-intro-text">
        Due to expected traffic, we are running a reduced playlist right now and these songs are not
        available.
      </div>
      <div class="songs">
        <ul class="song-list">
          <li v-for="song in allDisabledSongs" v-bind:key="song.id" class="song-item">
            {{ song.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
const display = displayStore()
const { allOldSongs, allDisabledSongs } = storeToRefs(display)

const isShortList = computed(() => {
  return {
    'd-none': display.allDisabledSongs.length === 0,
  }
})

const showMe = computed(() => {
  return {
    'd-none': display.allOldSongs.length === 0,
  }
})
</script>

<style scoped>
.songs {
  display: flex;
  justify-content: center;
}

.song-item {
  text-align: left;
}

.song-list {
  justify-content: center;
}

.my-intro-text {
  padding-bottom: 8px;
  font-style: oblique;
}
</style>
