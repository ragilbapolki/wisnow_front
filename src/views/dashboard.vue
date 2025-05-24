<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ ctx.userInfo.name }}</div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
const ctx = inject('context')
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
