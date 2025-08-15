import type {FileInfo} from "./FileInfo";

export type Message = {
    msg_id: string,
    msg_content: string,
    createtime: string,
    send_id: string,
    receive_id: string,
    msg_type: string,
    msg_state: string,
    file_info: FileInfo,
    send_type: string
}
