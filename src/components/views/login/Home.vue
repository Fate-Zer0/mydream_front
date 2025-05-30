<template>
  <div class="drawer min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- 抽屉开关 -->
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">

      <!-- 👇 顶部导航栏 - 使用渐变和毛玻璃效果 -->
      <header class="navbar bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl backdrop-blur-sm border-b border-white/10 z-[9999]">
        <div class="flex-1">
          <a class="btn btn-ghost normal-case text-xl font-bold text-white hover:bg-white/10 transition-all duration-300">
            <span class="text-2xl mr-2">📘</span> 日积月累
          </a>
        </div>
        <div class="flex-none gap-x-6 items-center flex">
          <button class="btn btn-sm btn-ghost text-white hover:bg-white/20 hover:scale-105 transition-all duration-200">
            <span class="mr-1">⚡</span>功能1
          </button>
          <button class="btn btn-sm btn-ghost text-white hover:bg-white/20 hover:scale-105 transition-all duration-200">
            <span class="mr-1">🎯</span>功能2
          </button>
          <button class="btn btn-sm btn-ghost text-white hover:bg-white/20 hover:scale-105 transition-all duration-200">
            <span class="mr-1">🚀</span>功能3
          </button>

          <!-- 分隔线 -->
          <div class="divider divider-horizontal h-10 m-0 opacity-30"></div>

          <div class="dropdown dropdown-end ml-4 mr-4">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform duration-200">
              <div class="w-10 rounded-full ring-2 ring-white/30 hover:ring-white/50 transition-all duration-200">
                <img src="https://picsum.photos/200" alt="用户头像" />
              </div>
            </label>
            <ul
                tabindex="0"
                class="menu menu-compact dropdown-content mt-3 p-2 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl w-52 border border-gray-100"
            >
              <li><a class="hover:bg-indigo-50 text-black rounded-lg transition-colors duration-200">👤 我的资料</a></li>
              <li><a class="hover:bg-indigo-50 text-black rounded-lg transition-colors duration-200">⚙️ 设置</a></li>
              <li><a class="hover:bg-red-50 text-red-600 rounded-lg transition-colors duration-200" @click="logout">🚪 退出登录</a></li>
            </ul>
          </div>
        </div>
      </header>

      <!-- 警告信息 - 优化样式 -->
      <div
          v-if="showAlert"
          :class="[ 'alert', alertType, 'alert-top-fixed', 'animate-slide-down' ]"
          role="alert"
          @mouseenter="pauseAutoHide"
          @mouseleave="resumeAutoHide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ alertMessage }}</span>
        <button @click="closeAlert" class="btn btn-sm btn-ghost ml-auto hover:bg-white/20 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 👇 主体内容 -->
      <div class="container mx-auto mt-8 px-4 pb-8">

        <!-- 👇 轮播图区域和右侧签到模块 -->
        <section class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
          <!-- 轮播图 -->
          <aside class="col-span-12 md:col-span-9">
            <!-- 轮播图容器 -->
            <div class="carousel w-full relative h-72 overflow-hidden rounded-3xl shadow-2xl border border-white/20" id="carousel">
              <!-- 轮播项 -->
              <div id="slide1" class="carousel-slide relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div id="slide2" class="carousel-slide relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div id="slide3" class="carousel-slide relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div id="slide4" class="carousel-slide relative w-full">
                <img src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <!-- 左右按钮 -->
              <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between pointer-events-none z-10">
                <button @click="prevSlide" class="btn btn-circle bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-200 pointer-events-auto">❮</button>
                <button @click="nextSlide" class="btn btn-circle bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-200 pointer-events-auto">❯</button>
              </div>

              <!-- 指示器 -->
              <div v-if="slides.length > 0"
                   class="absolute left-1/2 -translate-x-1/2 bottom-5 flex justify-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full z-10 border border-white/30">
                <template v-for="(slide, index) in slides" :key="index">
                  <button
                      @click="goToSlide(index)"
                      :class="currentClass(index)"
                      class="w-3 h-3 mx-1 rounded-full focus:outline-none cursor-pointer transition-all duration-300 hover:scale-125"
                  ></button>
                </template>
              </div>
            </div>
          </aside>

          <!-- 右侧签到模块 - 全新设计 -->
          <aside class="col-span-12 md:col-span-3 space-y-4">
            <div class="card bg-gradient-to-br from-white to-indigo-50/50 shadow-2xl border border-white/20 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
              <div class="card-body items-center text-center p-6">

                <!-- 优化后的头像区域 -->
                <div class="avatar indicator mb-4">
                  <div class="w-24 h-24 rounded-full ring-4 ring-primary ring-offset-4 ring-offset-base-100 hover:ring-secondary transition-all duration-500 hover:scale-110 shadow-xl hover:shadow-2xl">
                    <img
                        :src="userStore.userimgUrl || 'https://picsum.photos/200'"
                        alt="用户头像"
                        class="rounded-full object-cover w-full h-full hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                </div>

                <!-- 用户名 - 增加悬停效果 -->
                <h2 class="card-title text-gray-800 text-xl font-bold mb-3 hover:text-primary transition-colors duration-200 cursor-pointer">
                  {{ userStore.username || '游客' }}
                </h2>

                <!-- 签到统计信息 -->
                <div class="stats stats-vertical shadow-lg mt-4 w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100">
                  <div class="stat py-3">
                    <div class="stat-figure text-indigo-500">
                      <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-sm">🔥</span>
                      </div>
                    </div>
                    <div class="stat-title text-xs text-gray-600">连续签到</div>
                    <div class="stat-value text-2xl text-indigo-600 font-bold">{{ signInStats.consecutive }}</div>
                    <div class="stat-desc text-gray-500">天</div>
                  </div>
                  <div class="stat py-3">
                    <div class="stat-figure text-emerald-500">
                      <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span class="text-sm">📊</span>
                      </div>
                    </div>
                    <div class="stat-title text-xs text-gray-600">累计签到</div>
                    <div class="stat-value text-2xl text-emerald-600 font-bold">{{ signInStats.total }}</div>
                    <div class="stat-desc text-gray-500">天</div>
                  </div>
                </div>

                <div class="card-actions mt-6 w-full">
                  <button
                      class="btn w-full rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      :class="{
                        'btn-disabled bg-gray-200': hasSigned,
                        'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105': !hasSigned && !isSigningIn
                      }"
                      :disabled="hasSigned || isSigningIn"
                      @click="handleSignIn(userStore.userid)"
                  >
                    <span  :class="{
                      'loading': isSigningIn,
                      'loading-spinner': isSigningIn
                    }">
                      {{ isSigningIn ? '签到中...' : (hasSigned ? '✅ 已签到' : '📝 每日签到') }}
                    </span>
                  </button>
                </div>

                <!-- 签到奖励提示 -->
                <div v-if="!hasSigned" class="alert alert-info mt-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div class="flex items-center justify-center text-sm">
                    <span class="mr-2">🎁</span>
                    <span class="text-blue-700">签到获得积分 <strong>+10</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <!-- 👇 功能模块 - 全新卡片设计 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(module, i) in modules" :key="i"
               class="card bg-gradient-to-br from-white to-gray-50/50 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden">
            <div class="card-body relative">
              <!-- 装饰性背景 -->
              <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"
                   :class="module.bgColor"></div>

              <div class="flex items-center mb-3">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mr-4 shadow-lg"
                     :class="module.iconBg">
                  {{ module.icon }}
                </div>
                <h2 class="card-title text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">{{ module.title }}</h2>
              </div>

              <p class="text-gray-600 mb-4 leading-relaxed">{{ module.description }}</p>

              <div class="card-actions justify-end">
                <button class="btn btn-sm rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        :class="module.buttonClass">
                  <span class="mr-1">{{ module.buttonIcon }}</span>
                  前往
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 👇 侧边抽屉菜单 -->
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul class="menu p-6 w-80 bg-white/95 backdrop-blur-sm text-gray-700 border-r border-gray-200">
        <div class="mb-6 px-4">
          <h3 class="text-lg font-bold text-gray-800 mb-2">导航菜单</h3>
          <div class="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>
        <li><a class="hover:bg-indigo-50 rounded-lg transition-colors duration-200 py-3">🏠 首页</a></li>
        <li><a class="hover:bg-indigo-50 rounded-lg transition-colors duration-200 py-3">📊 数据统计</a></li>
        <li><a class="hover:bg-indigo-50 rounded-lg transition-colors duration-200 py-3">⚙️ 系统设置</a></li>
        <li><a class="hover:bg-indigo-50 rounded-lg transition-colors duration-200 py-3">❓ 帮助支持</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { useCarousel } from '../../composables/useCarousel'
