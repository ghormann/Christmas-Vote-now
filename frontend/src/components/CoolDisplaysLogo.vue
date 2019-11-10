<template>
  <div class="coolLogo">
    <a href="https://cooldisplays.net/index.php?page=single&id=1&width=400">
      <b-img fluid alt ="CoolDisplays Logo" src="https://cooldisplays.net/picture.php?logo=1&width=400"></b-img>
    </a>
  </div>
</template>

<script>
export default {
  name: "CoolDisplaysLogo"
};
</script>

<style scoped>
.coolLogo {
  margin: 2px;
  display: inline-block;
  padding: 5px 15px 5px 15px;
  *display: inline; /* IE6 Hack */
}
img.coolLogo {
  border: 0px;
}
</style>
