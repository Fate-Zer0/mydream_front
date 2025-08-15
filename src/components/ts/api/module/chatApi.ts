import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import type {Message} from "../../type/Message";
import type {ChatInfo} from "../../type/ChatInfo";

export default {

    getChatMassageList(send_id: string, receive_id: string, msg_state: string):Promise<ReturnValue<Message[]>>{
        return request.get("/module/chat/getChatMassageList", {
            params: { send_id: send_id ,receive_id:receive_id,msg_state:msg_state},
        });
    },
    getChatMessageListByUseridAndFriendid(user_id: string, friend_id: string):Promise<ReturnValue<Message[]>>{
        return request.get("/module/chat/getChatMessageListByUseridAndFriendid", {
            params: { user_id: user_id ,friend_id:friend_id},
        });
    },
    addChatMassage(message:Message):Promise<ReturnValue<String>>{
        return request.post("/module/chat/addChatMassage",message , {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
    getChatInfoList(user_id:String):Promise<ReturnValue<ChatInfo[]>>{
        return request.get("/module/chat/getChatInfoList", {
            params: { user_id: user_id},
        });
    },
    getLastMessage(user_id: string, friend_id: string):Promise<ReturnValue<Message>>{
        return request.get("/module/chat/getLastMessage", {
            params: { user_id: user_id,friend_id:friend_id},
        });
    },
}