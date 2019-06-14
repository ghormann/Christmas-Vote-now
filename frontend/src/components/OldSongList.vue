<template>
  <div class="outer">
    <h2>Recent Song Queue</h2>
    <b-container fluid class="songs">
      <b-row no-gutters v-for="song in allOldSongs" v-bind:key="song.id" class="song">
        <b-col cols="12">{{song.title}}</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OldSongList",
  computed: mapGetters(["allOldSongs"])
};
</script>

<style scoped>
.outer {
  border: 2px;
  border-style: solid;
  border-radius: 25px;
  margin:2px;
}

.song {
  position: relative;
  padding-bottom: 6px;
}

</style>
