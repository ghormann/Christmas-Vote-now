import Vuex from 'vuex';
import Vue from 'vue';
import display from './modules/display'

// load Vuewx
Vue.use(Vuex);

// store
export default new Vuex.Store({
    modules: {
        display
    }
});