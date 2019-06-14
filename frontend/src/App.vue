<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <AvailSongList/>
    <OldSongList/>
    <CoolDisplaysLogo/>
  </div>
</template>

<script>
import AvailSongList from "./components/AvailSongList.vue";
import OldSongList from "./components/OldSongList.vue";
import CoolDisplaysLogo from "./components/CoolDisplaysLogo.vue";

export default {
  name: "app",
  components: {
    AvailSongList,
    OldSongList,
    CoolDisplaysLogo
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
