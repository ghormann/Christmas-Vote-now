<template>
  <!-- more at https://bootstrap-vue.js.org/docs/components/alert -->
  <div class="outer">
    <h2>Available Song Queue</h2>
    <b-container class="songs">
      <div class="votes-line">
        Votes Remaining:
        <b>{{votesRemaining}}</b>
      </div>
      <div class="alert" v-bind:class="errorClass" role="alert">{{lastMessage}}</div>
      <div class="intro-text">Use up/down arrows to vote.</div>

      <b-row no-gutters v-for="song in allAvailSongs" v-bind:key="song.id" class="song">
        <b-col class="votes-col" cols="2">
          <div class="float-div">
            <table cellspacing="0" cellpadding="0" class="my-table">
              <tr>
                <td class="votes">{{song.votes}}</td>
                <td>
                  <img class="my-arrow-up" src="./../assets/up.png" @click="addVote(song.id)" />
                  <img
                    class="my-arrow-down"
                    src="./../assets/down.png"
                    @click="removeVote(song.id)"
                  />
                </td>
              </tr>
            </table>
          </div>
        </b-col>
        <b-col class="song-title" cols="10">{{song.title}}</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AvailSongList",
  methods: {
    ...mapActions(["fetchState", "addVote", "removeVote", "initWS"])
  },
  computed: {
    ...mapGetters(["allAvailSongs", "votesRemaining", "lastMessage"]),
    errorClass: function() {
      return {
        "alert-danger": true,
        "d-none" : this.lastMessage == "OK"
      };
    }
  },
  created() {
    this.fetchState();
    this.initWS();
    setInterval(this.fetchState, 10000);
  }
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

.my-table {
  border: 0px;
  table-layout: fixed;
  border-style: none;
  line-height: 80%; /* Pull up/down images together */
}
.my-table td {
  padding: 0px;
  margin: 0;
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
.votes {
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
