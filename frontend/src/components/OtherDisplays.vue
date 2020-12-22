 <template>
  <div class="outer">
    <h2 class="gjh-padded">Near By Displays</h2>
    <div class="gjh-padded">
      Here are some other displays in the area worth a visit. Those with 🎵 are
      also synchronized to music.
    </div>
    <b-container class="otherHouses">
      <b-row
        no-gutters
        class="house-row"
        v-for="house in otherDisplays"
        v-bind:key="house.displayid"
      >
        <div class="col-6">
          <a :href="house.url"><img :src="house.pict" class="img-fluid" /></a>
        </div>
        <div class="house-desc col-6" style="padding-left: 5px">
          <div>
            <a :href="house.url" class="house-name">{{ house.title }}</a>
            <span v-if="house.musical"> 🎵 </span>
          </div>
          <div>{{ house.distance }} Miles from us</div>
          <div>{{ house.city }}, {{ house.state }}</div>
        </div>
      </b-row>
    </b-container>
  </div>
  <!--outer -->
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "OtherDisplays",
  methods: {
    ...mapActions(["fetchOtherDisplays"]),
  },
  computed: {
    ...mapGetters(["otherDisplays"]),
  },
  created() {
    this.fetchOtherDisplays();
  },
};
</script>

<style scoped>
.house-desc {
  text-align: left;
  padding-left: 5px;
}
.house-name {
  font-size: 1.5em;
  text-decoration: underline;
}
.house-row {
  margin-bottom: 2em;
}
</style>