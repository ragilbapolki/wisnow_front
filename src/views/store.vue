<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ ctx.userInfo.name }}</div>
    <!-- <div class="dashboard-text">name: {{ context.userInfo.name }}</div> -->

    <span @click="goto">click</span>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { ctx } from '@/store'
// const context = inject('context')
setTimeout(() => {
    ctx.userInfo.name = ctx.userInfo.name + '1'
    // context.userInfo.name = 'context name5'
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
