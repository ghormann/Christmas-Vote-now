<template>
  <div id="app">
    <!--
    <img alt="Vue logo" src="./assets/logo.png">
    -->
    <b-img src="https://cooldisplays.net/picture.php?v=1543194801&width=800&display=1" fluid rounded alt="Our House"></b-img>
    <b-tabs active-nav-item-class="font-weight-bold text-uppercase" content-class="mt-2">
      <b-tab title="Vote" active>
        <AvailSongList/>
        <OldSongList/>
      </b-tab>
      <b-tab title="Name Queue">
        <NameQueue/>
      </b-tab>
    </b-tabs>
    <CoolDisplaysLogo/>
  </div>
</template>

<script>
import AvailSongList from "./components/AvailSongList.vue";
import OldSongList from "./components/OldSongList.vue";
import NameQueue from "./components/NameQueue.vue";
import CoolDisplaysLogo from "./components/CoolDisplaysLogo.vue";

export default {
  name: "app",
  components: {
    AvailSongList,
    OldSongList,
    NameQueue,
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
}

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

</style>
