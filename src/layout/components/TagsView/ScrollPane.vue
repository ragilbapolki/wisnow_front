<template>
  <el-scrollbar
    :vertical="false"
    @wheel.native.prevent="handleScroll"
    class="scroll-container"
    ref="scrollContainer"
  >
    <slot />
  </el-scrollbar>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineExpose } from 'vue'

const emit = defineEmits()
const scrollContainer = ref(null)

const tagAndTagSpacing = 4 // tagAndTagSpacing

const scrollWrapper = computed(() => {
    return scrollContainer.value.$refs.wrapRef
})

onMounted(() => {
    scrollWrapper.value.addEventListener('scroll', emitScroll, true)
})
onBeforeUnmount(() => {
    scrollWrapper.value.removeEventListener('scroll', emitScroll)
})

const handleScroll = (e) => {
    const eventDelta = e.wheelDelta || -e.deltaY * 40
    const $scrollWrapper = scrollWrapper
    $scrollWrapper.value.scrollLeft = $scrollWrapper.value.scrollLeft + eventDelta / 4
}
const emitScroll = () => {
    emit('scroll')
}
defineExpose({
    moveToTarget: (currentTag, tagsDom) => {
        const $container = scrollContainer.value.$el
        const $containerWidth = $container.offsetWidth
        const $scrollWrapper = scrollWrapper
        const tagList = tagsDom.value

        let firstTag = null
        let lastTag = null

        // find first tag and last tag
        if (tagList.length > 0) {
            firstTag = tagList[0]
            lastTag = tagList[tagList.length - 1]
        }

        if (firstTag === currentTag) {
            $scrollWrapper.value.scrollLeft = 0
        } else if (lastTag === currentTag) {
            $scrollWrapper.value.scrollLeft = $scrollWrapper.value.scrollWidth - $containerWidth
        } else {
            // find preTag and nextTag
            const currentIndex = tagList.findIndex((item) => item === currentTag)
            const prevTag = tagList[currentIndex - 1]
            const nextTag = tagList[currentIndex + 1]

            // the tag's offsetLeft after of nextTag
            const afterNextTagOffsetLeft =
                nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

            // the tag's offsetLeft before of prevTag
            const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

            if (afterNextTagOffsetLeft > $scrollWrapper.value.scrollLeft + $containerWidth) {
                $scrollWrapper.value.scrollLeft = afterNextTagOffsetLeft - $containerWidth
            } else if (beforePrevTagOffsetLeft < $scrollWrapper.value.scrollLeft) {
                $scrollWrapper.value.scrollLeft = beforePrevTagOffsetLeft
            }
        }
    },
})
</script>

<style lang="scss" scoped>
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    ::v-deep {
        .el-scrollbar__bar {
            bottom: 0px;
        }
        .el-scrollbar__wrap {
            height: 49px;
        }
    }
}
</style>
