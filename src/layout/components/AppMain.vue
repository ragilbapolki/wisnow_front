<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <keep-alive v-if="$route.meta.keepAlive">
        <transition mode="out-in" name="fade-transform">
          <component :is="Component" />
        </transition>
      </keep-alive>

      <transition mode="out-in" name="fade-transform" v-if="!$route.meta.keepAlive">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}
.fixed-header + .app-main {
    padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>
