<template>
	<div id="app">
		<router-view />

<!--    <pet />-->
	</div>

	<!-- 警告信息 - 优化样式 -->
	<div
		v-if="showAlert"
		:class="['alert', alertType, 'alert-top-fixed', 'animate-slide-down']"
		role="alert"
		@mouseenter="pauseAutoHide"
		@mouseleave="resumeAutoHide"
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
		<button
			@click="closeAlert"
			class="btn btn-sm btn-ghost ml-auto rounded-full hover:bg-white/20"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "/src/components/ts/stores/user";
import { useAlertStore } from "../ts/stores/alert";
import { computed } from "vue";
import Pet from "./module/pet/Pet.vue";

const router = useRouter();
const userStore = useUserStore();
const alert = useAlertStore();

// 提示框
const showAlert = computed(() => alert.showAlert);
const alertMessage = computed(() => alert.alertMessage);
const alertType = computed(() => alert.alertType);
const pauseAutoHide = computed(() => alert.pauseAutoHide);
const resumeAutoHide = computed(() => alert.resumeAutoHide);
const closeAlert = computed(() => alert.closeAlert);

userStore.getStorageUser();

router.beforeEach((to, from, next) => {
	switch (to.name) {
		case "Login":
			if (userStore.getUserid()) {
				next({ name: "Home" });
			}
			next();
			break;
		case "ForgetPassword":
			next();
			break;
		default:
			if (!userStore.getUserid()) {
        console.log(userStore.getUserid());
        console.log(!userStore.getUserid());
				useAlertStore().showAlertWithAutoHide(
					"alert-danger",
					"请先登录！",
				);
				console.log("未登录");

				next({ name: "Login" });
			} else {
				next();
			}
			break;
	}
});
</script>

<style>
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
.animate-slide-down {
	animation: slide-down 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
