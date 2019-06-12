<template>
  <!-- more at https://bootstrap-vue.js.org/docs/components/alert -->
  <div>
    <b-alert show>Exampel Alert</b-alert>
    <h2>Current Song Queue</h2>
    <div class="songs">
      <div v-for="song in allSongs" v-bind:key="song.id" class="song">
        {{song.title}}
        <img class="my-arrow-up" src="./../assets/up.png">
        <img class="my-arrow-down" src="./../assets/down.png">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SongList",
  computed: mapGetters(["allSongs"])
};
</script>

<style scoped>
div.song {
  position: relative;
  height: 30px;
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
