import {createApp, onUnmounted} from 'vue'
import { createPinia } from 'pinia'
import './style.css'

// 引入 Vue Router 实例（假设 loginRouter 是导出的 router 实例）
import router from './components/ts/router/login/LoginRouter'

// 引入根组件
import App from './components/views/App.vue'
import {useUserStore} from "./components/ts/stores/user";
import {withRequest} from "./components/ts/composables/useRequest";
import api from "./components/ts/api/api";

// 创建 Pinia 实例
const pinia = createPinia()

// 创建 Vue 应用实例，并挂载根组件
const app = createApp(App)

// 使用插件
app.use(pinia)
app.use(router)


const userStore = useUserStore();
let unloadHandler: (() => void) | null = null;

unloadHandler = async () => {
    if (userStore && userStore.getUser().user_id != null && userStore.getUser().user_id != "") {
        try {
            await withRequest(() =>
                api.account.user.updateUserStatus(userStore.getUser(),"20001"),
            );
        } catch (error) {
            console.error("Failed to update user status:", error);
        }
    }
};

window.addEventListener('beforeunload', unloadHandler);


// 当应用销毁时清理监听器
app.config.globalProperties.unloadListener = unloadHandler;

onUnmounted(() => {
    window.removeEventListener('beforeunload', unloadHandler)
})

// 挂载到 #login 元素上
app.mount('#app')