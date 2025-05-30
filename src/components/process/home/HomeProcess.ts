import { ref } from 'vue'
import axios from 'axios'
import {useUserStore} from "../../stores/user.ts";
import {useRouter} from "vue-router";

export function useHomeProcess() {
    const showAlert = ref(false)
    const alertType = ref<'alert-warning' | 'alert-success' | 'alert-danger'>('alert-warning')
    const alertMessage = ref('Warning: Invalid email address!')
    const hasSigned = ref(false)
    let alertTimer: ReturnType<typeof setTimeout> | null = null  // 用于存储定时器
    let remainingTime = 2000  // 剩余时间
    let startTime = 0  // 开始时间

    const router = useRouter()

    const isSigningIn = ref(false)
    const signInStats = ref({
        consecutive: 0,
        total: 0
    })


    async function getSigningInInfo(userid?: string){
        try {
            console.log('查询签到信息')

            if (!userid) {
                showAlertWithAutoHide('alert-warning', '错误: 用户ID不能为空!')
                return
            }
            isSigningIn.value = true

            const res = await axios.get(`/api/account/auth/getSignInInfo?userid=${userid}`)
            const ret = res.data

            if (ret.retCode === "0000") {
                const map = ret.retValue
                signInStats.value.consecutive = map.consecutiveSignInDays
                signInStats.value.total = map.signInCount
                hasSigned.value = map.isSigned
            } else {
                showAlertWithAutoHide('alert-danger', `错误: ${ret.retDesc || '后台发生异常，请稍后再试!'}`)
            }
        } catch (error) {
            console.error('签到信息获取请求失败:', error)
            showAlertWithAutoHide('alert-danger', '错误: 网络异常，请检查网络连接!')
        } finally {
            isSigningIn.value = false
        }
    }

    //退出登录
    function logout() {
        localStorage.removeItem('user')

        const userStore = useUserStore()
        userStore.setUserid("")
        userStore.setUsername("")

        // 3. 跳转到登录页
        router.push({ name: 'Login' })
    }

    // 显示警告并设置自动消失
    function showAlertWithAutoHide(type: 'alert-warning' | 'alert-success' | 'alert-danger', message: string) {
        // 清除之前的定时器
        if (alertTimer) {
            clearTimeout(alertTimer)
        }

        alertType.value = type
        alertMessage.value = message
        showAlert.value = true

        // 重置时间
        remainingTime = 2000
        startTime = Date.now()

        // 3秒后自动隐藏
        alertTimer = setTimeout(() => {
            showAlert.value = false
            alertTimer = null
        }, remainingTime)
    }

    // 暂停自动消失（鼠标悬停时）
    function pauseAutoHide() {
        if (alertTimer) {
            clearTimeout(alertTimer)
            // 计算剩余时间
            const elapsed = Date.now() - startTime
            remainingTime = Math.max(0, remainingTime - elapsed)
            alertTimer = null
        }
    }

    // 恢复自动消失（鼠标移开时）
    function resumeAutoHide() {
        if (showAlert.value && !alertTimer && remainingTime > 0) {
            startTime = Date.now()
            alertTimer = setTimeout(() => {
                showAlert.value = false
                alertTimer = null
            }, remainingTime)
        }
    }

    async function handleSignIn(userid?: string) {  // 修复2: 添加 userid 参数
        try {
            console.log('用户签到')

            if (!userid) {
                showAlertWithAutoHide('alert-warning', '错误: 用户ID不能为空!')
                return
            }

            isSigningIn.value = true

            const res = await axios.post('/api/account/auth/signIn', userid, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const ret = res.data

            if (ret.retCode === "0000") {
                if (ret.retValue) {
                    showAlertWithAutoHide('alert-success', '成功: 签到成功!')
                    hasSigned.value = true

                    getSigningInInfo(userid);
                } else {
                    showAlertWithAutoHide('alert-danger', '失败: 今日已签到!')
                    hasSigned.value = true
                }
            } else {
                showAlertWithAutoHide('alert-danger', `错误: ${ret.retDesc || '后台发生异常，请稍后再试!'}`)
            }
        } catch (error) {
            console.error('签到请求失败:', error)
            showAlertWithAutoHide('alert-danger', '错误: 网络异常，请检查网络连接!')
        } finally {
            isSigningIn.value = false
        }
    }

    // 修复10: 添加关闭警告的方法
    function closeAlert() {
        if (alertTimer) {
            clearTimeout(alertTimer)
            alertTimer = null
        }
        showAlert.value = false
    }

    return {
        showAlert,
        alertType,
        alertMessage,
        hasSigned,
        isSigningIn,
        signInStats,
        handleSignIn,  // 确保返回 handleSignIn 方法
        closeAlert,    // 返回关闭警告的方法
        pauseAutoHide, // 暂停自动消失
        resumeAutoHide, // 恢复自动消失
        logout,
        getSigningInInfo
    }
}