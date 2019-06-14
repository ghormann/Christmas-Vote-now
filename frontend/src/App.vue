<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <AvailSongList/>
  </div>
</template>

<script>
import AvailSongList from "./components/AvailSongList.vue";

export default {
  name: "app",
  components: {
    AvailSongList
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
