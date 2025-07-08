<template>
  <div class="drawer-side z-50">
    <label for="my-drawer-2" class="drawer-overlay"></label>

    <!-- 主菜单容器 -->
    <div class="menu-container relative w-80 h-full overflow-hidden mt-16">
      <!-- 动态背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900"></div>

      <!-- 简化的装饰背景 -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"></div>
        <div class="absolute bottom-1/3 right-1/4 w-24 h-24 bg-indigo-500/20 rounded-full blur-lg"></div>
      </div>

      <!-- 玻璃形态边框 -->
      <div class="absolute inset-0 bg-white/5 backdrop-blur-xl border-r border-white/10">
        <!-- 发光边框效果 -->
        <div class="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"></div>
      </div>

      <ul class="relative z-10 p-6 h-[calc(100vh-4rem)] flex flex-col overflow-y-auto">
        <!-- 菜单项列表 -->
        <div class="flex-1 space-y-2">
          <li
              v-for="(item, index) in computedMenuItems"
              :key="index"
              class="menu-item-wrapper"
          >
            <a
                :href="item.href"
                class="menu-item group relative flex items-center gap-4 rounded-xl py-4 px-4 transition-all duration-300 ease-out transform"
                :class="{
                'menu-item-active': item.active,
                'menu-item-inactive': !item.active
              }"
            >
              <!-- 简化的背景光效 -->
              <div class="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

              <!-- 激活状态背景 -->
              <div
                  v-if="item.active"
                  class="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-purple-500/30 rounded-xl"
              ></div>

              <!-- 左侧发光指示器 -->
              <div
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300"
                  :class="item.active ? 'bg-gradient-to-b from-cyan-400 to-indigo-500 opacity-100' : 'opacity-0 group-hover:opacity-60 bg-white/40'"
              ></div>

              <!-- 图标容器 -->
              <div class="relative z-10 flex items-center justify-center w-10 h-10">
                <span
                    class="relative text-2xl transform transition-transform duration-200 group-hover:scale-105"
                    :class="item.active ? 'animate-pulse' : ''"
                >{{ item.icon }}</span>
              </div>

              <!-- 文字 -->
              <span
                  class="relative z-10 font-semibold text-white/90 group-hover:text-white transition-all duration-300"
                  :class="item.active ? 'text-white drop-shadow-sm' : ''"
              >{{ item.title }}</span>

              <!-- 右侧箭头指示器 -->
              <div class="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span class="text-white/60">→</span>
              </div>
              <!-- 移除复杂的波纹效果 -->
            </a>
          </li>
        </div>

        <!-- 底部装饰 -->
        <div class="mt-8 px-4">
          <div class="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div class="mt-4 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-xs text-white/60">在线状态</span>
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
    default: () => [
      { title: '首页', href: '/home', icon: '🏠' },
      { title: '留言板', href: '/messageBoard', icon: '💬' },
      { title: '系统设置', href: '/settings', icon: '⚙️' },
      { title: '帮助支持', href: '/help', icon: '❓' }
    ]
  }
})

// 自动计算每个菜单项是否匹配当前路径
const computedMenuItems = computed(() => {
  return props.menuItems.map(item => ({
    ...item,
    active: route.path === item.href
  }))
})
</script>

<style scoped>
@import "../../css/components/homeSideDrawer.css";
</style>