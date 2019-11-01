<template>
  <div>
    <div class="outer">
      <h1>Statistics</h1>
      <div style="text-align:left">
        So you like statistics? So do we...  (At least on votes and submitted names.) <br>
        <i>Note:Unlike the rest of web site, the
        statistics are not real time. The statistics are refreshed every few minutes.</i>
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
    <div class="outer">
      <h1>Top Names</h1>
      <hr />
      <NameStat title="Last Hour" v-bind:myData="stats.topNames_1hr" />
      <br />
      <br />
      <NameStat title="Last Day" v-bind:myData="stats.topNames_24hr" />
      <br />
      <br />
      <NameStat title="This Year" v-bind:myData="stats.topNames_year" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SongStat from "./stats/SongStat.vue";
import NameStat from "./stats/NameStat.vue";

export default {
  name: "Stats",
  components: {
    SongStat,
    NameStat
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