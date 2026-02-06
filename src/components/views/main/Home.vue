<template>
	<div class="drawer drawer-mobile min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
		<!-- 抽屉开关 -->
		<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<!-- 👇 顶部导航栏 -->
      <Header />
			<!-- 👇 主体内容 -->
			<div class="container mx-auto mt-6 px-4 pb-8">
				<!-- 👇 轮播图区域 -->
				<section class="mb-6">
					<!-- 轮播图 -->
						<!-- 轮播图容器 - 调整高度 -->
						<div
							class="carousel relative h-64 w-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
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
				</section>

				<!-- 👇 三栏布局：用户信息 + 动态信息流 + 签到排行榜 -->
				<section class="grid grid-cols-1 gap-6 lg:grid-cols-12">
					<!-- 左侧：用户信息和签到卡片 -->
					<aside class="col-span-12 space-y-6 lg:col-span-3">
						<!-- 用户信息卡片 - 优化紧凑设计 -->
						<div class="card border border-white/20 bg-gradient-to-br from-white to-purple-50/50 shadow-xl backdrop-blur-sm">
							<div class="card-body p-5">
								<!-- 头像和用户名 - 紧凑布局 -->
								<div class="flex flex-col items-center mb-4">
									<!-- 头像 -->
									<div class="avatar mb-2">
										<div class="ring-primary ring-offset-base-100 h-16 w-16 rounded-full shadow-lg ring-2 ring-offset-2 transition-all duration-300 hover:scale-105">
											<img
												:src="userStore.getUserimg().file_url || 'https://picsum.photos/200'"
												alt="用户头像"
												class="h-full w-full rounded-full object-cover"
											/>
										</div>
									</div>
									
									<!-- 用户名 - 防止过长 -->
									<h3 
										class="text-base font-bold text-gray-800 w-full text-center truncate px-2"
										:title="userStore.getUsername() || '游客'"
									>
										{{ userStore.getUsername() || "游客" }}
									</h3>
								</div>
								
								<!-- 积分显示 -->
								<div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 mb-3 border border-amber-200">
									<div class="flex items-center justify-center gap-2">
										<span class="text-xl">💎</span>
										<div class="text-left">
											<div class="text-xs text-amber-600">当前积分</div>
											<div class="text-lg font-bold text-amber-700">{{ userPoints }}</div>
										</div>
									</div>
								</div>
								
								<!-- 快速入口 -->
								<div class="grid grid-cols-2 gap-2">
									<router-link to="/myInfo" class="btn btn-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 border-none text-xs">
										👤 个人
									</router-link>
									<button @click="logout" class="btn btn-sm bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 border-none text-xs">
										🚪 退出
									</button>
								</div>
							</div>
						</div>

						<!-- 签到卡片 -->
						<div
							class="card hover:shadow-3xl border border-white/20 bg-gradient-to-br from-white to-indigo-50/50 shadow-2xl backdrop-blur-sm transition-all duration-300"
						>
              <div class="card-body p-6 text-center">
								<!-- 签到标题 -->
								<h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
									<span class="text-2xl">📅</span>
									<span>每日签到</span>
								</h3>

								<!-- 签到统计信息 - 横向布局 -->
								<div class="grid grid-cols-2 gap-3 mb-4">
									<div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
										<div class="flex items-center gap-2 mb-1">
											<span class="text-xl">🔥</span>
											<span class="text-xs text-indigo-600 font-medium">连续签到</span>
										</div>
										<div class="text-2xl font-bold text-indigo-700">
											{{ signInStats.consecutive }}
										</div>
										<div class="text-xs text-gray-500">天</div>
									</div>
									
									<div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
										<div class="flex items-center gap-2 mb-1">
											<span class="text-xl">📊</span>
											<span class="text-xs text-emerald-600 font-medium">累计签到</span>
										</div>
										<div class="text-2xl font-bold text-emerald-700">
											{{ signInStats.total }}
										</div>
										<div class="text-xs text-gray-500">天</div>
									</div>
								</div>

								<!-- 签到按钮容器 - 相对定位 -->
								<div
                    class="card-actions mt-6 w-full relative"
                    @mouseenter="cancelHideCalendar"
                    @mouseleave="hideCalendarWithDelay"
                >
									<!-- 日历弹窗 - 定位在按钮上方 -->
									<Transition name="calendar-fade">
										<div
											v-if="showCalendar"
											class="absolute z-[9999] pointer-events-auto"
											:style="{
												bottom: 'calc(100% + 12px)',
												left: '50%',
												transform: 'translateX(-50%)',
											}"
											@mouseenter="cancelHideCalendar"
											@mouseleave="hideCalendarWithDelay"
										>
											<!-- 弹窗容器 -->
											<div class="relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 w-80 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
												<!-- 弹窗箭头 - 指向下方按钮 -->
												<div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 rotate-45 z-10"></div>

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
									
									<!-- 签到按钮 -->
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

								<!-- 签到奖励提示 - 优化布局 -->
								<div v-if="!hasSigned" class="space-y-2 mt-4">
									<!-- 今日奖励 -->
									<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<span class="text-xl">🎁</span>
												<span class="text-sm text-blue-700 font-medium">今日签到</span>
											</div>
											<span class="text-lg font-bold text-blue-700">+{{ signInStats.todayPoints }}</span>
										</div>
									</div>
									
									<!-- 明日预告 -->
									<div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<span class="text-xl">💎</span>
												<div class="text-left">
													<div class="text-xs text-purple-600">明日奖励</div>
													<div class="text-xs text-gray-500">连续{{ signInStats.currentDay }}天</div>
												</div>
											</div>
											<span class="text-lg font-bold text-purple-700">+{{ signInStats.tomorrowPoints }}</span>
										</div>
									</div>
									
									<!-- 里程碑提示 -->
									<div v-if="showMilestoneHint" class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-300">
										<div class="flex items-center gap-2 text-xs text-amber-700 font-semibold">
											<span class="text-lg">🔥</span>
											<span>{{ milestoneHint }}</span>
										</div>
									</div>
								</div>
								
								<!-- 已签到显示 -->
								<div v-else class="space-y-2 mt-4">
									<div class="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
										<div class="flex items-center justify-between mb-2">
											<div class="flex items-center gap-2">
												<span class="text-xl">✅</span>
												<span class="text-sm text-emerald-700 font-medium">今日已签</span>
											</div>
											<span class="text-lg font-bold text-emerald-700">+{{ signInStats.todayPoints }}</span>
										</div>
										<div class="flex items-center justify-between text-xs text-gray-600">
											<span>明日奖励</span>
											<span class="font-bold text-green-700">+{{ signInStats.tomorrowPoints }}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</aside>

					<!-- 中间：动态信息流 -->
					<main class="col-span-12 lg:col-span-6">
						<div class="card border border-white/20 bg-gradient-to-br from-white to-gray-50/50 shadow-xl backdrop-blur-sm">
							<div class="card-body p-6">
								<div class="flex items-center justify-between mb-4">
									<h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
										<span class="text-2xl">📱</span>
										<span>动态信息</span>
									</h2>
									<button 
										@click="getRecentActivities" 
										class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
										:disabled="isLoadingActivity"
									>
										{{ isLoadingActivity ? '...' : '刷新' }}
									</button>
								</div>
								
								<!-- 动态列表 -->
								<div v-if="activityList.length > 0" class="space-y-3 max-h-[600px] overflow-y-auto">
									<div 
										v-for="item in activityList" 
										:key="item.activityId"
										class="bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
									>
										<div class="flex items-start gap-3">
											<!-- 用户头像 -->
											<div class="avatar flex-shrink-0">
												<div class="w-10 h-10 rounded-full ring-1 ring-gray-200">
													<img 
														:src="item.avatar || 'https://picsum.photos/200'" 
														:alt="item.username"
														class="rounded-full object-cover"
													/>
												</div>
											</div>
											
											<!-- 动态内容 -->
											<div class="flex-1 min-w-0">
												<div class="flex items-center gap-2 mb-1">
													<span class="font-semibold text-gray-800 text-sm">{{ item.username }}</span>
													<span class="text-xs text-gray-400">{{ formatTime(item.createTime) }}</span>
												</div>
												
												<div class="flex items-start gap-2">
													<span class="text-lg">{{ getActivityIcon(item.activityType) }}</span>
													<div class="flex-1">
														<div class="text-sm text-gray-600">{{ item.activityTitle }}</div>
														<div class="text-sm text-gray-800 mt-1">{{ item.activityDesc }}</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								<!-- 加载中 -->
								<div v-else-if="isLoadingActivity" class="text-center py-12 text-gray-400">
									<div class="loading loading-spinner loading-md"></div>
									<div class="text-sm mt-2">加载中...</div>
								</div>
								
								<!-- 空状态 -->
								<div v-else class="text-center py-12 text-gray-400">
									<div class="text-5xl mb-3">📭</div>
									<div class="text-sm">暂无动态</div>
									<div class="text-xs mt-1">快去签到产生第一条动态吧！</div>
								</div>
							</div>
						</div>
					</main>

					<!-- 右侧：签到排行榜 -->
					<aside class="col-span-12 lg:col-span-3">
						<div class="card border border-white/20 bg-gradient-to-br from-white to-orange-50/50 shadow-xl backdrop-blur-sm">
							<div class="card-body p-6">
								<div class="flex items-center justify-between mb-4">
									<h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
										<span class="text-2xl">🏆</span>
										<span>签到排行榜</span>
									</h3>
									<button 
										@click="getSignInRanking" 
										class="text-xs text-gray-500 hover:text-blue-600 transition-colors"
										:disabled="isLoadingRanking"
									>
										{{ isLoadingRanking ? '...' : '刷新' }}
									</button>
								</div>
								
								<!-- 排行榜列表 -->
								<div v-if="rankingList.length > 0" class="space-y-2">
									<div 
										v-for="(item, index) in rankingList" 
										:key="item.userId"
										class="bg-gradient-to-r rounded-xl p-3 border transition-all duration-200 hover:shadow-md"
										:class="{
											'from-amber-50 to-yellow-50 border-amber-200': index === 0,
											'from-gray-50 to-slate-50 border-gray-200': index === 1,
											'from-orange-50 to-red-50 border-orange-200': index === 2,
											'from-white to-gray-50 border-gray-100': index > 2,
											'ring-2 ring-blue-400': isCurrentUser(item.userId)
										}"
									>
										<div class="flex items-center gap-2">
											<!-- 排名图标 -->
											<div class="text-lg font-bold w-6 text-center flex-shrink-0">
												{{ getRankIcon(index) }}
											</div>
											
											<!-- 用户头像 -->
											<div class="avatar flex-shrink-0">
												<div class="w-8 h-8 rounded-full ring-1 ring-gray-200">
													<img 
														:src="item.avatar || 'https://picsum.photos/200'" 
														:alt="item.username"
														class="rounded-full object-cover"
													/>
												</div>
											</div>
											
											<!-- 用户信息 -->
											<div class="flex-1 min-w-0">
												<div class="font-semibold text-sm text-gray-800 truncate" :title="item.username">
													{{ item.username }}
													<span v-if="isCurrentUser(item.userId)" class="text-xs text-blue-600 ml-1">(我)</span>
												</div>
												<div class="flex items-center gap-2 text-xs text-gray-600">
													<span>🔥{{ item.consecutiveDays }}天</span>
													<span class="text-gray-400">·</span>
													<span>📊{{ item.totalSignInDays }}天</span>
												</div>
											</div>
											
											<!-- 积分 -->
											<div class="text-right flex-shrink-0">
												<div class="text-xs text-amber-600 font-bold">
													{{ item.totalPoints }}
												</div>
												<div class="text-xs text-gray-400">积分</div>
											</div>
										</div>
									</div>
								</div>
								
								<!-- 加载中 -->
								<div v-else-if="isLoadingRanking" class="text-center py-8 text-gray-400">
									<div class="loading loading-spinner loading-md"></div>
									<div class="text-sm mt-2">加载中...</div>
								</div>
								
								<!-- 空状态 -->
								<div v-else class="text-center py-8 text-gray-400">
									<div class="text-4xl mb-2">📊</div>
									<div class="text-sm">暂无排行数据</div>
								</div>
							</div>
						</div>
					</aside>
				</section>

				<!-- 👇 功能模块 - 全新卡片设计 -->
				<section class="mt-6">
					<div class="mb-4">
						<h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
							<span class="text-3xl">📚</span>
							<span>功能模块</span>
						</h2>
					</div>
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
				</section>
			</div>
		</div>

		<!-- 👇 侧边抽屉菜单 -->
    <SideDrawer/>
	</div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, computed } from "vue";
