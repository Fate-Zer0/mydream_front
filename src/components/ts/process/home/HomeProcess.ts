import { ref } from "vue";
import { useUserStore } from "../../stores/user";
import { useRouter } from "vue-router";
import { useAlertStore } from "../../stores/alert";
import { withRequest } from "../../composables/useRequest";
import api from "../../api/api";
import websocket from "../../websocket/websocket";

export function useHomeProcess() {
	const hasSigned = ref(false);

	const router = useRouter();

	const isSigningIn = ref(false);
	const signInStats = ref({
		consecutive: 0,
		maxConsecutive: 0,
		total: 0,
	});

	async function getSigningInInfo(userid?: string) {
		if (!userid) return;
		isSigningIn.value = true;
		const res = await withRequest(() => api.account.user.getSignInInfo(userid));
		if (res?.retValue) {
			const map = res.retValue;
			signInStats.value.consecutive = map.consecutiveSignInDays;
			signInStats.value.maxConsecutive = map.maxConsecutiveSignInDays;
			signInStats.value.total = map.signInCount;
			hasSigned.value = map.isSigned;
		}
		isSigningIn.value = false;
	}

	//退出登录
	async function logout() {
		const userStore = useUserStore();

		// await withRequest(() =>
		// 	api.account.user.updateUserStatus(userStore.getUser(),"20001"),
		// );

		if (websocket.getInstance().isConnected()) {
			websocket.getInstance().disconnect();
		}

		userStore.logout();

		// 3. 跳转到登录页
		router.push({ name: "Login" });
	}
	async function handleSignIn() {
		const userStore = useUserStore();
		const user_id = userStore.getUserid();

		if (!user_id) return;
		isSigningIn.value = true;

		const res = await withRequest(() => api.account.user.signIn(user_id));
		if (res?.retValue) {
			if (res.retCode === "0000") {
				if (res.retValue) {
					useAlertStore().showAlertWithAutoHide(
						"alert-success",
						"成功: 签到成功!",
					);
					hasSigned.value = true;

					getSigningInInfo(user_id);
				} else {
					useAlertStore().showAlertWithAutoHide(
						"alert-danger",
						"失败: 今日已签到!",
					);
					hasSigned.value = true;
				}
			} else {
				useAlertStore().showAlertWithAutoHide(
					"alert-danger",
					`错误: ${res.retDesc || "后台发生异常，请稍后再试!"}`,
				);
			}
		}
		isSigningIn.value = false;
	}
	return {
		hasSigned,
		isSigningIn,
		signInStats,
		handleSignIn, // 确保返回 handleSignIn 方法
		logout,
		getSigningInInfo,
	};
}
