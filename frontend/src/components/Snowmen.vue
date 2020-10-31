<template>
  <!-- more at https://bootstrap-vue.js.org/docs/components/alert -->
  <div class="outer">
    <h2>Snowmen Control</h2>
    <div><b>Current Snowman:</b> {{ currentSong.snowman }}</div>
    <b-container class="songs">
      <div class="intro-text">
        Use up arrows to vote.
        <div v-bind:class="votedClass">
          <span class="my-vote">*</span> My Vote.
        </div>
      </div>

      <b-row
        no-gutters
        v-for="who in allSnowmen"
        v-bind:key="who.id"
        class="song"
      >
        <b-col class="votes-col" cols="2">
          <div class="float-div">
            <img
              class="my-arrow-up"
              alt="vote up"
              src="./../assets/up.png"
              @click="localAddVote(who.id)"
            />
          </div>
          <span class="vote">{{ who.votes }}</span>
        </b-col>
        <b-col class="song-title" cols="10"
          >{{ who.name }}
          <span class="my-vote">{{ highlightMine(who.id) }}</span>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Snowmen",
  methods: {
    ...mapActions(["fetchState", "addSnowmanVote"]),
    localAddVote: function (id) {
      this.addSnowmanVote(id);
      this.$ga.event("SnowmanVote", "Add", id, 123);
    },
    highlightMine: function (id) {
      if (id == this.mySnowmen) {
        return "*";
      }
      return "";
    },
  },
  computed: {
    ...mapGetters(["allSnowmen", "currentSong", "mySnowmen"]),
    votedClass: function () {
      return {
        "d-none": this.mySnowmen == -1,
      };
    },
  },
};
</script>

<style scoped>
.votes-line {
  color: darkgreen;
  padding-top: 5px;
}
.votes-col {
  text-align: right;
}

.float-div {
  float: right;
  margin-right: 3px;
}

.my-vote {
  color: red;
}

.song-title {
  text-align: left;
}
.outer {
  border: 2px;
  border-style: solid;
  border-radius: 25px;
  margin: 2px;
}
.vote {
  font-style: normal;
  color: royalblue;
}

.song {
  position: relative;
  padding-bottom: 6px;
}

.my-arrow-up {
  height: 14px;
  cursor: pointer;
}

.my-arrow-down {
  height: 14px;
  cursor: pointer;
}
</style>
