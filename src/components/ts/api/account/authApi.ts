import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import type {User} from "../../type/User";

/**
 * 接口服务模块
 */
export default {
    /**
     * 检测登录信息
     * @param userid - 用户ID
     */
    chickLogin(user : User): Promise<ReturnValue<User>> {
        return request.post("/account/auth/chickLogin",user, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

    /**
     * 用户签到
     * @param userid - 用户ID
     */
    signUp(user : User): Promise<ReturnValue<Boolean>> {
        return request.post("/account/auth/signUp", {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
};
