import Vuex from 'vuex';
import Vue from 'vue';
import display from './modules/display'
import faq from './modules/faq'
import otherDisplays from './modules/otherDisplays'

// load Vuewx
Vue.use(Vuex);

// store
export default new Vuex.Store({
    modules: {
        display,
        faq,
        otherDisplays,
    }
});