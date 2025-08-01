<template>
	<div class="drawer drawer-mobile min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
		<!-- 抽屉开关 -->
		<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<!-- 👇 顶部导航栏 -->
      <Header />
			<!-- 👇 主体内容 -->
			<div class="container mx-auto mt-8 px-4 pb-8">
				<!-- 👇 轮播图区域和右侧签到模块 -->
				<section class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-12">
					<!-- 轮播图 -->
					<aside class="col-span-12 md:col-span-9">
						<!-- 轮播图容器 -->
						<div
							class="carousel relative h-72 w-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
							id="carousel"
						>
							<!-- 轮播项 -->
							<div
								id="slide1"
								class="carousel-slide relative w-full"
							>
								<img
									src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
									class="h-full w-full object-cover"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
								></div>
							</div>
							<div
								id="slide2"
								class="carousel-slide relative w-full"
							>
								<img
									src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
									class="h-full w-full object-cover"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
								></div>
							</div>
							<div
								id="slide3"
								class="carousel-slide relative w-full"
							>
								<img
									src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
									class="h-full w-full object-cover"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
								></div>
							</div>
							<div
								id="slide4"
								class="carousel-slide relative w-full"
							>
								<img
									src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
									class="h-full w-full object-cover"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
								></div>
							</div>

							<!-- 左右按钮 -->
							<div
								class="pointer-events-none absolute left-5 right-5 top-1/2 z-10 flex -translate-y-1/2 transform justify-between"
							>
								<button
									@click="prevSlide"
									class="btn btn-circle pointer-events-auto border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/30"
								>
									❮
								</button>
								<button
									@click="nextSlide"
									class="btn btn-circle pointer-events-auto border-white/30 bg-white/20 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/30"
								>
									❯
								</button>
							</div>

							<!-- 指示器 -->
							<div
								v-if="slides.length > 0"
								class="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 justify-center rounded-full border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-sm"
							>
								<template
									v-for="(slide, index) in slides"
									:key="index"
								>
									<button
										@click="goToSlide(index)"
										:class="currentClass(index)"
										class="mx-1 h-3 w-3 cursor-pointer rounded-full transition-all duration-300 hover:scale-125 focus:outline-none"
									></button>
								</template>
							</div>
						</div>
					</aside>

					<!-- 右侧签到模块 - 全新设计 -->
					<aside class="col-span-12 space-y-4 md:col-span-3">
						<div
							class="card hover:shadow-3xl border border-white/20 bg-gradient-to-br from-white to-indigo-50/50 shadow-2xl backdrop-blur-sm transition-all duration-300"
						>
              <!-- 美化的日历弹窗 -->
              <Transition name="calendar-fade">
                <div
                    v-if="showCalendar"
                    class="absolute bottom-full mb-4 z-[9999] pointer-events-auto"
                    style="top: -10px;left: 15px"
                    @mouseenter="cancelHideCalendar"
                    @mouseleave="hideCalendarWithDelay"
                >
                  <!-- 弹窗容器 -->
                  <div class="relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 w-80 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                    <!-- 弹窗箭头 -->
                    <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 rotate-45"></div>

                    <!-- 弹窗标题 -->
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        📅 签到日历
                      </h3>
                      <button
                          @click="showCalendar = false"
                          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- 分割线 -->
                    <div class="border-t border-gray-200 dark:border-gray-600 mb-4"></div>

                    <!-- 日历组件 -->
                    <Calendar
                        :signed-dates="signedDates"
                        v-model:selected-date="selectedDate"
                        :show-stats="true"
                        :clickable="true"
                        @date-click="handleDateClick"
                        @month-change="handleMonthChange"
                    />
                  </div>
                </div>
              </Transition>

              <div class="card-body items-center p-6 text-center relative">
								<!-- 优化后的头像区域 -->
								<div class="avatar indicator mb-4">
									<div
										class="ring-primary ring-offset-base-100 hover:ring-secondary h-24 w-24 rounded-full shadow-xl ring-4 ring-offset-4 transition-all duration-500 hover:scale-110 hover:shadow-2xl"
									>
										<img
											:src="
												userStore.getUserimg().file_url ||
												'https://picsum.photos/200'
											"
											alt="用户头像"
											class="h-full w-full rounded-full object-cover transition-all duration-300 hover:brightness-110"
										/>
									</div>
								</div>

								<!-- 用户名 - 增加悬停效果 -->
								<h2
									class="card-title hover:text-primary mb-3 cursor-pointer text-xl font-bold text-gray-800 transition-colors duration-200"
								>
									{{ userStore.getUsername() || "游客" }}
								</h2>

								<!-- 签到统计信息 -->
								<div
									class="stats stats-vertical mt-4 w-full rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-lg"
								>
									<div class="stat py-3">
										<div
											class="stat-figure text-indigo-500"
										>
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100"
											>
												<span class="text-sm">🔥</span>
											</div>
										</div>
										<div
											class="stat-title text-xs text-gray-600"
										>
											连续签到
										</div>
										<div
											class="stat-value text-2xl font-bold text-indigo-600"
										>
											{{ signInStats.consecutive }}
										</div>
										<div class="stat-desc text-gray-500">
											天
										</div>
									</div>
									<div class="stat py-3">
										<div
											class="stat-figure text-emerald-500"
										>
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100"
											>
												<span class="text-sm">📊</span>
											</div>
										</div>
										<div
											class="stat-title text-xs text-gray-600"
										>
											累计签到
										</div>
										<div
											class="stat-value text-2xl font-bold text-emerald-600"
										>
											{{ signInStats.total }}
										</div>
										<div class="stat-desc text-gray-500">
											天
										</div>
									</div>
								</div>

								<div
                    class="card-actions mt-6 w-full"
                    @mouseenter="cancelHideCalendar"
                    @mouseleave="hideCalendarWithDelay"
                >
									<button
										class="btn w-full rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
										:class="{
											'btn-disabled bg-gray-200':
												hasSigned,
											'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 hover:from-indigo-600 hover:to-purple-700':
												!hasSigned && !isSigningIn,
										}"
										:disabled="hasSigned || isSigningIn"
										@click="handleSignInAndRefresh()"
                  >
										<span
											:class="{
												loading: isSigningIn,
												'loading-spinner': isSigningIn,
											}"
										>
											{{
												isSigningIn
													? "签到中..."
													: hasSigned
														? "✅ 已签到"
														: "📝 每日签到"
											}}
										</span>
									</button>
								</div>

								<!-- 签到奖励提示 -->
								<div
									v-if="!hasSigned"
									class="alert alert-info mt-4 rounded-xl border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 py-2"
								>
									<div
										class="flex items-center justify-center text-sm"
									>
										<span class="mr-2">🎁</span>
										<span class="text-blue-700"
											>签到获得积分
											<strong>+5</strong></span
										>
									</div>
								</div>
							</div>
						</div>
					</aside>
				</section>

				<!-- 👇 功能模块 - 全新卡片设计 -->
				<div
					class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
				>
					<div
						v-for="(module, i) in modules"
						:key="i"
						class="card group overflow-hidden border border-white/20 bg-gradient-to-br from-white to-gray-50/50 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
					>
						<div class="card-body relative">
							<!-- 装饰性背景 -->
							<div
								class="absolute right-0 top-0 h-20 w-20 -translate-y-10 translate-x-10 rounded-full bg-gradient-to-br opacity-10 transition-transform duration-500 group-hover:scale-150"
								:class="module.bgColor"
							></div>

							<div class="mb-3 flex items-center">
								<div
									class="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-lg"
									:class="module.iconBg"
								>
									{{ module.icon }}
								</div>
								<h2
									class="card-title text-gray-800 transition-colors duration-200 group-hover:text-indigo-600"
								>
									{{ module.title }}
								</h2>
							</div>

							<p class="mb-4 leading-relaxed text-gray-600">
								{{ module.description }}
							</p>

              <div class="card-actions justify-end">
                <router-link :to="module.link" class="btn btn-sm rounded-xl font-semibold shadow-md transition-all duration-200 hover:shadow-lg" :class="module.buttonClass">
                  <span class="mr-1">{{ module.buttonIcon }}</span> 前往
                </router-link>
              </div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 👇 侧边抽屉菜单 -->
    <SideDrawer/>
	</div>
