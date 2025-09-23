import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import {FileInfo} from "../../type/FileInfo";
import {PageBox} from "../../type/PageBox";
import type {ShareFileInfo} from "../../type/ShareFileInfo";

export default {
    getShareList(user_id: string):Promise<ReturnValue<ShareFileInfo[]>> {
        return request.get("/module/shareFile/getShareList", {
            params: { user_id: user_id },
        });
    },
    uploadShare(
        file: File,
        shareFileInfo: ShareFileInfo,
        onUploadProgress?: (progress: number) => void
    ): Promise<ReturnValue<ShareFileInfo>> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("shareFileInfoString", JSON.stringify(shareFileInfo));

        return request.post("/module/shareFile/uploadShare", formData, {
            timeout: 600000,
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`上传进度：${percentCompleted}%`);
                    onUploadProgress?.(percentCompleted); // 👈 传递给外部
                }
            },
        });
    },
}