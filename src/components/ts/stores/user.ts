import { defineStore } from "pinia";
import type {User} from "../type/User";
import type {FileInfo} from "../type/FileInfo";

export const useUserStore = defineStore("user", {
	state: (): User => ({
		user_id: "",
		user_name: "",
		user_pw: "",
		user_img: null,
	}),
	actions: {
		setUserInfo(userid: string, username: string, user_img: FileInfo) {
			this.user_id = userid;
			this.user_name = username;
			this.user_img = user_img;
		},
		setUserid(userid: string) {
			this.user_id = userid;
		},
		setUsername(username: string) {
			this.user_name = username;
		},
		setUserimg(user_img: FileInfo) {
			this.user_img = user_img;
		},
		getUserid() {
			return this.user_id;
		},
		getUsername() {
			return this.user_name;
		},
		getUserimg() {
			return this.user_img;
		},
		getUser(){
			return {
				user_id: this.user_id,
				user_name: this.user_name,
				user_pw: this.user_pw,
				user_img: this.user_img,
			};
		},
		getStorageUser() {
			const savedUser =
				localStorage.getItem("user") || sessionStorage.getItem("user");
			if (savedUser) {
				const user = JSON.parse(savedUser);
				this.setUserInfo(user.user_id, user.user_name, user.user_img);
				return true;
			}
			return false;
		},
		setStorageUser(local?: boolean) {
			let p =
				local === undefined
					? localStorage.getItem("user")
						? true
						: false
					: local;
			localStorage.removeItem("user");
			sessionStorage.removeItem("user");
			if (p === true) {
				console.log("setLocalUser", {
					id: this.user_id,
					name: this.user_name,
					img: this.user_img,
				});
				localStorage.setItem(
					"user",
					JSON.stringify({
						user_id: this.user_id,
						user_name: this.user_name,
						user_pw: "",
						user_img: this.user_img,
					}),
				);
			} else {
				console.log("setSessionUser", {
					id: this.user_id,
					name: this.user_name,
					img: this.user_img,
				});
				sessionStorage.setItem(
					"user",
					JSON.stringify({
						user_id: this.user_id,
						user_name: this.user_name,
						user_pw: "",
						user_img: this.user_img,
					}),
				);
			}
		},
		logout() {
			this.user_id = "";
			this.user_name = "";
			this.user_img = null;
			localStorage.removeItem("user");
			sessionStorage.removeItem("user");
		},
	},
});
