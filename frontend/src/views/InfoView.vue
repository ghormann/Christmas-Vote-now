<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { faqStore } from '@/stores/faqs'
import { displayStore } from '@/stores/display'

// access the `store` variable anywhere in the component ✨
const faq = faqStore()
const display = displayStore()
const { allFaqs } = storeToRefs(faq)
const { availSongCount, totalDurationMinutes, numberOfYears, nameEstimates } = storeToRefs(display)

onMounted(() => {
  display.fetchState()
})

function scrollMeTo(refName) {
  const position = document.getElementById(refName).offsetTop
  window.scrollTo({ top: position, behavior: 'smooth' })
}
</script>
<template>
  <div>
    <div class="outer">
      <h2>About The Display</h2>
      <p class="gjh-padded">
        This will be our {{ numberOfYears }}<sup>th</sup> year with a computer controlled Christmas
        Lights Display. This year we have 75,805 RGB bulbs that are synchronized to
        {{ totalDurationMinutes }} minutes of music
        <em>({{ availSongCount }} unique songs).</em> Join us Christmas Eve as the neighborhood
        counts down to see the Clock hit zero.
      </p>
      <p class="gjh-padded">
        <a href="/names">Names</a> supplied via text mesage are checked against a database of common
        first names from the IRS. If your name isn't on that list, there may be a delay in it
        appearing. Names are displayed below the clock soon after a text message is sent and are
        included in the main display every 8-12 minutes depending on queue size.
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
        <a href="http://thehormanns.net/new/christmas.phtml">main website</a> or give us a like on
        <a href="https://www.facebook.com/HormannChristmas">Facebook</a>.
      </p>
    </div>
    <div class="outer">
      <h2>
        <a id="faq-top" ref="faq-top">FAQs</a>
      </h2>
      <ol class="faq-list">
        <li
          v-for="faq in allFaqs"
          v-bind:key="faq.id"
          @click="scrollMeTo(faq.id)"
          class="gjh-fake-link"
        >
          {{ faq.question }}
        </li>
      </ol>
      <h2>Answers</h2>
      <dl class="faq-detail gjh-padded">
        <template v-bind:key="faq.id" v-for="faq in allFaqs">
          <dt>
            {{ faq.question }}
            <a v-bind:id="faq.id" v-bind:ref="faq.id">{{ faq.questcomponentsion }}</a>
            (<a class="gjh-fake-link" @click="scrollMeTo('faq-top')">Top</a>)
          </dt>
          <dd><div v-html="faq.answer"></div></dd>
        </template>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.faq-list {
  text-align: left;
}

dl {
  text-align: left;
}

dt {
  color: rgb(210, 210, 210);
}

dd {
  margin-bottom: 20px;
}

.outer p {
  text-align: left;
}
</style>
