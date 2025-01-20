<template>
  <span>
    Today we've used {{ parseFloat(powerStats.kwh).toFixed(1) }} KWh to power the lights costing
    about ${{ parseFloat(powerStats.dollars).toFixed(2) }}. For the year, we've used
    {{ parseFloat(stats.totalPower_year.kwh).toFixed(1) }} KWh to power the lights (or about ${{
      parseFloat(stats.totalPower_year.dollars).toFixed(2)
    }}).
  </span>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
const display = displayStore()
const { stats, powerStats } = storeToRefs(display)
</script>

<style></style>
