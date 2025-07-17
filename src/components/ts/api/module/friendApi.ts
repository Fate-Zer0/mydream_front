import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import type {FriendInfo} from "../../type/FriendInfo.ts";
import type {User} from "../../type/User.ts";

export default {

    /**
     * 查询是不是好友
     */
    chickIsFriend(user_id: string,friend_id: string): Promise<ReturnValue<boolean>> {
        return request.get('/module/friend/chickIsFriend', {
            params: { user_id: user_id , friend_id: friend_id },
        });
    },
    /**
     * 发送添加好友
     */
    addFriend(user_id: string,friend_id: string): Promise<ReturnValue<Boolean>> {
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("friend_id", friend_id);
        return request.post("/module/friend/addFriend", formData, );
    },
    /**
     * 获取好友请求列表
     */
    getAddFriendInfo(user_id: string, friend_id: string, state: string):Promise<ReturnValue<FriendInfo[]>>{
        return request.get("/module/friend/getAddFriendInfo", {
            params: { user_id: user_id , friend_id: friend_id,state:state},
        });
    },
    /**
     * 更新添加好友信息
     */
    updateFriendState(fri_id: string, state: string):Promise<ReturnValue<Boolean>>{
        const formData = new FormData();
        formData.append("fri_id", fri_id);
        formData.append("state", state);
        return request.post("/module/friend/updateFriendState", formData, );
    },
    /**
     * 搜索用户列表
     */
    searchUser(user_name: string):Promise<ReturnValue<User[]>> {
        return request.get("/module/friend/searchUser", {
            params: {user_name: user_name},
        });
    }

}