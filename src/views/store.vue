<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ ctx.userInfo.name }}</div>
    <div class="dashboard-text">name: {{ context.userInfo.name }}</div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { ctx } from '@/store'
const context = inject('context')

setTimeout(() => {
    ctx.userInfo.name = 'ctx name3'
    context.userInfo.name = 'context name3'
}, 3000)
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
