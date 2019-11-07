import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import VueAnalytics from 'vue-analytics'

// More Bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

Vue.use(VueAnalytics, {
  id: 'UA-151724077-1',
  autoTracking: {
    screenview: true
  }
});

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
