<template>
	<div
		class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4"
	>
		<!-- 动态背景装饰 -->
		<div class="absolute inset-0 overflow-hidden">
			<div class="floating-shapes">
				<div class="shape shape-1"></div>
				<div class="shape shape-2"></div>
				<div class="shape shape-3"></div>
				<div class="shape shape-4"></div>
				<div class="shape shape-5"></div>
			</div>
		</div>

		<!-- 光晕效果 -->
		<div
			class="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500 opacity-20 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animation-delay-2000 absolute right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animation-delay-4000 absolute bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-xl filter"
		></div>

		<!-- 登录/注册面板 -->
		<div class="card bg-base-100 z-10 w-full max-w-md shadow-xl">
			<div class="card-body space-y-6 p-8">
				<!-- 标题 -->
				<h2
					class="from-primary to-secondary animate-fade-in w-full bg-gradient-to-r bg-clip-text text-center text-3xl font-bold text-transparent"
				>
					<span class="text-primary">📘</span> 日积月累
				</h2>

				<!-- 登录/注册切换标签 - 增强样式 -->
				<div
					class="tabs tabs-boxed bg-base-200/50 mx-auto rounded-full p-1 backdrop-blur-sm"
				>
					<a
						class="tab rounded-full transition-all duration-300 hover:scale-105"
						:class="{
							'tab-active from-primary to-secondary bg-gradient-to-r text-white shadow-lg':
								isLogin,
						}"
						@click="
							isLogin = true;
							showAlert = false;
						"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
							/>
						</svg>
						登录
					</a>
					<a
						class="tab rounded-full transition-all duration-300 hover:scale-105"
						:class="{
							'tab-active from-primary to-secondary bg-gradient-to-r text-white shadow-lg':
								!isLogin,
						}"
						@click="
							isLogin = false;
							showAlert = false;
						"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.07a6.75 6.75 0 0113.5 0v.07"
							/>
						</svg>
						注册
					</a>
				</div>

				<!-- 表单with动画 -->
				<form @submit.prevent="handleSubmit" class="space-y-5">
					<!-- 用户名 -->
					<div class="form-control">
						<label class="label">
							<span
								class="label-text flex items-center font-medium"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-primary mr-2 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								用户名
							</span>
						</label>
						<div class="group relative">
							<input
								type="text"
								placeholder="请输入用户名"
								v-model="username"
								class="input input-bordered w-full pr-10 transition-all duration-300 focus:scale-105 focus:shadow-lg group-hover:shadow-md"
							/>
						</div>
					</div>

					<!-- 密码 -->
					<div class="form-control">
						<label class="label">
							<span
								class="label-text flex items-center font-medium"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-primary mr-2 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								密码
							</span>
						</label>
						<div class="group relative">
							<input
								:type="showPassword ? 'text' : 'password'"
								placeholder="请输入密码"
								v-model="password"
								class="input input-bordered w-full pr-10 transition-all duration-300 focus:scale-105 focus:shadow-lg group-hover:shadow-md"
								@input="showAlert = false"
							/>
							<button
								type="button"
								@click="showPassword = !showPassword"
								class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
							>
								<svg
									v-if="!showPassword"
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								<svg
									v-else
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- 注册时显示确认密码 -->
					<div v-if="!isLogin" class="form-control form-slide-in">
						<label class="label">
							<span
								class="label-text flex items-center font-medium"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="text-primary mr-2 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								确认密码
							</span>
						</label>
						<div class="group relative">
							<input
								:type="
									showConfirmPassword ? 'text' : 'password'
								"
								type="password"
								placeholder="请再次输入密码"
								v-model="confirmPassword"
								class="input input-bordered w-full pr-10 transition-all duration-300 focus:scale-105 focus:shadow-lg group-hover:shadow-md"
								@input="showAlert = false"
							/>
							<button
								type="button"
								@click="
									showConfirmPassword = !showConfirmPassword
								"
								class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
							>
								<svg
									v-if="!showConfirmPassword"
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								<svg
									v-else
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
									/>
								</svg>
							</button>
						</div>
					</div>

					<!-- 警告信息with动画 -->
					<transition name="alert-slide">
						<div
							v-if="showAlert"
							:class="[
								'alert',
								alertType,
								'mt-4',
								'animate-shake',
							]"
							role="alert"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<span>{{ alertMessage }}</span>
						</div>
					</transition>

					<!-- 记住我 & 忘记密码 -->
					<div
						v-if="isLogin"
						class="flex items-center justify-between text-sm"
					>
						<label
							class="label hover:bg-base-200/50 cursor-pointer gap-2 rounded-lg px-2 py-1 transition-colors"
						>
							<input
								type="checkbox"
								class="checkbox checkbox-primary checkbox-sm"
								v-model="rememberMe"
							/>
							<span class="label-text">记住我</span>
						</label>
						<a
							href="#"
							class="link link-hover link-primary font-medium"
							>忘记密码？</a
						>
					</div>

					<!-- 提交按钮with增强效果 -->
					<div class="form-control mt-8">
						<button
							type="submit"
							class="btn btn-primary btn-block from-primary to-secondary hover:from-primary-focus hover:to-secondary-focus group relative transform overflow-hidden bg-gradient-to-r normal-case shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
							:disabled="loading"
						>
							<!-- 按钮背景动画 -->
							<div
								class="group-hover:animate-shine absolute inset-0 -skew-x-12 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
							></div>

							<!-- 加载动画 -->
							<span
								v-if="loading"
								class="loading loading-spinner loading-sm mr-2"
							></span>

							<!-- 按钮图标 -->
							<svg
								v-if="!loading"
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									v-if="isLogin"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
								/>
								<path
									v-else
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.07a6.75 6.75 0 0113.5 0v.07"
								/>
							</svg>

							<!-- 按钮文字 -->
							<span class="font-medium">
								{{
									loading
										? "处理中..."
										: isLogin
											? "立即登录"
											: "立即注册"
								}}
							</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<style scoped>
