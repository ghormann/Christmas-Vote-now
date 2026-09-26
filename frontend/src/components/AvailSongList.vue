<template>
  <div class="outer">
    <h2>Available Song Queue</h2>
    <div class="songs">
      <div class="votes-line">
        Votes Remaining:
        <b>{{ votesRemaining }}</b>
      </div>
      <div class="alert" v-bind:class="errorClass" role="alert">{{ lastMessage }}</div>
      <div class="intro-text">
        Use up/down arrows to vote.
        <RouterLink to="/info#how-voting-works">How voting works</RouterLink>
      </div>

      <ul class="song-list">
        <li
          v-for="song in allAvailSongs"
          v-bind:key="song.id"
          class="song"
          v-bind:class="{ mine: display.myVotesFor(song.id) > 0 }"
        >
          <span class="votes">{{ song.votes }}</span>
          <button
            type="button"
            class="vote-btn"
            :aria-label="'Vote for ' + song.title"
            @click="display.addVote(song.id)"
          >
            <img alt="" src="./../assets/up.png" />
          </button>
          <button
            type="button"
            class="vote-btn"
            :aria-label="'Remove a vote from ' + song.title"
            :disabled="display.myVotesFor(song.id) === 0"
            @click="display.removeVote(song.id)"
          >
            <img alt="" class="down-img" src="./../assets/down.png" />
          </button>
          <span class="song-title">
            {{ song.title }}
            <span v-if="display.myVotesFor(song.id) > 0" class="my-votes">
              &#9733;{{ display.myVotesFor(song.id) }}
            </span>
          </span>
        </li>
      </ul>

      <div class="text-name">
        Put your name in lights: text your first name to
        <a :href="TEXT_NUMBER_SMS" @click="trackTextClick">{{ TEXT_NUMBER_DISPLAY }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
import { trackEvent } from '@/analytics'
import { TEXT_NUMBER_DISPLAY, TEXT_NUMBER_SMS } from '@/lib/site'
const display = displayStore()
const { allAvailSongs, votesRemaining, lastMessage } = storeToRefs(display)

const errorClass = computed(() => {
  return {
    'alert-danger': true,
    'd-none': display.lastMessage == 'OK',
  }
})

const trackTextClick = function () {
  trackEvent('text_name_click', { source: 'vote' })
}

onMounted(() => {
  display.fetchState()
})
</script>

<style scoped>
.votes-line {
  color: darkgreen;
  padding-top: 5px;
}

.songs {
  padding: 0 4px;
}

.song-list {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 500px;
}

.song {
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 32px;
  text-align: left;
}

.votes {
  flex: 0 0 1.5em;
  text-align: right;
  color: royalblue;
}

/* Rows stay compact; the buttons fill the row height to stay easy to tap. */
.vote-btn {
  flex: 0 0 34px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.vote-btn:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}
.vote-btn:disabled {
  opacity: 0.25;
  cursor: default;
}
.vote-btn img {
  height: 16px;
}
/* down.png is a darker green than up.png; brighten it when it can be used. */
.vote-btn:not(:disabled) .down-img {
  filter: brightness(2.2);
}

/* Long titles wrap onto a second line instead of pushing the buttons. */
.song-title {
  flex: 1 1 auto;
  min-width: 0;
  padding-left: 2px;
  overflow-wrap: anywhere;
  line-height: 1.2;
}
.song.mine .song-title {
  color: rgb(225, 225, 225);
}
.my-votes {
  color: gold;
  white-space: nowrap;
}

.text-name {
  padding-top: 12px;
}
</style>
