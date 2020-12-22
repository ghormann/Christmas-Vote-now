<template>
  <div>
    <div>
      <table class="table table-striped table-sm table-bordered table-fit">
        <thead>
          <tr>
            <th scope="col">Unique Phones</th>
            <th scope="col">Last...</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in myData" v-bind:key="r.minutes">
            <td class="col-sm-auto">{{r.cnt}}</td>
            <td class="col-sm-6">{{r.label}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
//import { mapGetters } from "vuex";

export default {
  name: "UniquePhones",
  props: {
    myData: Array
  }
};
</script>
