 <template>
  <div>
    <div v-bind:class="showDisplayHours">
      <h2>The Show is Off</h2>
      <div>The show runs from 5pm-11pm each night.</div>
    </div>
    <div v-bind:class="showDebug">
      <h2>In debug mode</h2>
      <div>The show is running in debug mode.</div>
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
    showDebug: function() {
      return {
        "alert": true,
        "alert-danger": true,
        "gjh-alert": true,
        "d-none": !this.currentSong.debug
      };
    },
    showDisplayHours: function() {
      return {
        "alert": true,
        "alert-danger": true,
        "gjh-alert": true,
        "d-none": this.currentSong.isDisplayHours
      };
    }
  }
};
</script>

<style scoped>
.gjh-alert {
  border: 2px;
  border-style: none;
  border-radius: 25px;
  margin: 0px;
}

.gjh-alert h2 {
  color: #721c24;
}

</style>