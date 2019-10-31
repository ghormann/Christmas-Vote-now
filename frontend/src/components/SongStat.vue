<template>
  <div>
    <div>
      <div style="width:85%; margin:auto;">
      <h3>{{title}}</h3>
      </div>
      <table class="table table-striped table-sm table-bordered table-fit">
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
  name: "SongState",
  props: {
    myData: Array,
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

.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
  background-color: rgb(194, 231, 255);
}

h3 {
  color: rgb(194, 231, 255);
  background-color:darkblue;
}
</style>