<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
import { techUrl } from '@/lib/site'
import VoteStat from '@/components/stats/VoteStat.vue'
import SnowmenVoteStat from '@/components/stats/SnowmenVoteStats.vue'
import PlayedSongStat from '@/components/stats/PlayedSongStat.vue'
import NameStat from '@/components/stats/NameStat.vue'
import ButtonStat from '@/components/stats/ButtonStat.vue'
import UniqueVoters from '@/components/stats/UniqueVoters.vue'
import UniquePhones from '@/components/stats/UniquePhones.vue'
import MaxCarsStat from '@/components/stats/MaxCarsStat.vue'

const display = displayStore()
const { health, stats, cars, powerStats, availSongCount, totalDurationMinutes } =
  storeToRefs(display)

const AT_FORMAT = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }

const num = (n) => Number(n || 0).toLocaleString('en-US')

const tiles = computed(() => [
  {
    value: num(cars.value['total-cars']),
    label: 'Cars watching now',
    note: 'Estimated',
    link: techUrl('car-counter'),
    linkText: 'How we count cars',
  },
  {
    value: `${parseFloat(powerStats.value.kwh).toFixed(1)} kWh`,
    label: 'Power used today',
    note: `About $${parseFloat(powerStats.value.dollars).toFixed(2)}`,
    link: techUrl('info-board'),
    linkText: 'How we measure it',
  },
  {
    value: `${parseFloat(stats.value.totalPower_year.kwh).toFixed(1)} kWh`,
    label: 'Power used this year',
    note: `About $${parseFloat(stats.value.totalPower_year.dollars).toFixed(2)}`,
  },
  {
    value: num(availSongCount.value),
    label: 'Songs in the show',
    note: `${totalDurationMinutes.value} minutes of music`,
  },
  {
    value: num(stats.value.total_buttons),
    label: 'Tunnel button presses',
    note: 'This year',
    link: techUrl('tunnel'),
    linkText: 'About the tunnel',
  },
  {
    value: num(stats.value.total_phones),
    label: 'Phones that sent a name',
    note: 'This year',
    link: techUrl('text-message'),
    linkText: 'How names work',
  },
])

const maxCarsData = computed(() => {
  const periods = [
    { key: 'maxCars_1hr', label: 'Last Hour' },
    { key: 'maxCars_8hr', label: 'Last 8 hours' },
    { key: 'maxCars_24hr', label: 'Last 24 hours' },
    { key: 'maxCars_year', label: 'This Year' },
  ]
  return periods
    .filter((p) => stats.value[p.key])
    .map((p) => ({
      label: p.label,
      maxCars: stats.value[p.key].maxCars,
      at: new Date(stats.value[p.key].at).toLocaleString('en-US', AT_FORMAT),
    }))
})
</script>

