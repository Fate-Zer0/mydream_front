import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		// 重定向
		beforeEnter: () => {
			return { path: "/login" };
		},
		component: () => import("../../../views/App.vue"),
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("../../../views/main/Login.vue"),
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("../../../views/main/Home.vue"),
	},
	{
		path: "/help",
		name: "Help",
		component: () => import("../../../views/main/Help.vue"),
	},
	{
		path: "/messageBoard",
		name: "MessageBoard",
		component: () => import("../../../views/module/msgBoard/MessageBoard.vue"),
	},
	{
		path: "/myinfo",
		name: "Myinfo",
		component: () => import("../../../views/main/MyInfo.vue"),
	},
	{
		path: "/securityQuestion",
		name: "SecurityQuestion",
		component: () => import("../../../views/main/SecurityQuestion.vue"),
	},
	{
		path: "/forgetPassword",
		name: "ForgetPassword",
		component: () => import("../../../views/main/ForgetPassword.vue"),
	},
];

export const loginRouter = createRouter({
	history: createWebHistory(),
	routes,
});

export default loginRouter;
