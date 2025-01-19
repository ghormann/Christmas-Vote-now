<template>
  <div>Last Updated: {{ lastUpdatedTime }}</div>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { displayStore } from '@/stores/display'
const display = displayStore()
const { lastUpdatedTime } = storeToRefs(display)
</script>
