<script setup>
import { computed, nextTick, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { faqStore } from '@/stores/faqs'
import { displayStore } from '@/stores/display'
import { factsStore } from '@/stores/facts'
import { trackEvent } from '@/analytics'
import { HORMANNS_STORY_URL, ordinal, techUrl } from '@/lib/site'

const faq = faqStore()
const display = displayStore()
const factStore = factsStore()
const route = useRoute()
const { allFaqs } = storeToRefs(faq)
const { availSongCount, totalDurationMinutes, nameEstimates } = storeToRefs(display)
const { facts } = storeToRefs(factStore)

// Questions people ask from their car come first; the rest keep the server's order.
const FIRST_FAQS = [
  'hear-the-music',
  'radio-out-of-sync',
  'how-voting-works',
  'pick-next-song',
  'name-in-lights',
  'light-tunnel',
  'parking',
  'stay-in-car',
]

const orderedFaqs = computed(() => {
  const rank = (f) => {
    const i = FIRST_FAQS.indexOf(f.id)
    return i === -1 ? FIRST_FAQS.length : i
  }
  return [...allFaqs.value].sort((a, b) => rank(a) - rank(b))
})

const yearText = computed(() => (facts.value.years ? ordinal(facts.value.years) : ''))
const pixelText = computed(() =>
  facts.value.pixelCount ? facts.value.pixelCount.toLocaleString('en-US') : '',
)

// /info#how-voting-works opens that answer and scrolls to it.
async function openFromHash() {
  const id = route.hash.slice(1)
  if (!id) return
  await nextTick()
  const el = document.getElementById(id)
  if (el && el.tagName === 'DETAILS') {
    el.open = true
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function onToggle(event, faqId) {
  if (event.target.open) {
    trackEvent('faq_open', { faq_id: faqId })
  }
}

watch([orderedFaqs, () => route.hash], openFromHash)

onMounted(() => {
  display.fetchState()
  factStore.fetchFacts()
  faq.fetchFaqs().then(openFromHash)
})
</script>
<template>
  <div>
    <div class="outer">
      <h2>About The Display</h2>
      <p class="gjh-padded">
        <template v-if="yearText">This will be our {{ yearText }} year</template>
        <template v-else>This is another year</template> with a computer controlled Christmas Lights
        Display. This year we have
        <template v-if="pixelText">{{ pixelText }}</template>
        <template v-else>thousands of</template>
        RGB bulbs that are synchronized to {{ totalDurationMinutes }} minutes of music
        <em>({{ availSongCount }} unique songs).</em> Join us Christmas Eve as the neighborhood
        counts down to see the <a :href="techUrl('clock')">Clock</a> hit zero.
      </p>
      <p class="gjh-padded">
        <RouterLink to="/names">Names</RouterLink> supplied via text message are checked against a
        database of common first names from the Social Security Administration. If your name isn't
        on that list, there may be a delay in it appearing. Names are displayed below the clock soon
        after a text message is sent and are included in the main display every 8-12 minutes
        depending on queue size.
        <i>(Names are estimated to be shown {{ nameEstimates.message }}.)</i>
      </p>
      <p class="gjh-padded">
        In partnership with the Southwest Ohio Valley Women's Club, we are accepting donations of
        non-perishable food, grocery gift cards or cash in support of local food banks. Donations
        can also be made via
        <a href="https://account.venmo.com/u/Verna-Heaney">Venmo</a>.
        <em>(Verna is the treasurer.)</em>
      </p>
      <p class="gjh-padded">
        You can learn more about how it all works on our
        <a :href="HORMANNS_STORY_URL">main website</a> or give us a like on
        <a href="https://www.facebook.com/HormannChristmas">Facebook</a>.
      </p>
    </div>
    <div class="outer">
      <h2>FAQs</h2>
      <div class="faq-list">
        <details
          v-for="item in orderedFaqs"
          v-bind:key="item.id"
          v-bind:id="item.id"
          class="faq"
          @toggle="onToggle($event, item.id)"
        >
          <summary>{{ item.question }}</summary>
          <div class="answer" v-html="item.answer"></div>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer p {
  text-align: left;
}

.faq-list {
  text-align: left;
  padding: 0 10px;
}

.faq {
  border-bottom: 1px solid rgb(60, 60, 60);
  scroll-margin-top: 8px;
}
.faq:last-child {
  border-bottom: 0;
}

summary {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 8px 0;
  color: rgb(210, 210, 210);
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker {
  display: none;
}
summary::after {
  content: '+';
  margin-left: auto;
  font-size: 1.4em;
  line-height: 1;
  color: royalblue;
}
.faq[open] summary::after {
  content: '\2212';
}

.answer {
  padding: 0 0 14px;
}
</style>
