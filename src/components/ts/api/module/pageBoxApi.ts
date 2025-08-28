import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import {FileInfo} from "../../type/FileInfo";
import {PageBox} from "../../type/PageBox";

export default {
    getPageList(user_id: string):Promise<ReturnValue<PageBox[]>> {
        return request.get("/module/page/getPageList", {
            params: { user_id: user_id },
        });
    },
    uploadImage(file: File):Promise<ReturnValue<FileInfo>> {
        const formData = new FormData();
        formData.append("file", file);
        return request.post("/module/page/uploadImage", formData, );
    },
    addPage(pageBox:PageBox):Promise<ReturnValue<String>> {
        return request.post("/module/page/addPage", pageBox,{
            headers: {
                "Content-Type": "application/json",
            },
        });
    },

}