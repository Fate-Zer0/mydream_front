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

        <!-- 警告信息 - 浮动版本（不影响布局） -->
        <div
            v-if="showAlert"
            :class="[ 'alert', alertType ]"
            class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-4 shadow-lg animate-bounce-in cursor-pointer"
            role="alert"
            @mouseenter="pauseAutoHide"
            @mouseleave="resumeAutoHide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ alertMessage }}</span>
          <!-- 添加关闭按钮 -->
          <button @click="closeAlert" class="btn btn-sm btn-ghost ml-auto hover:bg-opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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

          <!-- 右侧签到模块 - 改进版本 -->
          <aside class="col-span-12 md:col-span-3 space-y-4">
            <div class="card bg-base-100 shadow-md">
              <div class="card-body items-center text-center">
                <figure class="avatar my-2">
                  <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img :src="userStore.userimgUrl || 'https://picsum.photos/200'" alt="用户头像" />
                  </div>
                </figure>
                <h2 class="card-title">{{ userStore.username || '游客' }}</h2>
                <p class="text-sm opacity-70">
                  {{ hasSigned ? '今天已签到 ✅' : '今天还未签到 📝' }}
                </p>
                <!-- 签到统计信息 -->
                <div class="stats stats-vertical shadow mt-2 w-full">
                  <div class="stat py-2">
                    <div class="stat-title text-xs">连续签到</div>
                    <div class="stat-value text-lg">{{ signInStats.consecutive }}天</div>
                  </div>
                  <div class="stat py-2">
                    <div class="stat-title text-xs">累计签到</div>
                    <div class="stat-value text-lg">{{ signInStats.total }}天</div>
                  </div>
                </div>
                <div class="card-actions mt-4 w-full">
                  <button
                      class="btn btn-success btn-sm w-full"
                      :class="{ 'btn-disabled': hasSigned, 'loading': isSigningIn }"
                      :disabled="hasSigned || isSigningIn"
                      @click="performSignIn"
                  >
                    {{ isSigningIn ? '签到中...' : (hasSigned ? '✅ 已签到' : '📝 每日签到') }}
                  </button>
                </div>
                <!-- 签到奖励提示 -->
                <div v-if="!hasSigned" class="text-xs opacity-60 mt-2">
                  签到获得积分 +10
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
import { onMounted, nextTick, ref } from 'vue'
import { useUserStore } from '../../stores/user'
import { useCarousel } from '../../composables/useCarousel'
import { useHomeProcess } from '../../process/home/HomeProcess'

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

// 使用签到处理逻辑
const {
  showAlert,
  alertType,
  alertMessage,
  hasSigned,
  handleSignIn,
  closeAlert,     // 关闭警告方法
  pauseAutoHide,  // 暂停自动消失
  resumeAutoHide  // 恢复自动消失
} = useHomeProcess()

// 签到相关状态
const isSigningIn = ref(false)
const signInStats = ref({
  consecutive: 0,  // 连续签到天数
  total: 0        // 累计签到天数
})

// 执行签到操作
async function performSignIn() {
  if (hasSigned.value || isSigningIn.value) return

  isSigningIn.value = true
  try {
    // 调用签到方法，传入用户ID
    await handleSignIn(userStore.userid || userStore.username)

    // 签到成功后更新统计数据
    if (hasSigned.value) {
      signInStats.value.consecutive += 1
      signInStats.value.total += 1
    }
  } catch (error) {
    console.error('签到失败:', error)
  } finally {
    isSigningIn.value = false
  }
}

// 获取签到统计数据
async function loadSignInStats() {
  try {
    // 这里可以调用API获取签到统计
    // const response = await axios.get(`/api/signin/stats?userid=${userStore.userid}`)
    // signInStats.value = response.data

    // 模拟数据
    signInStats.value = {
      consecutive: 5,
      total: 28
    }
  } catch (error) {
    console.error('获取签到统计失败:', error)
  }
}

onMounted(async () => {
  await nextTick()
  checkForSlides()
  await loadSignInStats()  // 加载签到统计数据
})
</script>

<style scoped>
/* 警告框入场动画 */
@keyframes bounce-in {
  0% {
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, 5px);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}
</style>