import { useUserStore } from "../../ts/stores/user";
import { useCarousel } from "../../ts/composables/useCarousel";
import { useHomeProcess } from "../../ts/process/home/HomeProcess";
import { signInInfoCalendar } from "../../ts/composables/signInInfoCalendar";
import { withRequest } from "../../ts/composables/useRequest";
import api from "../../ts/api/api";
import type { SignInRankingItem } from "../../ts/api/account/userApi";
import type { UserActivityItem } from "../../ts/api/activity/activityApi";
import Calendar from "../components/signInInfoCalendar.vue";
import Header from "../components/homeHead.vue";
import SideDrawer from "../components/homeSideDrawer.vue";
import HotDynamics from '../components/hotDynamics.vue';

const userStore = useUserStore();

// 用户积分
const userPoints = ref('0');

// 获取用户积分
async function getUserPoints() {
	const userid = userStore.getUserid();
	if (!userid) return;
	
	const res = await withRequest(() => api.account.user.getUserInfo(userid));
	if (res?.retValue) {
		userPoints.value = res.retValue.user_points || '0';
	}
}

// 签到排行榜数据
const rankingList = ref<SignInRankingItem[]>([]);
const isLoadingRanking = ref(false);

// 获取签到排行榜
async function getSignInRanking() {
	isLoadingRanking.value = true;
	const res = await withRequest(() => api.account.user.getSignInRanking(10));
	if (res?.retValue) {
		rankingList.value = res.retValue;
	}
	isLoadingRanking.value = false;
}

