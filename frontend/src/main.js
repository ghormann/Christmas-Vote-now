import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { initAnalytics } from './analytics'
import { trackVisible } from './directives/trackVisible'

initAnalytics()

const app = createApp(App)

app.use(createPinia())
app.provide('bootstrap', bootstrap)
app.directive('track-visible', trackVisible)
app.use(router)

app.mount('#app')
