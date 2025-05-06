<template>
  <div v-if="!item.hidden">
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <app-link :to="resolvePath(onlyOneChild.path)" v-if="onlyOneChild.meta">
        <el-menu-item
          :class="{'submenu-title-noDropdown':!isNest}"
          :index="resolvePath(onlyOneChild.path)"
        >
          <item
            :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu :index="resolvePath(item.path)" popper-append-to-body ref="subMenu" v-else>
      <template v-slot:title>
        <item :icon="item.meta.icon" :title="item.meta.title" v-if="item.meta" />
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
import Item from './Item.vue'
import AppLink from './Link.vue'
import path from 'path-browserify-esm'

import { ctx } from '@/store'

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    isNest: {
        type: Boolean,
        default: false,
    },
    basePath: {
        type: String,
        default: '',
    },
})

const onlyOneChild = ref(null)
const subMenu = ref(null)

onMounted(() => {
    // fixBugIniOS()
})

const hasOneShowingChild = (children = [], parent) => {
    const showingChildren = children.filter((item) => {
        if (item.hidden) {
            return false
        } else {
            // Temp set(will be used if only has one showing child)
            onlyOneChild.value = item
            return true
        }
    })
    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1) {
        return true
    }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
        return true
    }

    return false
}
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
