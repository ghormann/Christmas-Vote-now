<template>
  <div class="outer">
    <h2>Name Queue</h2>
    <a class="text-button" :href="TEXT_NUMBER_SMS" @click="trackTextClick">
      Text your first name to {{ TEXT_NUMBER_DISPLAY }}
    </a>
    <div class="intro-text">
      Your name shows up below the clock right away and on the big grid over the front door every
      8&ndash;12 minutes. Names will be displayed {{ nameEstimates.message }}. (Estimate isn't
      perfect)
      <a :href="techUrl('text-message')">How it works</a>
    </div>
    <div class="alert" v-bind:class="errorClass" role="alert">
      Names in Green will be next song.
    </div>

    <div class="alert" v-bind:class="nameEmptyClass">Name queue is empty</div>

    <div class="names">
      <ol class="name-list">
        <li
          v-for="name in allNames"
          v-bind:key="name.id"
          v-bind:class="{ name: true, low: name.type === 'LOW', next: name.type === 'READY' }"
        >
          <div class="row">
            <div class="col-6">{{ name.name }}</div>
            <div class="col-6">{{ secondsPast(name.ts) }}</div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
import { trackEvent } from '@/analytics'
import { TEXT_NUMBER_DISPLAY, TEXT_NUMBER_SMS, techUrl } from '@/lib/site'
const display = displayStore()
const { allNames, nameEstimates } = storeToRefs(display)
const trackTextClick = function () {
  trackEvent('text_name_click', { source: 'names' })
}

const secondsPast = function (ts) {
  var d = new Date()
  var seconds = d.getTime() / 1000

  var diff = Math.floor(seconds - ts)
  let msg = ''
  if (diff < 90) {
    msg = ' (' + diff + ' sec)'
  } else {
    diff = Math.round(diff / 60)
    msg = ' (' + diff + ' min)'
  }

  return msg
}

const nameEmptyClass = computed(() => {
  return {
    'alert-warning': true,
    'd-none': display.allNames.length > 0,
  }
})

const errorClass = computed(() => {
  return {
    'alert-success': true,
    'd-none': display.currentSong.nameStatus != 'READY',
  }
})
</script>

<style scoped>
.text-button {
  display: inline-block;
  margin: 4px 10px 12px;
  padding: 10px 18px;
  border-radius: 22px;
  background: darkgreen;
  color: white;
  font-size: 1.1em;
}

.names {
  display: flex;
  justify-content: center;
}

.next {
  color: green;
}

.low {
  color: gray;
}

.name {
  width: 300px;
  text-align: left;
}

.name-list {
  justify-content: center;
}
</style>
