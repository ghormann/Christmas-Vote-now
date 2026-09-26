<script setup>
import { storeToRefs } from 'pinia'
import { otherDisplayStore } from '@/stores/other_displays'
import { trackEvent } from '@/analytics'
import { directionsUrl } from '@/lib/site'
// access the `store` variable anywhere in the component ✨
const others = otherDisplayStore()
const { otherDisplays, otherDisplayCount } = storeToRefs(others)
others.fetchOtherDisplays()

const trackDisplayClick = function (house) {
  trackEvent('other_display_click', {
    display_id: house.displayid,
    display_title: house.title,
    distance_miles: house.distance,
    musical: house.musical,
  })
}

const trackDirectionsClick = function (house) {
  trackEvent('other_display_directions', {
    display_id: house.displayid,
    display_title: house.title,
    distance_miles: house.distance,
  })
}
</script>

<template>
  <div class="outer">
    <h2 class="gjh-padded">Near By Displays</h2>
    <div class="gjh-padded">
      Here are {{ otherDisplayCount }} displays in the area worth a visit. Those with &#127930; are
      also synchronized to music.
    </div>
    <div class="containerotherHouses">
      <div class="row house-row" v-for="house in otherDisplays" v-bind:key="house.displayid">
        <div class="col-6">
          <a :href="house.url" @click="trackDisplayClick(house)"
            ><img :src="house.pict" class="img-fluid"
          /></a>
        </div>
        <div class="house-desc col-6" style="padding-left: 5px">
          <div>
            <a :href="house.url" class="house-name" @click="trackDisplayClick(house)">{{
              house.title
            }}</a>
            <span v-if="house.musical"> &#127930; </span>
          </div>
          <div>{{ house.distance }} Miles from us</div>
          <div>{{ house.city }}, {{ house.state }}</div>
          <a
            :href="directionsUrl(house)"
            class="directions"
            target="_blank"
            rel="noopener"
            @click="trackDirectionsClick(house)"
            >Directions</a
          >
        </div>
      </div>
    </div>
  </div>
  <!--outer -->
</template>

<style scoped>
.house-desc {
  text-align: left;
  padding-left: 5px;
}
.house-name {
  font-size: 1.5em;
  text-decoration: underline;
}
.directions {
  display: inline-block;
  margin-top: 2px;
  padding: 0 8px;
  font-size: 0.85em;
  border: 1px solid royalblue;
  border-radius: 10px;
}
.house-row {
  margin-bottom: 2em;
}
</style>
