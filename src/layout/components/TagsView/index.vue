<template>
  <div class="tags-view-container" id="tags-view-container">
    <scroll-pane @scroll="handleScroll" class="tags-view-wrapper" ref="scrollPane">
      <!-- <router-link
        :class="isActive(tag)?'active':''"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
        class="tags-view-item"
        ref="tag"
        tag="span"
        v-for="tag in context.tagsView"
      >
        {{ tag.title }}
        <span
          @click.prevent.stop="closeSelectedTag(tag)"
          class="el-icon-close"
          v-if="!isAffix(tag)"
        />
      </router-link>-->
      <div :key="tag.path" v-for="tag in ctx.tagsView">{{tag.title}}4</div>
      {{ctx.tagsView.length}}
      <!-- {{context.tagsView.length}} -->
    </scroll-pane>
    <ul
      :style="{left: menu.left+'px',top: menu.top+'px'}"
      class="contextmenu"
      v-show="menu.visible"
    >
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li @click="closeSelectedTag(selectedTag)" v-if="!isAffix(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>
<script setup>
import { ref, reactive, inject, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import path from 'path-browserify-esm'

import ScrollPane from './ScrollPane.vue'

// import { ctx, dispatch } from '@/store'
import { dispatch, ctx as ctx2 } from '@/store'

const ctx = inject('context')

// console.log(333)
// console.log(ctx2, ctx)

// console.log(3)
const router = useRouter()
const route = useRoute()

const menu = reactive({
    visible: false,
    top: 0,
    left: 0,
})
const visitedViews = reactive([])

const selectedTag = {}
let affixTags = []

// console.log('====>router')
// console.log(router)

// console.log('====>route')
// console.log({ ...route })

// computed: {
// visitedViews() {
//     return this.$store.state.tagsView.visitedViews
// },
// routes() {
//     return this.$store.state.permission.routes
// },
// },

// const isExternal = computed(() => {
//     return isExt(props.icon)
// })

watch(
    () => route.path,
    () => {
        addTags()
        moveToCurrentTag()
    }
)

watch(
    () => menu.visible,
    (value) => {
        if (value) {
            document.body.addEventListener('click', closeMenu)
        } else {
            document.body.removeEventListener('click', closeMenu)
        }
    }
)

onMounted(() => {
    initTags()
    addTags()
})

const isActive = (route) => {
    return route.path === this.$route.path
}
const isAffix = (tag) => {
    return true
    // return tag.meta && tag.meta.affix
}
const filterAffixTags = (routes, basePath = '/') => {
    let tags = []
    // console.log(routes)
    routes.forEach((route) => {
        if (route.meta) {
            // const tagPath = path.resolve(basePath, route.path)
            const tagPath = path.join(basePath, route.path)
            tags.push({
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta },
            })
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags]
            }
        }
    })
    return tags
}
const initTags = () => {
    affixTags = filterAffixTags(router.options.routes)

    for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
            // console.log('===>1')
            // console.log(tag.name)
            // this.$store.dispatch('tagsView/addVisitedView', tag)
            dispatch.tagsView.add(ctx.tagsView, tag)
        }
    }

    console.log(ctx.tagsView.length)
    // console.log(context.tagsView)
}
const addTags = () => {
    const { name } = route
    if (name) {
        // this.$store.dispatch('tagsView/addView', route)
    }
    return false
}
const moveToCurrentTag = () => {
    const tags = this.$refs.tag
    this.$nextTick(() => {
        for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
                this.$refs.scrollPane.moveToTarget(tag)
                // when query is different then update
                if (tag.to.fullPath !== this.$route.fullPath) {
                    this.$store.dispatch('tagsView/updateVisitedView', this.$route)
                }
                break
            }
        }
    })
}
const refreshSelectedTag = (view) => {
    this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
            this.$router.replace({
                path: '/redirect' + fullPath,
            })
        })
    })
}
const closeSelectedTag = (view) => {
    this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (isActive(view)) {
            toLastView(visitedViews, view)
        }
    })
}
const closeOthersTags = () => {
    this.$router.push(this.selectedTag)
    this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        moveToCurrentTag()
    })
}
const closeAllTags = (view) => {
    this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some((tag) => tag.path === view.path)) {
            return
        }
        toLastView(visitedViews, view)
    })
}
const toLastView = (visitedViews, view) => {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
        this.$router.push(latestView.fullPath)
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
            // to reload home page
            this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
            this.$router.push('/')
        }
    }
}
const openMenu = (tag, e) => {
    const menuMinWidth = 105
    const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
    const offsetWidth = this.$el.offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right

    if (left > maxLeft) {
        this.left = maxLeft
    } else {
        this.left = left
    }

    this.top = e.clientY
    this.visible = true
    this.selectedTag = tag
}
const closeMenu = () => {
    this.visible = false
}
const handleScroll = () => {
    closeMenu()
}
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;
            &:first-of-type {
                margin-left: 15px;
            }
            &:last-of-type {
                margin-right: 15px;
            }
            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;
                &::before {
                    content: '';
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 2px;
                }
            }
        }
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 16px;
            height: 16px;
            vertical-align: 2px;
            border-radius: 50%;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;
            &:before {
                transform: scale(0.6);
                display: inline-block;
                vertical-align: -3px;
            }
            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }
}
</style>
