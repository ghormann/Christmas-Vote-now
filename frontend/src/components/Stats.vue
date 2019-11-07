<template>
  <div>
    <div class="outer gjh-padded">
      <h1>Statistics</h1>
      <div>
        So you like statistics? So do we...  The statistics are refreshed every few minutes.
      </div>
      <p>
        <i>Stats Updated: {{health.lastStatsTime}}</i>
      </p>
    </div>
    <div class="outer">
      <h1>Top Voted Songs</h1>
      <hr />
      <VoteStat title="Last Hour" v-bind:myData="stats.topSongs_1hr" />
      <br />
      <br />
      <VoteStat title="Last 24 hours" v-bind:myData="stats.topSongs_24hr" />
      <br />
      <br />
      <VoteStat title="This Year" v-bind:myData="stats.topSongs_year" />
    </div>
    <div class="outer">
      <h1>Most Played Songs</h1>
      <hr />
      <PlayedSongStat title="Last 24 hours" v-bind:myData="stats.topPlayedSongs_24hr" />
      <br />
      <br />
      <PlayedSongStat title="This Year" v-bind:myData="stats.topPlayedSongs_year" />
    </div>
    <div class="outer">
      <h1>Top Names</h1>
      <hr />
      <NameStat title="Last Hour" v-bind:myData="stats.topNames_1hr" />
      <br />
      <br />
      <NameStat title="Last 24 hours" v-bind:myData="stats.topNames_24hr" />
      <br />
      <br />
      <NameStat title="This Year" v-bind:myData="stats.topNames_year" />
    </div>
    <div class="outer">
      <h1>Unique # of Voters</h1>
      <hr />
      <UniqueVoters v-bind:myData="stats.topVoters" />
      </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VoteStat from "./stats/VoteStat.vue";
import NameStat from "./stats/NameStat.vue";
import PlayedSongStat from "./stats/PlayedSongStat.vue";
import UniqueVoters from "./stats/UniqueVoters.vue";

export default {
  name: "Stats",
  components: {
    VoteStat,
    NameStat,
    PlayedSongStat,
    UniqueVoters
  },
  computed: mapGetters(["health", "stats"])
};
</script>

<style >
/* table-fit causes table to compress */
table.table-fit {
  margin: 0 auto; /*Centers table */
  width: auto !important;
  table-layout: auto !important;
}
table.table-fit thead th,
table.table-fit tfoot th {
  width: auto !important;
}
table.table-fit tbody td,
table.table-fit tfoot td {
  width: auto !important;
}

.table-striped {
  background-color: darkred;
}

.table-striped > thead > tr > th {
  color: rgb(200, 200, 200);
  background-color: rgb(25,25,25);
  font-weight: bold;
}

.table-striped > tbody > tr > td,
.table-striped > tbody > tr > th {
  color: rgb(200, 200, 200);

}
.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
  background-color: darkgreen;
  color: rgb(200, 200, 200);
}


h3 {
  color: rgb(194, 231, 255);
  background-color:rgb(0, 0, 99) ;
}
</style>


<style scoped>
hr {
  border: 0.1rem solid gray;
  width: 85%;
}
</style>