/* 动画关键帧 */
@keyframes float {
	0%,
	100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-20px);
	}
}

@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes shake {
	0%,
	100% {
		transform: translateX(0);
	}
	25% {
		transform: translateX(-5px);
	}
	75% {
		transform: translateX(5px);
	}
}

@keyframes shine {
	0% {
		transform: translateX(-100%) skewX(-12deg);
	}
	100% {
		transform: translateX(200%) skewX(-12deg);
	}
}

/* 应用动画 */
.animate-fade-in {
	animation: fade-in 0.6s ease-out;
}

.animate-shake {
	animation: shake 0.5s ease-in-out;
}

.animate-shine {
	animation: shine 1.5s ease-in-out;
}

/* 浮动形状 */
.floating-shapes {
	position: absolute;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: 0;
}

.shape {
	position: absolute;
	background: linear-gradient(
		45deg,
		rgba(99, 102, 241, 0.1),
		rgba(168, 85, 247, 0.1)
	);
	border-radius: 50%;
	animation: float 6s ease-in-out infinite;
}

.shape-1 {
	width: 80px;
	height: 80px;
	top: 10%;
	left: 10%;
	animation-delay: 0s;
}

.shape-2 {
	width: 60px;
	height: 60px;
	top: 20%;
	right: 10%;
	animation-delay: 1s;
}

.shape-3 {
	width: 100px;
	height: 100px;
	bottom: 20%;
	left: 5%;
	animation-delay: 2s;
}

.shape-4 {
	width: 40px;
	height: 40px;
	top: 60%;
	right: 20%;
	animation-delay: 3s;
}

.shape-5 {
	width: 70px;
	height: 70px;
	bottom: 10%;
	right: 40%;
	animation-delay: 4s;
}

/* 延迟动画类 */
.animation-delay-2000 {
	animation-delay: 2s;
}

.animation-delay-4000 {
	animation-delay: 4s;
}

/* 表单动画 */
.form-slide-in {
	animation: fade-in 0.3s ease-out;
}

/* 过渡动画 */
.alert-slide-enter-active,
.alert-slide-leave-active {
	transition: all 0.3s ease;
}

.alert-slide-enter-from {
	transform: translateY(-10px);
	opacity: 0;
}

.alert-slide-leave-to {
	transform: translateY(-10px);
	opacity: 0;
}

/* 卡片悬停效果 */
.card:hover {
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 输入框聚焦效果 */
.input:focus {
	box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* 响应式调整 */
@media (max-width: 480px) {
	.card {
		margin: 1rem;
	}

	.card-body {
		padding: 1.5rem;
	}
}
</style>

<script setup>
import { useLoginForm } from "../../process/login/LoginProcess";

const {
	isLogin,
	showPassword,
	showConfirmPassword,
	username,
	password,
	confirmPassword,
	rememberMe,
	showAlert,
	alertType,
	alertMessage,
	loading,
	handleSubmit,
} = useLoginForm();
</script>
