import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export function useHomeProcess() {
    const showAlert = ref(false)
    const alertType = ref<'alert-warning' | 'alert-success' | 'alert-danger'>('alert-warning')
    const alertMessage = ref('Warning: Invalid email address!')
    const hasSigned = ref(false)
    const router = useRouter()  // 修复1: 添加 router 导入和初始化
    let alertTimer: NodeJS.Timeout | null = null  // 用于存储定时器
    let remainingTime = 3000  // 剩余时间
    let startTime = 0  // 开始时间

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
        remainingTime = 3000
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

            // 修复3: 检查 userid 是否存在
            if (!userid) {
                showAlertWithAutoHide('alert-warning', '错误: 用户ID不能为空!')
                return
            }

            // 修复4: 正确传递 userid 参数
            const res = await axios.get(`/api/account/auth/signIn?userid=${userid}`)
            const ret = res.data

            if (ret.retCode === "0000") {  // 修复5: 使用严格相等比较
                if (ret.retValue) {
                    showAlertWithAutoHide('alert-success', '成功: 签到成功!')
                    hasSigned.value = true  // 修复6: 只有成功时才设置已签到

                    // 可选: 延迟跳转，让用户看到成功消息
                    setTimeout(() => {
                        router.push({ name: 'Home' })
                    }, 1500)
                } else {
                    showAlertWithAutoHide('alert-danger', '错误: 签到失败!')
                }
            } else {
                showAlertWithAutoHide('alert-danger', `错误: ${ret.retDesc || '后台发生异常，请稍后再试!'}`)
            }
        } catch (error) {  // 修复9: 添加异常处理
            console.error('签到请求失败:', error)
            showAlertWithAutoHide('alert-danger', '错误: 网络异常，请检查网络连接!')
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
        handleSignIn,  // 确保返回 handleSignIn 方法
        closeAlert,    // 返回关闭警告的方法
        pauseAutoHide, // 暂停自动消失
        resumeAutoHide // 恢复自动消失
    }
}