<template>
  <div>
    <div class="outer">
      <h2>About The Display</h2>
      <p class="gjh-padded">
        This will be our 19th year with a computer controlled Christmas Lights Display.
        This year we have 41,535 RGB bulbs that are synchronized to just over 30 minutes of music. Join us Christmas Eve
        as the neighborhood counts down to see the Clock hit zero.
      </p>
      <p class="gjh-padded">
        Names you text to the display are checked against a database of common first names from the IRS. If your name isn't on that
        list, there may be a delay in it appearing. Names are displayed below the clock soon after a text message is sent and are included
        in the main display every 5-10 minutes depending on queue size.
      </p>
      <p class="gjh-padded">
        Enjoying the display? Give us a like on
        <a
          href="https://www.facebook.com/HormannChristmas"
        >Facebook</a>. You can learn more about how it all
        works on our
        <a
          href="http://thehormanns.net/new/christmas.phtml"
        >main website</a>.
      </p>
    </div>
    <div class="outer">
      <h2>
        <a ref="faq-top">FAQs</a>
      </h2>
      <ol class="faq-list">
        <li
          v-for="faq in allFaqs"
          v-bind:key="faq.id"
          @click="scrollMeTo(faq.id)"
          class="gjh-fake-link"
        >{{faq.question}}</li>
      </ol>
      <h2>Answers</h2>
      <dl class="faq-detail gjh-padded">
        <template v-for="faq in allFaqs">
          <dt v-bind:key="faq.id">
            <a v-bind:ref="faq.id">{{faq.question}}</a>
            (<a class="gjh-fake-link" @click="scrollMeTo('faq-top')">Top</a>)
          </dt>
          <dd v-bind:key="faq.id2">{{faq.answer}}</dd>
        </template>
      </dl>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "InfoTab",
  computed: mapGetters(["allFaqs"]),
  methods: {
    scrollMeTo(refName) {
      var element = this.$refs[refName];
      //console.log(this.$refs);
      //console.log(element[0]);
      var top = 0;
      if (Array.isArray(element)) {
        top = element[0].offsetTop;
      } else {
        top = element.offsetTop;
      }
      //console.log(top);
      window.scrollTo(0, top);
    }
  }
};
</script>

<style scoped>
.faq-list {
  text-align: left;
}

dl {
  text-align: left;
}

dt {
    color: rgb(210,210,210);
}

dd {
  margin-bottom: 20px;
}

.outer p {
  text-align: left;
}
</style>
