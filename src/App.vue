<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import { inject } from 'vue'
const ctx = inject('context')
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" height="125" src="@/assets/logo.svg" width="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>-->
  {{ctx.userInfo?.name}}
  <RouterView />
</template>

<style scoped>
</style>
