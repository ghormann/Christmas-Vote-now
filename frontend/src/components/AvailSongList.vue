<template>
  <!-- more at https://bootstrap-vue.js.org/docs/components/alert -->
  <div class="outer">
    <h2>Available Song Queue</h2>
    <b-container fluid class="songs">
      <b-row no-gutters v-for="song in allAvailSongs" v-bind:key="song.id" class="song">
        <b-col cols="10">{{song.title}}</b-col>
        <b-col cols="2">
          <i class="votes">{{song.votes}}</i>
          <img class="my-arrow-up" src="./../assets/up.png">
          <img class="my-arrow-down" src="./../assets/down.png">
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AvailSongList",
  computed: mapGetters(["allAvailSongs"])
};
</script>

<style scoped>
.outer {
  border: 2px;
  border-style: solid;
  border-radius: 25px;
  margin:2px;
}
.votes {
  margin-right: 3px;
  font-style: normal;
  color: royalblue;
}

.song {
  position: relative;
  padding-bottom: 6px;
}

.my-arrow-up {
  position: relative;
  right: 0px;
  bottom: 8px;
  height: 10px;
  cursor: pointer;
}

.my-arrow-down {
  position: relative;
  right: 16px;
  bottom: -8px;
  height: 10px;
  cursor: pointer;
}
</style>
