<template>
	<div class="drawer min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
		<!-- 抽屉开关 -->
		<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<!-- 👇 顶部导航栏 - 使用渐变和毛玻璃效果 -->
			<header
				class="navbar z-[9999] border-b border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl backdrop-blur-sm"
			>
				<div class="flex-1">
					<a
						class="btn btn-ghost text-xl font-bold normal-case text-white transition-all duration-300 hover:bg-white/10"
					>
						<span class="mr-2 text-2xl">📘</span> 日积月累
					</a>
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
					<div
						class="divider divider-horizontal m-0 h-10 opacity-30"
					></div>

					<div class="dropdown dropdown-end ml-4 mr-4">
						<label
							tabindex="0"
							class="btn btn-ghost btn-circle avatar transition-transform duration-200 hover:scale-110"
						>
							<div
								class="w-10 rounded-full ring-2 ring-white/30 transition-all duration-200 hover:ring-white/50"
							>
								<img
									src="https://picsum.photos/200"
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
							<div class="card-body items-center p-6 text-center">
								<!-- 优化后的头像区域 -->
								<div class="avatar indicator mb-4">
									<div
										class="ring-primary ring-offset-base-100 hover:ring-secondary h-24 w-24 rounded-full shadow-xl ring-4 ring-offset-4 transition-all duration-500 hover:scale-110 hover:shadow-2xl"
									>
										<img
											:src="
												userStore.userimgUrl ||
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
									{{ userStore.username || "游客" }}
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

								<div class="card-actions mt-6 w-full">
									<button
										class="btn w-full rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
										:class="{
											'btn-disabled bg-gray-200':
												hasSigned,
											'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 hover:from-indigo-600 hover:to-purple-700':
												!hasSigned && !isSigningIn,
										}"
										:disabled="hasSigned || isSigningIn"
										@click="handleSignIn(userStore.userid)"
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
											<strong>+10</strong></span
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
								<button
									class="btn btn-sm rounded-xl font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
									:class="module.buttonClass"
								>
									<span class="mr-1">{{
										module.buttonIcon
									}}</span>
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
			<ul
				class="menu w-80 border-r border-gray-200 bg-white/95 p-6 text-gray-700 backdrop-blur-sm"
			>
				<div class="mb-6 px-4">
					<h3 class="mb-2 text-lg font-bold text-gray-800">
						导航菜单
					</h3>
					<div
						class="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
					></div>
				</div>
				<li>
					<a
						class="rounded-lg py-3 transition-colors duration-200 hover:bg-indigo-50"
						>🏠 首页</a
					>
				</li>
				<li>
					<a
						class="rounded-lg py-3 transition-colors duration-200 hover:bg-indigo-50"
						>📊 数据统计</a
					>
				</li>
				<li>
					<a
						class="rounded-lg py-3 transition-colors duration-200 hover:bg-indigo-50"
						>⚙️ 系统设置</a
					>
				</li>
				<li>
					<a
						class="rounded-lg py-3 transition-colors duration-200 hover:bg-indigo-50"
						>❓ 帮助支持</a
					>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { onMounted, nextTick, ref, computed } from "vue";
import { useUserStore } from "../../stores/user";
import { useCarousel } from "../../composables/useCarousel";
import { useHomeProcess } from "../../process/home/HomeProcess";

const userStore = useUserStore();

// 功能模块数据
const modules = ref([
	{
		title: "学习管理",
		description:
			"记录和管理你的学习进度，制定学习计划，追踪知识点掌握情况。",
		icon: "📚",
		iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
		bgColor: "from-blue-500 to-indigo-500",
		buttonClass:
			"bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",
		buttonIcon: "📖",
	},
	{
		title: "目标追踪",
		description: "设定个人目标，追踪完成进度，让每一天的努力都有迹可循。",
		icon: "🎯",
		iconBg: "bg-gradient-to-br from-emerald-100 to-green-100",
		bgColor: "from-emerald-500 to-green-500",
		buttonClass:
			"bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700",
		buttonIcon: "🚀",
	},
	{
		title: "数据分析",
		description: "深入分析学习数据，发现学习模式，优化学习策略和效率。",
		icon: "📈",
		iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
		bgColor: "from-purple-500 to-pink-500",
		buttonClass:
			"bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700",
		buttonIcon: "📊",
	},
]);

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

onMounted(async () => {
	await nextTick();
	checkForSlides();
	await getSigningInInfo(userStore.userid);
});
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
