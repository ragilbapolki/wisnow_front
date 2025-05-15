<template>
  <div class="navbar">
    <hamburger
      :is-active="ctx.sidebar.opened"
      @toggleClick="toggleSidebar"
      class="hamburger-container"
    />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="ctx.userInfo.avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
          <el-icon class="el-icon-caret-bottom">
            <i-ep-MoreFilled />
          </el-icon>
        </div>
        <template v-slot:dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>Home</el-dropdown-item>
            </router-link>
            <a href="https://github.com/chocho-1115/vue-admin" target="_blank">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <!-- <a href="https://panjiachen.github.io/vue-element-admin-site/#/" target="_blank">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>-->
            <el-dropdown-item @click.native="onLogout" divided>
              <span style="display:block;">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

import Breadcrumb from '@/components/Breadcrumb.vue'
import Hamburger from '@/components/Hamburger.vue'

import { logout } from '@/api/user'
import { ctx, dispatch } from '@/store'

const router = useRouter()
const route = useRoute()

const redirect = route.fullPath || '/'

const toggleSidebar = () => {
    dispatch.sidebar.toggle()
}
const onLogout = async () => {
    logout().then(() => {
        dispatch.user.removeInfo()
        router.push(`/account/login?redirect=${redirect}`)
    })
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
