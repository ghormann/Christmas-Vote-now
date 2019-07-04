<template>
  <div class="outer">
    <h2>Recently Played</h2>
    <div class="intro-text">These will come avaiable for voting soon....</div>
    <div class="songs">
      <ul class="song-list">
        <li v-for="song in allOldSongs" v-bind:key="song.id" class="song-item">{{song.title}}</li>
      </ul>
    </div>
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
  margin: 2px;
}

.intro-text {
    padding-bottom: 18px;
    font-style: oblique;
}

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
</style>
