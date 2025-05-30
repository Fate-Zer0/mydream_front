import { defineStore } from "pinia";
import { ref } from "vue";
export const useAlertStore = defineStore("alert", {
	state: () => ({
		showAlert: ref(false),
		alertType: ref<"alert-warning" | "alert-success" | "alert-danger">(
			"alert-warning",
		),
		alertMessage: ref("Warning: Invalid email address!"),
		hasSigned: ref(false),
		alertTimer: ref<ReturnType<typeof setTimeout> | null>(null), // 用于存储定时器
		remainingTime: 2000, // 剩余时间
		startTime: 0, // 开始时间
	}),
	actions: {
		// 显示警告并设置自动消失
		showAlertWithAutoHide(
			type: "alert-warning" | "alert-success" | "alert-danger",
			message: string,
		) {
			// 清除之前的定时器
			if (this.alertTimer) {
				clearTimeout(this.alertTimer);
			}
			this.alertType = type;
			this.alertMessage = message;
			this.showAlert = true;
			// 重置时间
			this.remainingTime = 2000;
			this.startTime = Date.now();
			// 3秒后自动隐藏
			this.alertTimer = setTimeout(() => {
				this.showAlert = false;
				this.alertTimer = null;
			}, this.remainingTime);
		},

		// 暂停自动消失（鼠标悬停时）
		pauseAutoHide() {
			if (this.alertTimer) {
				clearTimeout(this.alertTimer);
				// 计算剩余时间
				const elapsed = Date.now() - this.startTime;
				this.remainingTime = Math.max(0, this.remainingTime - elapsed);
				this.alertTimer = null;
			}
		},

		// 恢复自动消失（鼠标移开时）
		resumeAutoHide() {
			if (this.showAlert && !this.alertTimer && this.remainingTime > 0) {
				this.startTime = Date.now();
				this.alertTimer = setTimeout(() => {
					this.showAlert = false;
					this.alertTimer = null;
				}, this.remainingTime);
			}
		},

		closeAlert() {
			if (this.alertTimer) {
				clearTimeout(this.alertTimer);
				this.alertTimer = null;
			}
			this.showAlert = false;
		},
	},
});
