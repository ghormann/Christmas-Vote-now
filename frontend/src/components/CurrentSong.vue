 <template>
  <div class="outer" v-bind:class="showMe">
    <h2>Current Song</h2>
    <div  ><b>{{currentSongClean}}</b> {{timePart}}</div>
  </div>
  <!--outer -->
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "CurrentSong",
  computed: {
    ...mapGetters(["currentSong", "lastUpdatedTime"]),
    currentSongClean: function() {
      let c = this.currentSong;
      if ("idle" === c.status) {
        return "System Idle";
      } else {
        return c.title;
      }
    },
    showMe: function() {
      return {
        "d-none" : this.currentSong.status === "idle"
      };
    },

    timePart: function() {
      let c = this.currentSong;
      if (c.secondsRemaining <= 0) {
        return "";
      }

      return (
        this.convertTime(c.secondsRemaining) +
        " / " +
        this.convertTime(c.secondsTotal)
      );
    }
  },
  methods: {
    convertTime: function(input) {
      if (input <= 0) {
        return "";
      }
      let minutes = Math.floor(input / 60);
      let seconds = input % 60;
      return (
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0")
      );
    }
  }
};
</script>