 <template>
  <div class="outer" v-bind:class="showMe">
    <h2>The show is off</h2>
    <div>The show runs from 5pm-11pm each night.</div>
  </div>
  <!--outer -->
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "ShowHours",
  computed: {
    ...mapGetters(["currentSong"]),
    showMe: function() {
      return {
        "d-none": this.currentSong.isDisplayHours
      };
    }
  }
};
</script>