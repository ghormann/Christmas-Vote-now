<script setup>
import { RouterLink, RouterView } from 'vue-router'
import CoolDisplaysLogo from './components/CoolDisplaysLogo.vue'
</script>

<template>
  <header>
    <img
      src="https://cooldisplays.net/picture.php?v=1732282525&pictid=252&width=800"
      class="img-fluid"
      alt="Our House"
    />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/info">Info</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <CoolDisplaysLogo />
  <div>
    Learn more at
    <a href="http://thehormanns.net/new/christmas.phtml">http://thehormanns.net</a>
  </div>
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

:global(body) {
  background-color: rgb(25, 25, 25);
}

.gjh-padded {
  padding: 5px;
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
