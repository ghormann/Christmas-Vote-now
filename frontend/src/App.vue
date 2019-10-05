<template>
  <div id="app">
    <!--
    <img alt="Vue logo" src="./assets/logo.png">
    -->
    <b-img
      src="https://cooldisplays.net/picture.php?v=1543194801&width=800&display=1"
      fluid
      rounded
      alt="Our House"
    ></b-img>
    <b-tabs active-nav-item-class="font-weight-bold text-uppercase" class="gjh-tab" content-class="mt-2">
      <b-tab title="Vote" active>
        <CurrentSong />
        <ShowHours />
        <AvailSongList />
        <OldSongList />
      </b-tab>
      <b-tab title="Name Queue">
        <NameQueue />
      </b-tab>
    </b-tabs>
    <LastUpdated />
    <CoolDisplaysLogo />
    <div>
      Learn more at
      <a href="http://thehormanns.net/new/christmas.phtml">http://thehormanns.net</a>
    </div>
  </div>
</template>

<script>
import AvailSongList from "./components/AvailSongList.vue";
import OldSongList from "./components/OldSongList.vue";
import NameQueue from "./components/NameQueue.vue";
import CoolDisplaysLogo from "./components/CoolDisplaysLogo.vue";
import LastUpdated from "./components/LastUpdated.vue"
import CurrentSong from"./components/CurrentSong.vue"
import ShowHours from"./components/ShowHours.vue"
export default {
  name: "app",
  components: {
    AvailSongList,
    OldSongList,
    NameQueue,
    CurrentSong,
    CoolDisplaysLogo,
    LastUpdated,
    ShowHours
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

.gjh-tab {
  max-width: 800px;
  margin: 0 auto;
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
