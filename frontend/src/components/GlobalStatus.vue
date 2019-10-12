 <template>
  <div class="outer gjh-warning" v-bind:class="showMe">
    <div v-bind:class="showDisabled">
      <h2>Website is down</h2>
      <div>Currently down for maintainence</div>
    </div>
    <div v-bind:class="showError">
      <h2>System Error</h2>
      <div>The show is currently experiencing issues. Some features may not be working.</div>
    </div>
  </div>
  <!--outer -->
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "ShowHours",
  computed: {
    ...mapGetters(["currentSong", "health"]),
    showError: function() {
      return {
        "d-none": this.health.status == "ALL_OK"
      };
    },
    showDisabled: function() {
      return {
        "d-none": this.currentSong.enabled
      };
    },
    showMe: function() {
      return {
        "d-none": this.currentSong.enabled && this.health.status == "ALL_OK"
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