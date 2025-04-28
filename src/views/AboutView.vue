<template>
  <div class="about">
    <span class="svg-container">
      <svg-icon icon="user"></svg-icon>
    </span>
    <h1>This is an about page</h1>
  </div>
</template>

<script setup>
</script>

<style>
body {
    background: #966;
}
</style>
<style lang="scss" scoped>
$dark_gray: #889aa4;

.svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
}

@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>

