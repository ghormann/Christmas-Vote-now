<template>
  <div>Last Updated: {{lastUpdatedTime}}</div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "LastUpdated",
  computed: mapGetters(["lastUpdatedTime"])
};
</script>