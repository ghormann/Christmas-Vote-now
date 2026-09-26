<template>
  <div class="outer">
    <h2>Snowmen Control</h2>
    <div class="now-showing">
      Right now the snowman is <b>{{ currentSong.snowman }}</b>
    </div>
    <div class="intro-text">
      Pick who the snowman on the right turns into. The next time he gets knocked out by the big
      snowball, the character with the most votes takes his place and voting starts over. You get
      one vote; tap a different character to move it.
      <a :href="techUrl('snowmen')">How the snowmen work</a>
    </div>

    <div class="snowmen">
      <button
        v-for="who in allSnowmen"
        v-bind:key="who.id"
        type="button"
        class="snowman"
        v-bind:class="{ mine: who.id == display.mySnowmen }"
        :aria-pressed="who.id == display.mySnowmen"
        @click="display.addSnowmanVote(who.id)"
      >
        <span class="name">{{ who.name }}</span>
        <span class="count">{{ who.votes }}</span>
        <span v-if="who.id == display.mySnowmen" class="my-vote">&#10003; My vote</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
import { techUrl } from '@/lib/site'
const display = displayStore()
const { allSnowmen, currentSong } = storeToRefs(display)
</script>

<style scoped>
.now-showing {
  font-size: 1.15em;
  color: rgb(210, 210, 210);
  padding-bottom: 6px;
}
.now-showing b {
  color: white;
}

.intro-text {
  padding: 0 10px 12px;
}

.snowmen {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
  padding: 0 10px;
}

.snowman {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 2px 6px;
  min-height: 44px;
  padding: 6px 10px;
  border: 1px solid rgb(90, 90, 90);
  border-radius: 12px;
  background: rgb(34, 34, 34);
  color: rgb(200, 200, 200);
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.snowman:active {
  background: rgb(50, 50, 50);
}
.snowman.mine {
  border: 2px solid gold;
  color: white;
}

.name {
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.2;
}
.count {
  color: royalblue;
}
.my-vote {
  flex-basis: 100%;
  font-size: 0.8em;
  color: gold;
}
</style>
