<template>
  <div class="outer">
    <h2>Available Song Queue</h2>
    <div class="container songs">
      <div class="votes-line">
        Votes Remaining:
        <b>{{ votesRemaining }}</b>
      </div>
      <div class="alert" v-bind:class="errorClass" role="alert">{{ lastMessage }}</div>
      <div class="intro-text">Use up/down arrows to vote.</div>

      <div no-gutters v-for="song in allAvailSongs" v-bind:key="song.id" class="row song">
        <div class="votes-col col-2">
          <div class="float-div">
            <table cellspacing="0" cellpadding="0" class="my-table">
              <tbody>
                <tr>
                  <td class="votes">{{ song.votes }}</td>
                  <td>
                    <img
                      class="my-arrow-up"
                      alt="vote up"
                      src="./../assets/up.png"
                      @click="display.addVote(song.id)"
                    />
                    <img
                      alt="vote down"
                      class="my-arrow-down"
                      src="./../assets/down.png"
                      @click="display.removeVote(song.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="song-title col-10">{{ song.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
const display = displayStore()
const { allAvailSongs, votesRemaining, lastMessage } = storeToRefs(display)

const errorClass = computed(() => {
  return {
    'alert-danger': true,
    'd-none': display.lastMessage == 'OK',
  }
})

onMounted(() => {
  display.fetchState()
  setInterval(display.fetchState, 10000)
})
</script>

<style scoped>
.votes-line {
  color: darkgreen;
  padding-top: 5px;
}
.votes-col {
  text-align: right;
  padding-right: 1px;
}

.float-div {
  float: right;
  margin-right: 3px;
}

.my-table {
  border: 0px;
  table-layout: fixed;
  border-style: none;
  line-height: 80%; /* Pull up/down images together */
}
.my-table td {
  padding: 0px;
  margin: 0;
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
.votes {
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
