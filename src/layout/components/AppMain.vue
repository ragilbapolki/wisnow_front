<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition mode="out-in" name="fade-transform">
        <div>
          <keep-alive>
            <component :is="Component" :key="route.path" v-if="route.meta.keepAlive" />
          </keep-alive>
          <component :is="Component" :key="route.path" v-if="!route.meta.keepAlive" />
        </div>
      </transition>
    </router-view>
  </section>
</template>

<style scoped lang="scss">
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
    box-sizing: content-box;
}
.fixed-header + .app-main {
    padding-top: 50px;
}
.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }
    .fixed-header + .app-main {
        padding-top: 84px;
    }
}
</style>

