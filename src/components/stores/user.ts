// src/stores/user.ts
import { defineStore } from 'pinia'

interface UserState {
    username: string;
    avatarUrl: string;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        username: '',
        avatarUrl: ''
    }),
    actions: {
        setUserInfo(username: string, avatarUrl: string) {
            this.username = username;
            this.avatarUrl = avatarUrl;
        }
    }
});