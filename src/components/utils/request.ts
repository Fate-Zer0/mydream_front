import axios from "axios";
import { useAlertStore } from "../stores/alert";

const service = axios.create({
    baseURL: "/api",
    timeout: 5000,
});

service.interceptors.response.use(
    (response) => {
        const data = response.data;

        if (data.retCode !== "0000") {
            const alertStore = useAlertStore();
            alertStore.showAlertWithAutoHide("alert-danger", `错误: ${data.retDesc}`);
            return Promise.reject(new Error(data.retDesc || "请求失败"));
        }

        return data;
    },
    (error) => {
        const alertStore = useAlertStore();
        alertStore.showAlertWithAutoHide("alert-danger", "网络异常，请检查连接");
        return Promise.reject(error);
    }
);

export default service;