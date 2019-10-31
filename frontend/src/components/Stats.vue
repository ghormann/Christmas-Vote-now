<template>
  <div>
    <div class="outer">
      <h1>Statistics</h1>
      <div style="text-align:left">
        Everybody likes Statistics right? We do have a few statistics on which songs are voted for the most
        and what names are requested to be included in the display. Unlike the rest of web site, the
        statistics are not real time. The statistics are refreshed every few minutes.
      </div>
      <p>
        <i>Stats Updated: {{health.lastStatsTime}}</i>
      </p>
    </div>
    <div class="outer">
      <h1>Top Voted Songs</h1>
      <hr />
      <SongStat title="Last Hour" v-bind:myData="stats.topSongs_1hr" />
      <br />
      <br />
      <SongStat title="Last Day" v-bind:myData="stats.topSongs_24hr" />
      <br />
      <br />
      <SongStat title="This Year" v-bind:myData="stats.topSongs_year" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SongStat from "./SongStat.vue";

export default {
  name: "Stats",
  components: {
    SongStat
  },
  computed: mapGetters(["health", "stats"])
};
</script>

<style local>
hr {
  border: 0.1rem solid gray;
  width: 85%;
}
</style>