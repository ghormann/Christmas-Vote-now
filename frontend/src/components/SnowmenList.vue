<template>
  <div class="outer">
    <h2>Snowmen Control</h2>
    <div><b>Current Snowman:</b> {{ currentSong.snowman }}</div>
    <div class="container songs">
      <div class="intro-text">
        Use up arrows to vote.
        <div v-bind:class="votedClass"><span class="my-vote">*</span> My Vote.</div>
      </div>

      <div
        no-gutters
        v-for="who in allSnowmen"
        v-bind:key="who.id"
        class="row justify-content-md-center song"
      >
        <div class="votes-col col-2">
          <div class="float-div">
            <img
              class="my-arrow-up"
              alt="vote up"
              src="./../assets/up.png"
              @click="display.addSnowmanVote(who.id)"
            />
          </div>
          <span class="vote">{{ who.votes }}</span>
        </div>
        <div class="song-title col-8 col-md-4 col-lg-4">
          {{ who.name }}
          <span class="my-vote">{{ highlightMine(who.id) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
const display = displayStore()
const { allSnowmen, currentSong } = storeToRefs(display)

const highlightMine = (id) => {
  if (id == display.mySnowmen) {
    return '*'
  }
  return ''
}

const votedClass = computed(() => {
  return {
    'd-none': display.mySnowmen == -1,
  }
})
</script>

<style scoped>
.votes-line {
  color: darkgreen;
  padding-top: 5px;
}
.votes-col {
  text-align: right;
}

.float-div {
  float: right;
  margin-right: 3px;
}

.my-vote {
  color: red;
}

.song-title {
  text-align: left;
  padding-left: 0px;
}
.outer {
  border: 2px;
  border-style: solid;
  border-radius: 25px;
  margin: 2px;
}
.vote {
  font-style: normal;
  color: royalblue;
}

.song {
  position: relative;
  padding-bottom: 6px;
}

.my-arrow-up {
  height: 14px;
  cursor: pointer;
}

.my-arrow-down {
  height: 14px;
  cursor: pointer;
}
</style>
