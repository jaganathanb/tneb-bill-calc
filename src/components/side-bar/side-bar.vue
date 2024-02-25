<script lang="ts" setup>
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { useAppStore } from '@/stores/app.store'

const router = useRouter()
const filteredRoutes = router.options.routes
  .find((r) => r.name === 'private')
  ?.children?.filter((r) => r.meta?.label)

const appStore = useAppStore()
const activeRoute = useRoute()

const { isCollapse } = storeToRefs(appStore)

const toggleSideBar = (index: string) => {
  if (index === '3') {
    appStore.setIsCollapse(!isCollapse.value)
  }
}
</script>

<template>
  <el-container direction="vertical">
    <el-row class="h-full">
      <el-container direction="vertical">
        <el-row class="flex-grow-1">
          <el-menu
            :default-active="activeRoute.name?.toString()"
            :router="true"
            class="da-app-menu h-full"
            :collapse="isCollapse"
          >
            <side-bar-item
              v-for="(routeConfig, index) in filteredRoutes"
              :key="index"
              :index="routeConfig.path"
              :route-config="routeConfig"
            />
          </el-menu>
        </el-row>

        <el-row>
          <el-menu
            class="da-app-menu bottom-part"
            style="min-height: auto"
            :collapse="isCollapse"
            @select="toggleSideBar"
          >
            <el-menu-item index="3" class="side-toggle">
              <el-icon v-if="isCollapse">
                <ArrowRightBold />
              </el-icon>
              <template v-if="!isCollapse" #title
                ><el-container class="justify-center">
                  <el-icon>
                    <ArrowLeftBold />
                  </el-icon>
                </el-container>
              </template>
            </el-menu-item>
          </el-menu>
        </el-row>
      </el-container>
    </el-row>
  </el-container>
</template>

<style>
.da-app-menu:not(.el-menu--collapse) {
  width: 300px;
  min-height: 400px;
}

.da-app-menu.bottom-part.el-menu--vertical .el-menu-item.side-toggle:hover,
.da-app-menu.bottom-part.el-menu--vertical .el-menu-item.side-toggle:focus {
  background-color: var(--el-menu-bg-color);
  color: var(--el-menu-text-color);
}

.da-app-menu.bottom-part.el-menu--vertical .el-menu-item.side-toggle.is-active {
  color: var(--el-menu-text-color);
}
</style>
