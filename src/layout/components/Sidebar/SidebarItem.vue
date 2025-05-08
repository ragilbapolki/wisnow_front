<template>
  <div v-if="!item.hidden">
    <template v-if=" !alwaysShow && theOnlyOneChild && !theOnlyOneChild.children">
      <app-link :to="resolvePath(theOnlyOneChild.path)" v-if="theOnlyOneChild.meta">
        <el-menu-item :index="resolvePath(theOnlyOneChild.path)" class="submenu-title-noDropdown">
          <template v-if="theOnlyOneChild.meta.icon">
            <el-icon class="el-menu-icon" v-if="theOnlyOneChild.meta.icon.includes('el-icon')">
              <i-ep-MoreFilled />
            </el-icon>

            <svg-icon :icon="theOnlyOneChild.meta.icon" v-else />
          </template>
          <template #title v-if="theOnlyOneChild.meta.title">
            <span>{{theOnlyOneChild.meta.title}}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu :index="resolvePath(item.path)" popper-append-to-body ref="subMenu" v-else>
      <template #title>
        <template v-if="item.meta.icon">
          <el-icon class="el-menu-icon" v-if="item.meta.icon.includes('el-icon')">
            <i-ep-MoreFilled />
          </el-icon>

          <svg-icon :icon="item.meta.icon" v-else />
        </template>
        <template v-if="item.meta.title">
          <span>{{item.meta.title}}</span>
        </template>
      </template>
      <sidebar-item
        :base-path="resolvePath(child.path)"
        :is-nest="true"
        :item="child"
        :key="child.path"
        class="nest-menu"
        v-for="child in item.children"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'
import path from 'path-browserify-esm'

import { ctx } from '@/store'

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    basePath: {
        type: String,
        default: '',
    },
})

const subMenu = ref(null)

onMounted(() => {
    // fixBugIniOS()
})

/** 是否始终显示根菜单 */
const alwaysShow = props.item.meta?.alwaysShow

/** 显示的子菜单 */
const showingChildren = props.item.children?.filter((child) => !child.meta?.hidden) ?? []

/** 唯一的子菜单项 */
const theOnlyOneChild = (function () {
    const number = showingChildren.length
    switch (true) {
        case number > 1:
            return null
        case number === 1:
            return showingChildren[0]
        default:
            return { ...props.item, path: '' }
    }
})()

const resolvePath = (routePath) => {
    if (isExternal(routePath)) {
        return routePath
    }
    if (isExternal(props.basePath)) {
        return props.basePath
    }
    // return path.resolve(props.basePath, routePath)
    return path.join(props.basePath, routePath)
}

const fixBugIniOS = () => {
    if (subMenu.value) {
        ///  handleMouseleave 似乎是有问题的
        const handleMouseleave = subMenu.value.handleMouseleave
        subMenu.value.handleMouseleave = (e) => {
            if (ctx.device === 'mobile') {
                return
            }
            handleMouseleave(e)
        }
    }
}
</script>
