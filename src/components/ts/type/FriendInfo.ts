import type {User} from "./User";

export type FriendInfo = {
    fri_id : string,
    user : User,
    friend : User,
    createtime: string,
    state : string
}