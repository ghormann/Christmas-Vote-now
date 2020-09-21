<template>
    <span>
      Today we've used {{powerStats.kwh}} KWh to power the lights costing about ${{powerStats.dollars}}.
    </span>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "TodayPower",
  components: {},
  computed: mapGetters(["powerStats"]),
};
</script>

<style >
</style>

