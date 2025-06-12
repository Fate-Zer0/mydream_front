<template>
  <div class="drawer-side z-50">
    <label for="my-drawer-2" class="drawer-overlay"></label>
    <ul
        class="menu w-80 border-r border-gray-200 bg-white/95 p-6 text-gray-700 backdrop-blur-sm"
    >
      <div class="mb-6 px-4">
        <h3 class="mb-2 text-lg font-bold text-gray-800">导航菜单</h3>
        <div
            class="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
        ></div>
      </div>

      <!-- 菜单项 -->
      <li v-for="(item, index) in menuItems" :key="index">
        <a
            :href="item.href"
            class="flex items-center gap-3 rounded-lg py-3 transition-colors duration-200 hover:bg-indigo-50"
        >
          <span class="text-lg">{{ item.icon }}</span>
          {{ item.title }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  menuItems: {
    type: Array,
    required: true,
    default: () => [
      { title: '首页', href: '#', icon: '🏠' },
      { title: '数据统计', href: '#', icon: '📊' },
      { title: '系统设置', href: '#', icon: '⚙️' },
      { title: '帮助支持', href: '#', icon: '❓' }
    ]
  }
})
</script>