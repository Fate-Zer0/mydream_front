import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// WebSocketService 示例引入（请根据你的实际路径修改）
import WebSocketService from "../../websocket/websocket";
import {useUserStore} from "../../stores/user";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
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
	{
		path: "/chat",
		name: "Chat",
		component: () => import("../../../views/module/friend/Chat.vue"),
	},
	{
		path: "/pageBox",
		name: "PageBox",
		component: () => import("../../../views/main/PageBox.vue"),
	},
	{
		path: "/mosi",
		name: "Mosi",
		component: () => import("../../../views/module/tool/mosi.vue"),
	},
	{
		path: "/car",
		name: "Car",
		component: () => import("../../../views/module/tool/car.vue"),
	},
	{
		path: "/share",
		name: "Share",
		component: () => import("../../../views/module/tool/share.vue"),
	},
];

// 创建路由器实例
const router = createRouter({
	history: createWebHistory(),
	routes,
});

// 👇 在这里添加导航守卫
router.beforeEach((to, from, next) => {
	const userStore = useUserStore();

	if (userStore.getStorageUser()) {
		const user_id = userStore.getUserid();

		if (user_id && !WebSocketService.getInstance().isConnected()) {
			WebSocketService.getInstance().connect(user_id);
		}
	} else {
		// 可选：未登录时断开 WebSocket 连接
		if (WebSocketService.getInstance().isConnected()) {
			WebSocketService.getInstance().disconnect();
		}
	}

	next();
});

// 导出路由器
export default router;