import type {Tag} from "./Tag";
import type {FileInfo} from "./FileInfo";

export type PageBox = {
    pb_id: string;
    pb_name: string;
    description: string;
    category: string;
    pb_img: FileInfo;
    pb_url: string;
    tags: Tag[];
    status: string;
    pb_state: string;
    isFavorite: string;
    createtime: string;
};