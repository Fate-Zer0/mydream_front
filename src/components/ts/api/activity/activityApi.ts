import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";

export type UserActivityItem = {
    activityId: number;
    userId: string;
    username: string;
    avatar: string;
    activityType: string;
    activityTitle: string;
    activityDesc: string;
    relatedId: string;
    createTime: string;
};

export type CreateActivityRequest = {
    userId: string;
    activityType: string;  // SIGN_IN, FILE, MESSAGE, PIANO, GAME, ACHIEVEMENT
    activityTitle: string;
    activityDesc: string;
    relatedId?: string;
    isPublic?: number;
};

export default {
    /**
     * 获取最新动态列表
     */
    getRecentActivities(limit: number = 20): Promise<ReturnValue<UserActivityItem[]>> {
        return request.get("/activity/getRecentActivities", {
            params: { limit },
        });
    },

    /**
     * 获取指定用户的动态列表
     */
    getUserActivities(userId: string, limit: number = 20): Promise<ReturnValue<UserActivityItem[]>> {
        return request.get("/activity/getUserActivities", {
            params: { userId, limit },
        });
    },

    /**
     * 创建用户动态
     */
    createActivity(activity: CreateActivityRequest): Promise<ReturnValue<boolean>> {
        return request.post("/activity/createActivity", activity, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
};
