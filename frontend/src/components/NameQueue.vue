<template>
  <div class="outer">
    <h2>Name Queue</h2>
    <div class="intro-text">Text your first name to 513-854-1352 to become part of the display.</div>
    <div class="alert" v-bind:class="errorClass" role="alert">Names in Green will be next song.</div>

    <div class="names">
      <ol class="name-list">
        <li
          v-for="name in allNames"
          v-bind:key="name.id"
          v-bind:class="{'name': true, 'low' : name.type === 'LOW', 'next' : name.type==='READY'}"
        >{{name.name}}</li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NameQueue",
  computed: {
    ...mapGetters(["allNames", "currentSong"]),
    errorClass: function() {
      return {
        "alert-success": true,
        "d-none": this.currentSong.nameStatus != "READY"
      };
    }
  }
};
</script>

<style scoped>
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
  text-align: left;
}

.name-list {
  justify-content: center;
}
</style>
