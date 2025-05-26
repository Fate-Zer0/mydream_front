<template>
  <div class="drawer">
    <!-- 抽屉开关 -->
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">

      <!-- 👇 顶部导航栏 -->
      <header class="navbar bg-primary text-primary-content shadow-md">
        <div class="flex-1">
          <a class="btn btn-ghost normal-case text-xl">📘 日积月累</a>
        </div>
        <div class="flex-none gap-x-6 items-center flex">
          <button class="btn btn-sm btn-ghost">功能1</button>
          <button class="btn btn-sm btn-ghost">功能2</button>
          <button class="btn btn-sm btn-ghost">功能3</button>

          <!-- 分隔线 -->
          <div class="divider divider-horizontal h-10 m-0"></div>

          <div class="dropdown dropdown-end ml-4 mr-4">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img src="https://picsum.photos/200" alt="用户头像" />
              </div>
            </label>
            <ul
                tabindex="0"
                class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><a>我的资料</a></li>
              <li><a>设置</a></li>
              <li><a>退出登录</a></li>
            </ul>
          </div>
        </div>
      </header>

      <!-- 👇 主体内容 -->
      <div class="container mx-auto mt-6 px-4">

        <!-- 👇 轮播图区域和右侧签到模块 -->
        <section class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <!-- 轮播图 -->
          <aside  class="col-span-12 md:col-span-9">
            <!-- 轮播图容器 -->
            <div class="carousel w-full relative h-60 overflow-hidden" id="carousel">
              <!-- 轮播项 -->
              <div id="slide1" class="carousel-slide relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" class="w-full" />
              </div>
              <div id="slide2" class="carousel-slide relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp" class="w-full" />
              </div>
              <div id="slide3" class="carousel-slide relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp" class="w-full" />
              </div>
              <div id="slide4" class="carousel-slide relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp" class="w-full" />
              </div>

              <!-- 左右按钮 -->
              <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between pointer-events-none z-10">
                <button @click="prevSlide" class="btn btn-circle pointer-events-auto">❮</button>
                <button @click="nextSlide" class="btn btn-circle pointer-events-auto">❯</button>
              </div>

              <!-- 指示器 -->
              <div v-if="slides.length > 0"
                   class="absolute left-1/2 -translate-x-1/2 bottom-5 flex justify-center glass px-2 py-1 rounded z-10">
                <template v-for="(slide, index) in slides" :key="index">
                  <button
                      @click="goToSlide(index)"
                      :class="currentClass(index)"
                      class="w-4 h-4 mx-1 rounded-full focus:outline-none cursor-pointer transition-all duration-200 hover:scale-110"
                  ></button>
                </template>
              </div>

            </div>
          </aside>

          <!-- 右侧签到模块 -->
          <aside class="col-span-12 md:col-span-3 space-y-4">
            <div class="card bg-base-100 shadow-md">
              <div class="card-body items-center text-center">
                <figure class="avatar my-2">
                  <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://picsum.photos/200" alt="用户头像" />
                  </div>
                </figure>
                <h2 class="card-title">{{ userStore.username || '游客' }}</h2>
                <p class="text-sm opacity-70">今天已签到 ✅</p>
                <div class="card-actions mt-4">
                  <button class="btn btn-success btn-sm">每日签到</button>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <!-- 👇 功能模块 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div class="card-body">
              <h2 class="card-title">模块 {{ i }}</h2>
              <p>描述说明文字...</p>
              <div class="card-actions justify-end">
                <button class="btn btn-primary btn-sm">前往</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 👇 侧边抽屉菜单 -->
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 bg-base-100 text-base-content">
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted , nextTick } from 'vue'
import { useUserStore } from '../../stores/user'
import { useCarousel } from '../../composables/useCarousel'

const userStore = useUserStore()

// 使用轮播图逻辑
const {
  slides,
  currentIndex,
  currentClass,
  nextSlide,
  prevSlide,
  goToSlide,
  checkForSlides
} = useCarousel()

onMounted(async () => {
  await nextTick()
  checkForSlides()
})
</script>