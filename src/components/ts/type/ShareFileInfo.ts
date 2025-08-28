import type {FileInfo} from "./FileInfo";
import type {User} from "./User";
import {Tag} from "./Tag";

export type ShareFileInfo = {
    share_id: string;
    share_user: User;
    share_file: FileInfo;
    file_name: string;
    share_time: string;
    file_size: string;
    file_type: string;
    description: string;
    share_state: string;
    tags: Tag[];
}