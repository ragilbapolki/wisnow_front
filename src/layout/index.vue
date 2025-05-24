<template>
  <div :class="classObj" class="app-wrapper">
    <div
      @click="handleClickOutside"
      class="drawer-bg"
      v-if="ctx.device==='mobile'&&ctx.sidebar.opened"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header': fixedHeader}">
        <Navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/index.vue'
import AppMain from './components/AppMain.vue'

import { isMobile, resizeHandler } from './mixin/ResizeHandler'
import { sctx, dispatch } from '@/store'

const ctx = inject('context')

const route = useRoute()

watch(
    () => route.path,
    () => {
        if (ctx.device === 'mobile' && ctx.sidebar.opened) {
            dispatch.sidebar.close({ withoutAnimation: false })
        }
    }
)

onMounted(() => {
    window.addEventListener('resize', resizeHandler)
    if (isMobile()) {
        ctx.device = 'mobile'
        dispatch.sidebar.close({ withoutAnimation: true })
    }
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
})

const classObj = computed(() => {
    return {
        hideSidebar: !ctx.sidebar.opened,
        openSidebar: ctx.sidebar.opened,
        withoutAnimation: ctx.sidebar.withoutAnimation,
        mobile: ctx.device === 'mobile',
    }
})

const fixedHeader = sctx.fixedHeader

const handleClickOutside = () => {
    dispatch.sidebar.close({ withoutAnimation: false })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.module.scss' as v;

@use '@/styles/mixin.scss' as *;

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{v.$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>
