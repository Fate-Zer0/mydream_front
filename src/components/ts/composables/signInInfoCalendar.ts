import {useUserStore} from "../stores/user";
import {useAlertStore} from "../stores/alert";
import {onBeforeUnmount,onMounted,ref} from "vue";
import {withRequest} from "./useRequest";
import api from "../api/api";
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
        const userid = userStore.getUserid();

        if (!userid) return;
        const res = await withRequest(() =>
            api.account.user.getSignInDates(userid,year,month)
        );
        if (res.retCode === "0000") {
            const dates = res.retValue;
            return dates;
        } else {
            useAlertStore().showAlertWithAutoHide(
                "alert-danger",
                `错误: ${res.retDesc || "后台发生异常，请稍后再试!"}`,
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