<template>
  <div>
    <div class="outer gjh-padded">
      <h1>Statistics</h1>
      <div class="tiles">
        <div v-for="t in tiles" :key="t.label" class="tile">
          <div class="tile-value">{{ t.value }}</div>
          <div class="tile-label">{{ t.label }}</div>
          <div v-if="t.note" class="tile-note">{{ t.note }}</div>
          <a v-if="t.link" :href="t.link" class="tile-link">{{ t.linkText }}</a>
        </div>
      </div>
      <div class="stats-intro">
        <div class="stats-intro-inner">
          <p style="margin-top: 1em">
            Want more Statistics? We got them! Here is some other interesting data as of
            {{ health.lastStatsTime }}:
          </p>
        </div>
      </div>
      <div style="display: flex; justify-content: center">
        <ul style="text-align: left; min-width: 280px">
          <li>
            <a href="#VotedSongs">Top&nbsp;Voted&nbsp;Songs</a>
          </li>
          <li>
            <a href="#VotedSnowmen">Top&nbsp;Voted&nbsp;Snowmen</a>
          </li>
          <li>
            <a href="#PlayedSongs">Most&nbsp;Played&nbsp;Songs</a>
          </li>
          <li>
            <a href="#TopNames">Most&nbsp;Requested&nbsp;Names</a>
          </li>
          <li>
            <a href="#TopButtons">Most&nbsp;Pressed&nbsp;Button</a>
          </li>
          <li>
            <a href="#UniqueVoters">#&nbsp;of&nbsp;Unique&nbsp;Voters</a>
          </li>
          <li>
            <a href="#UniquePhone">#&nbsp;of&nbsp;Phones&nbsp;adding&nbsp;name</a>
          </li>
          <li>
            <a href="#MaxCars">Max&nbsp;Cars&nbsp;Viewing</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="outer" v-track-visible="'VotedSongs'">
      <h1>
        <a name="VotedSongs">Top Voted Songs</a>
      </h1>
      <hr />
      <VoteStat title="Last 15 Min" v-bind:myData="stats.topSongs_15min" />
      <br />
      <br />
      <VoteStat title="Last Hour" v-bind:myData="stats.topSongs_1hr" />
      <br />
      <br />
      <VoteStat title="Last 24 hours" v-bind:myData="stats.topSongs_24hr" />
      <br />
      <br />
      <VoteStat title="This Year" v-bind:myData="stats.topSongs_year" />
    </div>

    <div class="outer" v-track-visible="'VotedSnowmen'">
      <h1>
        <a name="VotedSnowmen">Top Voted Snowmen</a>
      </h1>
      <hr />
      <SnowmenVoteStat title="Last Hour" v-bind:myData="stats.topSnowmen_1hr" />
      <br />
      <br />
      <SnowmenVoteStat title="Last 24 hours" v-bind:myData="stats.topSnowmen_24hr" />
      <br />
      <br />
      <SnowmenVoteStat title="This Year" v-bind:myData="stats.topSnowmen_year" />
    </div>

    <div class="outer" v-track-visible="'PlayedSongs'">
      <h1>
        <a name="PlayedSongs">Most Played Songs</a>
      </h1>
      <hr />
      <PlayedSongStat title="Last 24 hours" v-bind:myData="stats.topPlayedSongs_24hr" />
      <br />
      <br />
      <PlayedSongStat title="This Year" v-bind:myData="stats.topPlayedSongs_year" />
    </div>

    <div class="outer" v-track-visible="'TopNames'">
      <h1>
        <a name="TopNames">Most Requested Names</a>
      </h1>
      <hr />
      <NameStat title="Last Hour" v-bind:myData="stats.topNames_1hr" />
      <br />
      <br />
      <NameStat title="Last 24 hours" v-bind:myData="stats.topNames_24hr" />
      <br />
      <br />
      <NameStat title="This Year" v-bind:myData="stats.topNames_year" />
    </div>
    <div class="outer" v-track-visible="'TopButtons'">
      <h1>
        <a name="TopButtons">Most Pressed Buttons</a>
      </h1>
      <hr />
      <ButtonStat title="Last Hour" v-bind:myData="stats.topButton_1hr" />
      <br />
      <br />
      <ButtonStat title="Last 24 hours" v-bind:myData="stats.topButton_24hr" />
      <br />
      <br />
      <ButtonStat title="This Year" v-bind:myData="stats.topButton_year" />
    </div>
    <div class="outer" v-track-visible="'UniqueVoters'">
      <h1>
        <a name="UniqueVoters">Unique # of Voters</a>
      </h1>
      <hr />
      <UniqueVoters v-bind:myData="stats.topVoters" />
    </div>
    <div class="outer" v-track-visible="'UniquePhone'">
      <h1 id="UniquePhoneHeader">
        <a name="UniquePhone">Unique # of Phones</a>
      </h1>
      <i>(That requested a name)</i>
      <hr />
      <UniquePhones v-bind:myData="stats.topPhones" />
    </div>
    <div class="outer" v-track-visible="'MaxCars'">
      <h1>
        <a name="MaxCars">Max Cars Viewing</a>
      </h1>
      <i>(Estimated)</i>
      <hr />
      <MaxCarsStat v-bind:myData="maxCarsData" />
    </div>
  </div>
</template>

<style>
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
  background-color: rgb(25, 25, 25);
  font-weight: bold;
}

.table-striped > tbody > tr > td,
.table-striped > tbody > tr > th {
  color: rgb(200, 200, 200);
  background-color: darkred;
}
.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
  background-color: darkgreen;
  color: rgb(200, 200, 200);
}

h3 {
  color: rgb(194, 231, 255);
  background-color: rgb(0, 0, 99);
}
</style>

<style scoped>
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  max-width: 640px;
  margin: 0 auto;
  padding: 0 4px;
}
.tile {
  padding: 10px 8px;
  border: 1px solid rgb(70, 70, 70);
  border-radius: 12px;
  background: rgb(34, 34, 34);
  line-height: 1.3;
}
.tile-value {
  font-size: 1.6em;
  color: white;
  font-variant-numeric: tabular-nums;
}
.tile-label {
  color: rgb(210, 210, 210);
}
.tile-note {
  font-size: 0.85em;
}
.tile-link {
  display: inline-block;
  font-size: 0.85em;
  padding: 4px 0 0;
}
hr {
  border: 0.1rem solid gray;
  width: 85%;
}
.stats-intro-inner {
  max-width: 500px;
}
.stats-intro {
  display: flex;
  justify-content: center;
}
#UniquePhoneHeader {
  margin-bottom: 0px;
}
</style>
