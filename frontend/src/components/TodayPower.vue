<template>
    <span>
      Today we've used {{powerStats.kwh}} KWh to power the lights costing about ${{powerStats.dollars}}. 
      For the year, we've used {{stats.totalPower_year.kwh}} KWh to power the lights (or about ${{stats.totalPower_year.dollars}}.)
    </span>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "TodayPower",
  components: {},
  computed: mapGetters(["powerStats", "stats"]),
};
</script>

<style >
</style>

