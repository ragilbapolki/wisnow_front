<template>
  <div class="dashboard-container">
    <div class="dashboard-text">inject name: {{ context.userInfo.name }}</div>
    <div class="dashboard-text">inject len: {{ context.tagsView.length }}</div>
    <div class="dashboard-text">name: {{ ctx.userInfo.name }}</div>
    <div class="dashboard-text">len: {{ ctx.tagsView.length }}</div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { ctx, sctx, dispatch } from '@/store'

const context = inject('context')

setTimeout(function () {
    // ctx.tagsView.push({ a: 2 })

    dispatch.tagsView.add({ a: 3 })
    context.userInfo.name = 'chocho7'
    ctx.userInfo.name = 'chocho8'
}, 2000)
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
