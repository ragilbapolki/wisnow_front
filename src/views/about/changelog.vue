<template>
  <div class="changelog-container">
    <div class="title">{{ title }}</div>
    <VueComponent />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { attributes, VueComponent } from '../../../CHANGELOG.md'

const title = ref(attributes.title)
</script>

<style lang="scss" scoped>
.changelog {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
