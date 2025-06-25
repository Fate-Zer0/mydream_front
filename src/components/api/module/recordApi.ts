import request from "../../utils/request";
import type { ReturnValue } from "../../type/ReturnValue";

export default {
    /**
     * 点赞
     */
    addRecord(userid: string,passive_id: string,rec_type: string, obj_id : number): Promise<ReturnValue<String>> {
        return request.get("/module/record/addRecord", {
            params: { user_id: userid , passive_id: passive_id, rec_type: rec_type, obj_id: obj_id },
        });
    },
}