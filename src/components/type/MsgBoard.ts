import type {User} from "./User";

export type MsgBoard = {
    msg_id: number
    msg_content: string
    user: User
    msg_upcount: number
    isup: boolean
    msg_time: string
    hf_msgbds: MsgBoard[]
}