import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import type {UserInfo} from "../../type/UserInfo.ts";
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

};

export type SignInInfo = {
    consecutiveSignInDays: number;
    maxConsecutiveSignInDays: number;
    signInCount: number;
    isSigned: boolean;
};