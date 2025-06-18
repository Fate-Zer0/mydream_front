import type {File} from "./File";

export type User = {
    user_id: string,
    user_name: string,
    user_pw: string,
    user_img : File,
};