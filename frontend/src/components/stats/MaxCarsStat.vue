<template>
  <div>
    <div>
      <table class="table table-striped table-sm table-bordered table-fit">
        <thead>
          <tr>
            <th scope="col">Last...</th>
            <th scope="col">Max Cars</th>
            <th scope="col">At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in myData" v-bind:key="r.label">
            <td class="col-sm-6">{{ r.label }}</td>
            <td class="col-sm-auto">{{ r.maxCars }}</td>
            <td class="col-sm-6">{{ r.at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaxCarsStat',
  props: {
    myData: Array,
  },
}
</script>
