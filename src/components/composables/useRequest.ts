import { useAlertStore } from "../stores/alert";

/**
 * 封装 try/catch 请求执行器
 * @param requestFn - 异步请求函数
 * @param options - 可选配置项，比如 loading 控制等
 */
export async function withRequest<T>(
    requestFn: () => Promise<T>,
    options?: {
        hideLoading?: boolean;
    }
): Promise<T | null> {
    const alertStore = useAlertStore();
    const { hideLoading = false } = options || {};

    // 如果需要 loading 状态，可以在这里设置全局 loading
    if (!hideLoading) {
        // 例如：useLoadingStore().startLoading()
    }

    try {
        const result = await requestFn();
        return result;
    } catch (error: any) {
        console.error("请求异常:", error);

        // 提取错误信息并展示提示
        const message = error?.response?.data?.retDesc ||
            error?.message ||
            "网络异常，请检查连接";

        alertStore.showAlertWithAutoHide("alert-danger", `错误: ${message}`);
        return null;
    } finally {
        if (!hideLoading) {
            // 例如：useLoadingStore().endLoading()
        }
    }
}