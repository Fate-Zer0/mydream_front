// src/stores/user.ts
import { defineStore } from 'pinia'

interface UserState {
    userid: string;
    username: string;
    userimgUrl: string;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userid: '',
        username: '',
        userimgUrl: ''
    }),
    actions: {
        setUserInfo(userid: string,username: string, userimgUrl: string) {
            this.userid = userid;
            this.username = username;
            this.userimgUrl = userimgUrl;
        }
    }
});