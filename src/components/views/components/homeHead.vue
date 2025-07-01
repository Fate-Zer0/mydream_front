<template>
  <header
      class="navbar z-[9999] border-b border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl backdrop-blur-sm"
  >
    <div class="flex-1">
      <a
          class="btn btn-ghost text-xl font-bold normal-case text-white transition-all duration-300 hover:bg-white/10"
      >
      </a>
      <label for="my-drawer-2" class="btn btn-primary drawer-button btn-ghost text-xl font-bold normal-case text-white transition-all duration-300 hover:bg-white/10">
        <span class="mr-2 text-2xl">📘</span> 日积月累
      </label>
    </div>
    <div class="flex flex-none items-center gap-x-6">
      <button
          class="btn btn-sm btn-ghost text-white transition-all duration-200 hover:scale-105 hover:bg-white/20"
      >
        <span class="mr-1">⚡</span>功能1
      </button>
      <button
          class="btn btn-sm btn-ghost text-white transition-all duration-200 hover:scale-105 hover:bg-white/20"
      >
        <span class="mr-1">🎯</span>功能2
      </button>
      <button
          class="btn btn-sm btn-ghost text-white transition-all duration-200 hover:scale-105 hover:bg-white/20"
      >
        <span class="mr-1">🚀</span>功能3
      </button>

      <!-- 分隔线 -->
      <div class="divider divider-horizontal m-0 h-10 opacity-30"></div>

      <div class="dropdown dropdown-end ml-4 mr-4">
        <label
            tabindex="0"
            class="btn btn-ghost btn-circle avatar transition-transform duration-200 hover:scale-110"
        >
          <div
              class="w-10 rounded-full ring-2 ring-white/30 transition-all duration-200 hover:ring-white/50"
          >
            <img
                :src="
                userStore.getUserimg().file_url ||
                'https://picsum.photos/200'
              "
                alt="用户头像"
            />
          </div>
        </label>
        <ul
            tabindex="0"
            class="menu menu-compact dropdown-content mt-3 w-52 rounded-2xl border border-gray-100 bg-white/95 p-2 shadow-2xl backdrop-blur-sm"
        >
          <li>
            <a
                class="rounded-lg text-black transition-colors duration-200 hover:bg-indigo-50"
                href="/myinfo"
            >👤 我的资料</a
            >
          </li>
          <li>
            <a
                class="rounded-lg text-black transition-colors duration-200 hover:bg-indigo-50"
            >⚙️ 设置</a
            >
          </li>
          <li>
            <a
                class="rounded-lg text-red-600 transition-colors duration-200 hover:bg-red-50"
                @click="logout"
            >🚪 退出登录</a
            >
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from "../../ts/stores/user";
import {useHomeProcess} from "../../ts/process/home/HomeProcess";

const userStore = useUserStore();

const {
  logout
} = useHomeProcess();

</script>