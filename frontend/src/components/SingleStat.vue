<template>
  <div>
    <div class="outer">
      <h2>{{title}}</h2>
      <table class="table table-striped table-fit">
        <thead>
          <tr>
            <th scope="col">Votes</th>
            <th scope="col">Song</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in myData" v-bind:key="r.title">
            <td class="col-sm-auto">{{r.cnt}}</td>
            <td class="col-sm-6">{{r.title}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
//import { mapGetters } from "vuex";

export default {
  name: "SingleState",
  props: {
    myData: Object,
    title: String
  }
};
</script>

<style local>
/* table-fit causes table to compress */
table.table-fit {
  margin: 0 auto; /*Centers table */
  width: auto !important;
  table-layout: auto !important;
}
table.table-fit thead th,
table.table-fit tfoot th {
  width: auto !important;
}
table.table-fit tbody td,
table.table-fit tfoot td {
  width: auto !important;
}
</style>