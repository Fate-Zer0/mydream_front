import { defineStore } from "pinia";

interface UserState {
	userid: string;
	username: string;
	userimgUrl: string;
}

export const useUserStore = defineStore("user", {
	state: (): UserState => ({
		userid: "",
		username: "",
		userimgUrl: "",
	}),
	actions: {
		setUserInfo(userid: string, username: string, userimgUrl: string) {
			this.userid = userid;
			this.username = username;
			this.userimgUrl = userimgUrl;
		},
		setUserid(userid: string) {
			this.userid = userid;
		},
		setUsername(username: string) {
			this.username = username;
		},
		setUserimgUrl(userimgUrl: string) {
			this.userimgUrl = userimgUrl;
		},
		getStorageUser() {
			const savedUser =
				localStorage.getItem("user") || sessionStorage.getItem("user");
			if (savedUser) {
				const user = JSON.parse(savedUser);
				this.setUserInfo(user.id, user.name, user.imgUrl);
				return true;
			}
			return false;
		},
		setLocalUser() {
			console.log("setLocalUser", {
				id: this.userid,
				name: this.username,
				imgUrl: this.userimgUrl,
			});
			localStorage.setItem(
				"user",
				JSON.stringify({
					id: this.userid,
					name: this.username,
					imgUrl: this.userimgUrl,
				}),
			);
		},
		setSessionUser() {
			console.log("setSessionUser", {
				id: this.userid,
				name: this.username,
				imgUrl: this.userimgUrl,
			});
			sessionStorage.setItem(
				"user",
				JSON.stringify({
					id: this.userid,
					name: this.username,
					imgUrl: this.userimgUrl,
				}),
			);
		},
		logout() {
			this.userid = "";
			this.username = "";
			this.userimgUrl = "";
			localStorage.removeItem("user");
			sessionStorage.removeItem("user");
		},
	},
});
