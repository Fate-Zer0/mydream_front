import {useUserStore} from "../stores/user";
import {useAlertStore} from "../stores/alert";
import axios from "axios";
import {onBeforeUnmount,onMounted,ref} from "vue";
export function signInInfoCalendar() {

    const showCalendar = ref(false)
    const hideTimer = ref(null)
    const selectedDate = ref(null)
    const signedDates = ref([])
    const showFlag = ref(false)

    onMounted(async () => {
        initSignInfo();
    })

    async function initSignInfo() {
        // 初始加载当前月份的数据
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1 // 注意：getMonth() 是 0 开始的，所以加1

        signedDates.value = await getSignInByYearAndMonth(year, month)
    }
    function handleDateClick(dateInfo){
        console.log('日期点击:', dateInfo)
    }
    async function handleMonthChange(monthInfo){
        console.log('月份变化:', monthInfo)
        const year = monthInfo.year
        const month = monthInfo.month
        signedDates.value = await getSignInByYearAndMonth(year, month)
    }
    async function getSignInByYearAndMonth(year, month) {
        const userStore = useUserStore();
        const userid = userStore.userid;

        try {
            console.log("查询签到信息");

            if (!userid) {
                useAlertStore().showAlertWithAutoHide(
                    "alert-warning",
                    "错误: 用户ID不能为空!",
                );
                return;
            }
            const res = await axios.get('/api/account/user/getSignInDates', {
                params: {
                    user_id: userid,
                    year,
                    month
                }
            })
            const ret = res.data;

            if (ret.retCode === "0000") {
                const dates = ret.retValue;
                return dates;
            } else {
                useAlertStore().showAlertWithAutoHide(
                    "alert-danger",
                    `错误: ${ret.retDesc || "后台发生异常，请稍后再试!"}`,
                );
            }
        } catch (error) {
            console.error("月份签到信息获取请求失败:", error);
            useAlertStore().showAlertWithAutoHide(
                "alert-danger",
                "错误: 网络异常，请检查网络连接!",
            );
        }
    }
    function hideCalendarWithDelay() {
        hideTimer.value = setTimeout(() => {
            if(!showFlag.value){
                showCalendar.value = false
            }
        }, 300)
        showFlag.value = false
    }
    function cancelHideCalendar(){
        if (!showCalendar.value) {
            showCalendar.value = true
            initSignInfo()
        }
        showFlag.value = true
    }

    onBeforeUnmount(() => {
        if (hideTimer.value) {
            clearTimeout(hideTimer.value)
        }
    })

    return {
        showCalendar,
        hideTimer,
        selectedDate,
        signedDates,
        handleDateClick,
        handleMonthChange,
        cancelHideCalendar,
        hideCalendarWithDelay,
        initSignInfo
    }

}