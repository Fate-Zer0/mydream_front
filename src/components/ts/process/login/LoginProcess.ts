// src/composables/useLoginForm.ts
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import { withRequest } from "../../composables/useRequest";
import api from "../../api/api";
import type { User } from "../../type/User";
import websocket from "../../websocket/websocket";

const userStore = useUserStore();
export function useLoginForm() {
	const router = useRouter();

	const isLogin = ref(true);
	const username = ref("");
	const password = ref("");
	const confirmPassword = ref("");
	const rememberMe = ref(false);
	const showAlert = ref(false);
	const alertType = ref<"alert-warning" | "alert-success" | "alert-danger">(
		"alert-warning",
	);
	const alertMessage = ref("Warning: Invalid email address!");
	const loading = ref(false); // <- 加载状态
	const showPassword = ref(false);
	const showConfirmPassword = ref(false);

	const handleSubmit = async () => {
		if (loading.value) return; // 防止重复提交

		if (isLogin.value) {
			const user: User = {
				user_id: null,
				user_name: username.value,
				user_pw: password.value,
				user_img: null,
			};

			const res = await withRequest(() =>
				api.account.auth.chickLogin(user),
			);

			if (res?.retValue) {
				if (res.retCode == "0000") {
					const userinfo = res.retValue;

					userStore.setUserid(userinfo.user_id);
					userStore.setUsername(userinfo.user_name);
					if (userinfo.user_img) {
						userStore.setUserimg(userinfo.user_img);
					}

					userStore.setStorageUser(rememberMe.value);

					// 登录后连接 WebSocket
					websocket.getInstance().connect(userinfo.user_id);

					// await withRequest(() =>
					// 	api.account.user.updateUserStatus(userStore.getUser(),"20002"),
					// );

					alertType.value = "alert-success";
					alertMessage.value = "成功: 登陆成功,即将跳转到首页!";
					showAlert.value = true;

					router.push({ name: "Home" });
				} else if (res.retCode == "2222") {
					alertType.value = "alert-warning";
					alertMessage.value = "错误: 用户名或密码不正确!";
					showAlert.value = true;
				} else {
					alertType.value = "alert-warning";
					alertMessage.value = "错误: 后台发生异常，请稍后再试!";
					showAlert.value = true;
				}
			}
			loading.value = false; // 结束加载
		} else {
			if (username.value === "") {
				alertType.value = "alert-warning";
				alertMessage.value = "警告: 请输入用户名!";
				showAlert.value = true;
				return;
			}
			if (
				password.value !== confirmPassword.value &&
				password.value !== ""
			) {
				alertType.value = "alert-warning";
				alertMessage.value = "警告: 两次输入的密码不一致!";
				showAlert.value = true;
				return;
			}

			const user: User = {
				user_id: "",
				user_name: username.value,
				user_pw: password.value,
				user_img: null,
			};

			loading.value = true; // 开始加载
			const res = await withRequest(() => api.account.auth.signUp(user));

			if (res?.retValue) {
				switch (res.retCode) {
					case "0000":
						password.value = "";
						isLogin.value = true;
						alertType.value = "alert-success";
						alertMessage.value =
							"成功: 注册成功,请重新输入账号密码登陆!";
						showAlert.value = true;
						break;
					case "2222":
						alertType.value = "alert-warning";
						alertMessage.value = "错误: 用户已存在!";
						showAlert.value = true;
						break;
					default:
						alertType.value = "alert-warning";
						alertMessage.value = "错误: 后台发生异常，请稍后再试!";
						showAlert.value = true;
						break;
				}
			}
			loading.value = false; // 结束加载
		}
	};

	return {
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
	};
}
