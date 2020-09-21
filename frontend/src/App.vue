<template>
  <div id="app">
    <!--
    <img alt="Vue logo" src="./assets/logo.png">
    -->
    <b-img
      src="https://cooldisplays.net/picture.php?v=1579372572&pictid=133&width=800"
      fluid
      rounded
      alt="Our House"
    ></b-img>
    <GlobalStatus />
    <b-tabs
      active-nav-item-class="font-weight-bold text-uppercase"
      class="gjh-tab"
      content-class="mt-2"
      v-bind:class="showMe"
    >
      <b-tab title="Vote" active>
        <TodayPower />
        <CurrentSong />
        <ShowHours />
        <AvailSongList />
        <OldSongList />
        <LastUpdated />
      </b-tab>
      <b-tab @click="clickTab('NameQueue')" title="Name Queue">
        <NameQueue />
        <LastUpdated />
      </b-tab>
      <b-tab title="Info" @click="clickTab('Info')">
        <InfoTab />
      </b-tab>
      <b-tab title="Stats" @click="clickTab('Stats')">
        <Stats />
      </b-tab>
    </b-tabs>
    <CoolDisplaysLogo />
    <div>
      Learn more at
      <a href="http://thehormanns.net/new/christmas.phtml">http://thehormanns.net</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import AvailSongList from "./components/AvailSongList.vue";
import OldSongList from "./components/OldSongList.vue";
import NameQueue from "./components/NameQueue.vue";
import CoolDisplaysLogo from "./components/CoolDisplaysLogo.vue";
import LastUpdated from "./components/LastUpdated.vue";
import CurrentSong from "./components/CurrentSong.vue";
import ShowHours from "./components/ShowHours.vue";
import InfoTab from "./components/InfoTab.vue";
import GlobalStatus from "./components/GlobalStatus.vue";
import Stats from "./components/Stats.vue";
import TodayPower from "./components/TodayPower.vue";
export default {
  name: "app",
  beforeCreate: function () {
    document.body.className = "body-gjh";
  },
  components: {
    AvailSongList,
    OldSongList,
    NameQueue,
    CurrentSong,
    CoolDisplaysLogo,
    LastUpdated,
    Stats,
    ShowHours,
    GlobalStatus,
    InfoTab,
    TodayPower,
  },
  mounted: function () {
    this.$ga.page("/");
  },
  computed: {
    ...mapGetters(["currentSong"]),
    showMe: function () {
      return {
        "d-none": !this.currentSong.enabled,
      };
    },
  },
  methods: {
    clickTab: function (name) {
      this.$ga.event("Tabs", name, "click", 123);
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(136, 136, 136);
}

h1,
h2,
h3,
h4 {
  color: white;
}

.gjh-tab {
  max-width: 800px;
  margin: 0 auto;
}

.nav-item a {
  color: royalblue;
}

.body-gjh {
  background-color: rgb(25, 25, 25);
}

.gjh-padded {
  padding: 5px;
}

.outer {
  border: 2px;
  border-style: solid;
  border-radius: 25px;
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 1em;
  margin-bottom: 1em;
  padding-bottom: 1em;
}

.gjh-fake-link {
  color: #007bff !important;
  cursor: pointer;
}

.intro-text {
  padding-bottom: 18px;
  font-style: oblique;
}
</style>
