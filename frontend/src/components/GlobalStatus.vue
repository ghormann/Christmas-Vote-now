 <template>
  <div class="outer gjh-warning" v-bind:class="showMe">
    <h2>Website is down</h2>
    <div>Currently down for maintainence</div>
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
        "d-none": this.currentSong.enabled
      };
    }
  }
};
</script>

<style scoped>
.gjh-warning {
    background-color: red;
    color: white;
}
</style>