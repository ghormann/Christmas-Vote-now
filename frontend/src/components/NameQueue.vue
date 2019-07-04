<template>
  <div class="outer">
    <h2>Name Queue</h2>
    <div class="intro-text">Text your name to 513-854-1352 to become part of the display.</div>
    <div class="names">
      <ul class="name-list">
        <li v-for="name in allNames" v-bind:key="name.id" class="name">{{name.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NameQueue",
  computed: mapGetters(["allNames"])
};
</script>

<style scoped>

.names {
  display: flex;
  justify-content: center;
}

.name {
    text-align: left;
}

.name-list {
  justify-content: center;
}
</style>
