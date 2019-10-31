<template>
  <div>
    Stats Updated: {{health.lastStatsTime}}
    <SingleStat title="Top Votes (1 Hours)" v-bind:myData="stats.topSongs_1hr" />
    <SingleStat title="Top Votes (24 Hours)" v-bind:myData="stats.topSongs_24hr" />
    <SingleStat title="Top Votes (This Year)" v-bind:myData="stats.topSongs_year" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SingleStat from "./SingleStat.vue";

export default {
  name: "Stats",
  components: {
    SingleStat
  },
  computed: mapGetters(["health", "stats"])
};
</script>