// 动态信息数据
const activityList = ref<UserActivityItem[]>([]);
const isLoadingActivity = ref(false);

// 获取最新动态
async function getRecentActivities() {
	isLoadingActivity.value = true;
	const res = await withRequest(() => api.activity.getRecentActivities(20));
	if (res?.retValue) {
		activityList.value = res.retValue;
	}
	isLoadingActivity.value = false;
}

// 格式化时间
const formatTime = (timeStr: string) => {
	const time = new Date(timeStr);
	const now = new Date();
	const diff = now.getTime() - time.getTime();
	
	if (diff < 60000) return '刚刚';
	if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
	if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
	if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
	
	return time.toLocaleDateString();
}

// 获取动态图标
const getActivityIcon = (type: string) => {
	const icons: Record<string, string> = {
		'SIGN_IN': '📅',
		'PIANO': '🎹',
		'FILE': '📁',
		'MESSAGE': '💬',
		'ACHIEVEMENT': '🏆',
		'GAME': '🎮',
	};
	return icons[type] || '📌';
}

// 判断是否是当前用户
const isCurrentUser = (userId: string) => {
	return userId === userStore.getUserid();
}

// 获取排名图标
const getRankIcon = (index: number) => {
	if (index === 0) return '🥇';
	if (index === 1) return '🥈';
	if (index === 2) return '🥉';
	return `${index + 1}`;
}

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
    await getUserPoints();    // 刷新积分显示
    await getSignInRanking(); // 刷新排行榜
    await getRecentActivities(); // 刷新动态信息
  } catch (error) {
    console.error('执行失败:', error);
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
	await getUserPoints();
	await getSignInRanking();
	await getRecentActivities();
});

