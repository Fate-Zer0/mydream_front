import type {FileInfo} from "./FileInfo";

export type User = {
    user_id: string,
    user_name: string,
    user_pw: string,
    user_img : FileInfo,
};