import { useHomeProcess } from '../../process/home/HomeProcess'

const userStore = useUserStore()

// 功能模块数据
const modules = ref([
  {
    title: '学习管理',
    description: '记录和管理你的学习进度，制定学习计划，追踪知识点掌握情况。',
    icon: '📚',
    iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    bgColor: 'from-blue-500 to-indigo-500',
    buttonClass: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700',
    buttonIcon: '📖'
  },
  {
    title: '目标追踪',
    description: '设定个人目标，追踪完成进度，让每一天的努力都有迹可循。',
    icon: '🎯',
    iconBg: 'bg-gradient-to-br from-emerald-100 to-green-100',
    bgColor: 'from-emerald-500 to-green-500',
    buttonClass: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700',
    buttonIcon: '🚀'
  },
  {
    title: '数据分析',
    description: '深入分析学习数据，发现学习模式，优化学习策略和效率。',
    icon: '📈',
    iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100',
    bgColor: 'from-purple-500 to-pink-500',
    buttonClass: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700',
    buttonIcon: '📊'
  }
])

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

// 使用签到处理逻辑
const {
  showAlert,
  alertType,
  alertMessage,
  hasSigned,
  isSigningIn,
  signInStats,
  handleSignIn,
  closeAlert,
  pauseAutoHide,
  resumeAutoHide,
  logout,
  getSigningInInfo
} = useHomeProcess()



onMounted(async () => {
  await nextTick()
  checkForSlides()
  await getSigningInInfo(userStore.userid)
})
</script>

<style scoped>
/* 警告框动画优化 */
@keyframes slide-down {
  0% {
    top: -100px;
    opacity: 0;
    transform: translateX(-50%) scale(0.9);
  }
  50% {
    top: 70px;
    opacity: 0.8;
    transform: translateX(-50%) scale(1.05);
  }
  100% {
    top: 80px;
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

.animate-slide-down {
  animation: slide-down 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.alert-top-fixed {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  max-width: 28rem;
  margin: 0 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #4f46e5, #7c3aed);
}

/* 轮播图指示器样式 */
.carousel-slide .w-3.h-3 {
  background: rgba(255, 255, 255, 0.4);
}

.carousel-slide .w-3.h-3.bg-white {
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 卡片悬浮效果 */
.card:hover {
  transform: translateY(-2px);
}

/* 按钮悬浮效果 */
.btn:hover:not(.btn-disabled) {
  transform: translateY(-1px);
}

/* 头像悬浮效果增强 */
.avatar .w-24:hover {
  transform: scale(1.1) rotate(2deg);
}

/* 状态指示器动画 */
.indicator-item .animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 徽章悬浮效果 */
.badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 统计卡片悬浮效果 */
.stats:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>