const dynamicPosts = [
  {
    id: 1,
    title: '学习小组成立啦',
    content: '加入我们的学习小组，一起分享学习经验和资源，提高学习效率！',
    author: '张同学',
    avatar: 'https://picsum.photos/200?random=1',
    time: '2小时前',
    likes: 128,
    comments: 36,
    type: 'hot',
    badge: '热门',
  },
  {
    id: 2,
    title: '新功能上线通知',
    content: '我们新增了学习计划功能，帮助你更好地规划学习时间，提高学习效率！',
    author: '系统通知',
    avatar: 'https://picsum.photos/200?random=2',
    time: '昨天',
    likes: 95,
    comments: 24,
    type: 'update',
    badge: '更新',
  },
  {
    id: 3,
    title: '每周学习挑战',
    content: '本周挑战：完成5道算法题，赢取额外积分奖励！参与即有机会获得精美礼品。',
    author: '管理员',
    avatar: 'https://picsum.photos/200?random=3',
    time: '3天前',
    likes: 156,
    comments: 42,
    type: 'challenge',
    badge: '挑战',
  },
  {
    id: 4,
    title: '学习资源分享',
    content: '分享一些高质量的学习资源，包括视频教程、电子书和实用工具，助力大家学习进步！',
    author: '李老师',
    avatar: 'https://picsum.photos/200?random=4',
    time: '5天前',
    likes: 210,
    comments: 68,
    type: 'share',
    badge: '分享',
  },
];

const handleViewAll = () => {
  console.log('跳转到全部动态页');
};

const handlePostClick = (post) => {
  console.log('点击了动态：', post);
};

// 里程碑提示计算
const showMilestoneHint = computed(() => {
  const nextDay = signInStats.value.currentDay;
  return nextDay === 7 || nextDay === 14 || nextDay === 21 || nextDay === 30 || nextDay === 60 || nextDay === 100;
});

const milestoneHint = computed(() => {
  const nextDay = signInStats.value.currentDay;
  const milestones = {
    7: '坚持到第7天额外奖励 +20积分！',
    14: '坚持到第14天额外奖励 +50积分！',
    21: '坚持到第21天额外奖励 +100积分！',
    30: '坚持到第30天额外奖励 +200积分！🎉',
    60: '坚持到第60天额外奖励 +300积分！🏆',
    100: '坚持到第100天额外奖励 +500积分！👑',
  };
  return milestones[nextDay] || '';
});
</script>

<style scoped>
@import "../../css/main/Home.css";
</style>