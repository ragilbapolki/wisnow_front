<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ context.userInfo.name }}</div>
    <!-- <div class="dashboard-text">{{ context.tagsView.length }}</div> -->

    <div class="dashboard-text">{{ ctx.o.a }}</div>
    <div class="dashboard-text">{{ ctx.a[0] }}</div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue'
const context = inject('context')

const obj = { a: 1 }
const arr = [1]
const ctx = reactive({
    o: obj,
    a: arr,
})

setTimeout(function () {
    obj.a = 2
    arr[0] = 2

    // ctx.o.a = 2
    // ctx.a[0] = 2

    console.log(ctx.o, ctx.a)
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
