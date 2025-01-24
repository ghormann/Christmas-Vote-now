<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { displayStore } from '@/stores/display'
import CoolDisplaysLogo from './components/CoolDisplaysLogo.vue'
import LastUpdated from './components/LastUpdated.vue'
import GlobalStatus from './components/GlobalStatus.vue'
const display = displayStore()

onMounted(() => {
  // Code to run when the app is created
  console.log('App created!')
  display.initWS()
})
</script>

<template>
  <header>
    <img
      src="https://cooldisplays.net/picture.php?v=1732282525&pictid=252&width=800"
      class="img-fluid"
      alt="Our House"
    />
    <GlobalStatus />

    <div class="nav-wrapper">
      <nav>
        <RouterLink to="/">Vote</RouterLink>
        <RouterLink to="/names">Names</RouterLink>
        <RouterLink to="/info">Info</RouterLink>
        <RouterLink to="/stats">Stats</RouterLink>
        <RouterLink to="/other">Other</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <CoolDisplaysLogo />
  <div>
    Learn more at
    <a href="http://thehormanns.net/new/christmas.phtml">http://thehormanns.net</a>
  </div>
  <LastUpdated />
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(136, 136, 136);
}

h1,
h2,
h3,
h4 {
  color: white;
}

.gjh-tab {
  max-width: 800px;
  margin: 0 auto;
}

.nav-item a {
  color: royalblue;
}

.gjh-padded {
  padding: 5px;
}

.nav-wrapper {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 10px;
}

.router-link-active {
  background-color: white;
  text-transform: uppercase;
}

.nav-wrapper a {
  padding: 0.5rem 1rem;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid transparent;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.outer {
  border: 2px;
  border-style: solid;
  border-radius: 25px;
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 1em;
  margin-bottom: 1em;
  padding-bottom: 1em;
}

.gjh-fake-link {
  color: #007bff !important;
  cursor: pointer;
}

.intro-text {
  padding-bottom: 18px;
  font-style: oblique;
}
</style>
