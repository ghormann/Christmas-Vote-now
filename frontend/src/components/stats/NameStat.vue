<template>
  <div>
    <div>
      <div style="width:85%; margin:auto;">
      <h3>{{title}}</h3>
      </div>
      <table class="table table-striped table-sm table-bordered table-fit">
        <thead>
          <tr>
            <th scope="col">Count</th>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in myData" v-bind:key="r.title">
            <td class="col-sm-auto">{{r.cnt}}</td>
            <td class="col-sm-6">{{r.name}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
//import { mapGetters } from "vuex";

export default {
  name: "NameStat",
  props: {
    myData: Array,
    title: String
  }
};
</script>

