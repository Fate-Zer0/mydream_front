import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "../../stores/user.ts";
import { useRouter } from "vue-router";
import { useAlertStore } from "../../stores/alert.ts";

export function useHomeProcess() {
	const hasSigned = ref(false);

	const router = useRouter();

	const isSigningIn = ref(false);
	const signInStats = ref({
		consecutive: 0,
		total: 0,
	});

	async function getSigningInInfo(userid?: string) {
		try {
			console.log("查询签到信息");

			if (!userid) {
				useAlertStore().showAlertWithAutoHide(
					"alert-warning",
					"错误: 用户ID不能为空!",
				);
				return;
			}
			isSigningIn.value = true;
			const res = await axios.get(
				`/api/account/auth/getSignInInfo?userid=${userid}`,
			);
			const ret = res.data;

			if (ret.retCode === "0000") {
				const map = ret.retValue;
				signInStats.value.consecutive = map.consecutiveSignInDays;
				signInStats.value.total = map.signInCount;
				hasSigned.value = map.isSigned;
			} else {
				useAlertStore().showAlertWithAutoHide(
					"alert-danger",
					`错误: ${ret.retDesc || "后台发生异常，请稍后再试!"}`,
				);
			}
		} catch (error) {
			console.error("签到信息获取请求失败:", error);
			useAlertStore().showAlertWithAutoHide(
				"alert-danger",
				"错误: 网络异常，请检查网络连接!",
			);
		} finally {
			isSigningIn.value = false;
		}
	}

	//退出登录
	function logout() {
		localStorage.removeItem("user");

		const userStore = useUserStore();
		userStore.setUserid("");
		userStore.setUsername("");

		// 3. 跳转到登录页
		router.push({ name: "Login" });
	}
	async function handleSignIn(userid?: string) {
		// 修复2: 添加 userid 参数
		try {
			console.log("用户签到");

			if (!userid) {
				useAlertStore().showAlertWithAutoHide(
					"alert-warning",
					"错误: 用户ID不能为空!",
				);
				return;
			}
			isSigningIn.value = true;
			const res = await axios.post("/api/account/auth/signIn", userid, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			const ret = res.data;
			if (ret.retCode === "0000") {
				if (ret.retValue) {
					useAlertStore().showAlertWithAutoHide(
						"alert-success",
						"成功: 签到成功!",
					);
					hasSigned.value = true;

					getSigningInInfo(userid);
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
					`错误: ${ret.retDesc || "后台发生异常，请稍后再试!"}`,
				);
			}
		} catch (error) {
			console.error("签到请求失败:", error);
			useAlertStore().showAlertWithAutoHide(
				"alert-danger",
				"错误: 网络异常，请检查网络连接!",
			);
		} finally {
			isSigningIn.value = false;
		}
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
