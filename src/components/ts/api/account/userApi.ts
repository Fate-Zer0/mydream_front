import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import type {UserInfo} from "../../type/UserInfo";
import type {FileInfo} from "../../type/FileInfo";
import type {UserSerQuestion} from "../../type/UserSerQuestion.ts";
/**
 * 接口服务模块
 */
export default {
    /**
     * 获取用户签到信息
     * @param userid - 用户ID
     */
    getSignInInfo(userid: string): Promise<ReturnValue<SignInInfo>> {
        return request.get("/account/user/getSignInInfo", {
            params: { user_id: userid },
        });
    },

    /**
     * 签到
     * @param userid - 用户ID
     */
    signIn(userid: string): Promise<ReturnValue<Boolean>> {
        return request.post("/account/user/signIn", userid, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    /**
     * 获取用户签到日期
     * @param userid  - 用户ID
     * @param year - 年份
     * @param month - 月份
     */
    getSignInDates(userid: string,  year: number, month: number): Promise<ReturnValue<[]>> {
        return request.get("/account/user/getSignInDates", {
            params: { user_id: userid ,year, month},
        });
    },

    /**
     * 获取用户信息
     * @param userid - 用户ID
     */
    getUserInfo(userid: string): Promise<ReturnValue<UserInfo>> {
        return request.get("/account/user/getUserInfo", {
            params: { user_id: userid },
        });
    },

    /**
     * 更新用户信息
     * @param userid - 用户ID
     */
    updateUserInfo(userInfo: UserInfo): Promise<ReturnValue<Boolean>> {
        return request.post("/account/user/updateUserInfo", userInfo, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    updateUserImg(userid: string, file: File): Promise<ReturnValue<FileInfo>> {
        const formData = new FormData();
        formData.append("user_id", userid);
        formData.append("file", file);
        return request.post("/account/user/updateUserImg", formData, );
    },

    updateUserSecQuestion(userSerQuestions: UserSerQuestion[]): Promise<ReturnValue<String>>{
        return request.post("/account/user/updateUserSecQuestion", userSerQuestions, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    getUserSecQuestion(userid: string): Promise<ReturnValue<UserSerQuestion[]>>{
        return request.get("/account/user/getUserSecQuestion", {
            params: { user_id: userid },
        });
    },

    getUserSecQuestionNoAnswer(username: string): Promise<ReturnValue<UserSerQuestion[]>>{
        return request.get("/account/user/getUserSecQuestionNoAnswer", {
            params: { user_name: username },
        });
    },

    checkAnswer(secq_id: string,answer: string): Promise<ReturnValue<Boolean>> {
        return request.get("/account/user/checkAnswer", {
            params: {secq_id:secq_id , answer: answer },
        });
    },

    updateUserPassword(user_name: string, new_password: string): Promise<ReturnValue<Boolean>>{
        const formData = new FormData();
        formData.append("user_name", user_name);
        formData.append("password", new_password);
        return request.post("/account/user/updateUserPassword", formData, );
    },


};

export type SignInInfo = {
    consecutiveSignInDays: number;
    maxConsecutiveSignInDays: number;
    signInCount: number;
    isSigned: boolean;
};