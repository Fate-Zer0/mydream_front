import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'

// 引入 Vue Router 实例（假设 loginRouter 是导出的 router 实例）
import router from './components/router/login/LoginRouter'

// 引入根组件
import App from './components/views/App.vue'

// 创建 Pinia 实例
const pinia = createPinia()

// 创建 Vue 应用实例，并挂载根组件
const app = createApp(App)

// 使用插件
app.use(pinia)
app.use(router)

// 挂载到 #login 元素上
app.mount('#app')