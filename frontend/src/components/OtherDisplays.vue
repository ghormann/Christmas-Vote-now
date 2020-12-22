 <template>
  <div class="outer">
    <h2>Near By Displays</h2>
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
    ...mapGetters(["currentSong", "lastUpdatedTime"]),
  },
    created() {
    this.fetchOtherDisplays();
    }
};
</script>

<style scoped>
</style>