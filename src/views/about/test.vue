<template>
  <div>
    <div class="text">name: {{ context.userInfo.name }}</div>
    <!-- <div class="text">{{ context.tagsView.length }}</div> -->

    <div class="text">{{ ctx.o.a }}</div>
    <div class="text">{{ ctx.a[0] }}</div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue'
// import { ctx as context } from '@/store'
const context = inject('context') // import store 和 inject的方式是一样的效果

const obj = { a: 1 }
const arr = [1]
const ctx = reactive({
    o: obj,
    a: arr,
})

setTimeout(function () {
    // 下面的修改不会引起页面变化
    obj.a = 2
    arr[0] = 2

    // 这样才可以
    // ctx.o.a = 2
    // ctx.a[0] = 2

    console.log(ctx.o.a, ctx.a[0]) // 这里的值始终是更新了的
}, 3000)
</script>

<style lang="scss" scoped>
.text {
    margin: 30px;
    font-size: 30px;
    line-height: 46px;
}
</style>
