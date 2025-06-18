import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import type {MsgBoard} from "../../type/MsgBoard.ts";

export default {
    /**
     * 获取留言板信息
     */
    getMsgBoardInfo(userid: string): Promise<ReturnValue<MsgBoard[]>> {
        return request.get("/module/msgBoard/getMsgBoardInfo", {
            params: { user_id: userid },
        });
    },
}