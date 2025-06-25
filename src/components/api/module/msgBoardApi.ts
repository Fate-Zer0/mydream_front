import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";
import type {MsgBoard} from "../../type/MsgBoard.ts";

export default {
    /**
     * 获取留言板信息
     */
    getMsgBoardInfo(user_id: string): Promise<ReturnValue<MsgBoard[]>> {
        return request.get("/module/msgBoard/getMsgBoardInfo", {
            params: { user_id: user_id },
        });
    },
    /**
     * 添加留言
     */
    addMsgBoard(msgBoard: MsgBoard ): Promise<ReturnValue<String>> {
        return request.post("/module/msgBoard/addMsgBoard",msgBoard , {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
}