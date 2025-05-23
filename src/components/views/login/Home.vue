<template>
  <div class="drawer">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Page content here -->
      <header class="navbar bg-primary text-primary-content">
        <a class="btn btn-ghost normal-case text-xl">系统名称</a>
        <span>{{ userStore.username }}</span>
      </header>
      <div class="container mx-auto mt-5">
        <div class="grid grid-cols-12 gap-4">
          <aside class="col-span-3 p-4 bg-base-200 rounded-box">
            <h3>系统信息</h3>
            <!-- 系统信息内容 -->
          </aside>
          <main class="col-span-9 p-4 bg-base-200 rounded-box">
            <nav>
              <button class="btn mr-2">用户信息</button>
              <button class="btn">签到</button>
            </nav>
            <section class="mt-4">
              <!-- 主要内容区域 -->
            </section>
          </main>
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
        <!-- Sidebar content here -->
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../../stores/user.ts'

const userStore = useUserStore()
</script>

<style scoped>
/* Add any custom styles here */
</style>