</template>

<script setup>
import { onMounted, nextTick, ref } from "vue";
import { useUserStore } from "../../ts/stores/user";
import { useCarousel } from "../../ts/composables/useCarousel";
import { useHomeProcess } from "../../ts/process/home/HomeProcess";
import { signInInfoCalendar } from "../../ts/composables/signInInfoCalendar";
import Calendar from "../components/signInInfoCalendar.vue";
import Header from "../components/homeHead.vue";
import SideDrawer from "../components/homeSideDrawer.vue";

const userStore = useUserStore();

// 功能模块数据
const modules = ref([
  {
    title: "功能集合",
    description: "汇聚游戏、工具与各类实用功能，一站式便捷跳转。",
    icon: "📚",
    iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    bgColor: "from-blue-500 to-indigo-500",
    buttonClass: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",
    buttonIcon: "🚀",
    link: "/pageBox"
  },
  {
    title: "目标追踪",
    description: "设定个人目标，追踪完成进度，让每一天的努力都有迹可循。",
    icon: "🎯",
    iconBg: "bg-gradient-to-br from-emerald-100 to-green-100",
    bgColor: "from-emerald-500 to-green-500",
    buttonClass: "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700",
    buttonIcon: "🚀",
    link: "/goals" // 添加的链接
  },
  {
    title: "数据分析",
    description: "深入分析学习数据，发现学习模式，优化学习策略和效率。",
    icon: "📈",
    iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
    bgColor: "from-purple-500 to-pink-500",
    buttonClass: "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700",
    buttonIcon: "📊",
    link: "/data-analysis" // 添加的链接
  },
]);

async function handleSignInAndRefresh() {
  try {
    await handleSignIn();     // 等待签到完成
    await initSignInfo();     // 等待刷新完成
  } catch (error) {
    console.error('执行失败:', error);
    // 可以弹出提示错误给用户
  }
}

// 使用轮播图逻辑
const {
	slides,
	currentClass,
	nextSlide,
	prevSlide,
	goToSlide,
	checkForSlides,
} = useCarousel();

// 使用签到处理逻辑
const {
	hasSigned,
	isSigningIn,
	signInStats,
	handleSignIn,
	logout,
	getSigningInInfo,
} = useHomeProcess();

const {
  showCalendar,
  hideTimer,
  selectedDate,
  signedDates,
  handleDateClick,
  handleMonthChange,
  cancelHideCalendar,
  hideCalendarWithDelay,
  initSignInfo
} = signInInfoCalendar();

onMounted(async () => {
	await nextTick();
	checkForSlides();
	await getSigningInInfo(userStore.getUserid());
});
</script>

<style scoped>
@import "../../css/main/Home.css";
</style>