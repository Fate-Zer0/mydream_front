import type {Message} from "./Message";
import type {UserInfo} from "./UserInfo";

export type ChatInfo = {
    chat_user: UserInfo,
    lastMessage: Message,
    unread_count: number,
    chat_count: number
}