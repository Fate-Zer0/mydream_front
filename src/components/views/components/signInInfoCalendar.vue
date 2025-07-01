<template>
  <div class="calendar-component">
    <!-- 年月标题 -->
    <div class="flex justify-between items-center mb-4">
      <button
          @click="prevMonth"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <span class="text-lg font-semibold text-gray-800 dark:text-white">{{ monthYearLabel }}</span>
      <button
          @click="nextMonth"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- 星期头 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
          v-for="day in weekDays"
          :key="day"
          class="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- 日期格子 -->
    <div class="grid grid-cols-7 gap-1">
      <div
          v-for="date in dates"
          :key="date.dateStr || `${date.day}-${date.isPadding}`"
          class="relative w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-all duration-200 cursor-pointer"
          :class="getDateClass(date)"
          :title="getDateTitle(date)"
          @click="handleDateClick(date)"
      >
        <span class="relative z-10">{{ date.day }}</span>

        <!-- 签到标记背景 -->
        <div
            v-if="isSigned(date.date)"
            class="absolute inset-0 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 opacity-90"
        ></div>

        <!-- 今天标记 -->
        <div
            v-if="isToday(date.date)"
            class="absolute inset-0 rounded-lg border-2 border-indigo-500"
        ></div>

        <!-- 选中状态 -->
        <div
            v-if="isSelected(date.date)"
            class="absolute inset-0 rounded-lg border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/30"
        ></div>

        <!-- 签到成功标记点 -->
        <div
            v-if="isSigned(date.date)"
            class="absolute top-1 right-1 w-2 h-2 bg-white rounded-full shadow-sm"
        ></div>

        <!-- 特殊标记 -->
        <div
            v-if="hasSpecialMark(date.date)"
            class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"
        ></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref, computed, watch, onBeforeUnmount} from 'vue'
import { useUserStore } from "../../ts/stores/user";

// Props 定义
const props = defineProps({
  // 已签到的日期数组，格式: ['2025-06-01', '2025-06-02']
  signedDates: {
    type: Array,
    default: () => []
  },
  // 初始显示的月份
  initialDate: {
    type: Date,
    default: () => new Date()
  },
  // 选中的日期
  selectedDate: {
    type: Date,
    default: null
  },
  // 特殊标记的日期数组
  specialDates: {
    type: Array,
    default: () => []
  },
  // 是否显示统计信息
  showStats: {
    type: Boolean,
    default: true
  },
  // 星期标题，可自定义
  weekDays: {
    type: Array,
    default: () => ['日','一','二','三','四','五','六']
  },
  // 是否可以点击日期
  clickable: {
    type: Boolean,
    default: true
  },
  // 是否显示其他月份的日期
  showOtherMonth: {
    type: Boolean,
    default: true
  }
})

// Emits 定义
const emit = defineEmits(['date-click', 'month-change', 'update:selectedDate'])

// 响应式数据
const currentMonth = ref(new Date(props.initialDate))

// 计算属性
const monthYearLabel = computed(() => {
  const options = { year: 'numeric', month: 'long' }
  return currentMonth.value.toLocaleDateString('zh-CN', options)
})

const dates = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startDay = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const result = []

  // 填充前面空位（上个月的日期）
  if (props.showOtherMonth) {
    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(year, month, -startDay + i + 1)
      result.push({
        day: prevDate.getDate(),
        date: prevDate,
        isPadding: true,
        dateStr: toLocalDateStr(prevDate)
      })
    }
  } else {
    for (let i = 0; i < startDay; i++) {
      result.push({
        day: '',
        date: null,
        isPadding: true,
        dateStr: null
      })
    }
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day)
    const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    result.push({
      day: date.getDate(),        // ✅ 使用 date.getDate()
      dateStr: localDateStr,
      date,
      isPadding: false
    })
  }

  // 填充后面空位（下个月的日期）
  const totalCells = result.length
  const padding = (42 - totalCells) // 6行7列 = 42格
  if (props.showOtherMonth && padding > 0) {
    for (let i = 0; i < padding; i++) {
      const nextDate = new Date(year, month + 1, i + 1)
      result.push({
        day: nextDate.getDate(),
        date: nextDate,
        isPadding: true,
        dateStr: toLocalDateStr(nextDate)
      })
    }
  } else {
    for (let i = 0; i < padding; i++) {
      result.push({
        day: '',
        date: null,
        isPadding: true,
        dateStr: null
      })
    }
  }

  return result.slice(0, 42) // 最多显示6行
})

const currentMonthSignCount = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  return props.signedDates.filter(dateStr => {
    const date = new Date(dateStr)
    return date.getFullYear() === year && date.getMonth() === month
  }).length
})

const totalSignCount = computed(() => {
  return props.signedDates.length
})

// 监听器
watch(() => props.initialDate, (newDate) => {
  if (newDate) {
    currentMonth.value = new Date(newDate)
  }
}, { immediate: true })

// 方法
function toLocalDateStr(date) {
  if (!date) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const isSigned = (date) => {
  if (!date) return false

  const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return props.signedDates.includes(localDateStr)
}

const isToday = (date) => {
  if (!date) return false
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isSelected = (date) => {
  if (!date || !props.selectedDate) return false
  return date.toDateString() === props.selectedDate.toDateString()
}

const hasSpecialMark = (date) => {
  if (!date) return false
  const dateStr = toLocalDateStr(date)
  return props.specialDates.includes(dateStr)
}

const getDateClass = (date) => {
  const classes = []

  if (date.isPadding) {
    classes.push('text-gray-300 dark:text-gray-600')
  } else {
    classes.push('text-gray-700 dark:text-gray-200')
    if (props.clickable) {
      classes.push('hover:bg-gray-100 dark:hover:bg-gray-700')
    }
  }

  if (isSigned(date.date)) {
    classes.push('text-white font-semibold shadow-sm')
  }

  if (isToday(date.date)) {
    classes.push('font-bold')
  }

  if (isSelected(date.date)) {
    classes.push('ring-2 ring-blue-400')
  }

  return classes.join(' ')
}

const getDateTitle = (date) => {
  if (!date) return ''

  const titles = []
  if (isSigned(date.date)) titles.push('已签到')
  if (isToday(date.date)) titles.push('今天')
  if (isSelected(date.date)) titles.push('已选中')
  if (hasSpecialMark(date.date)) titles.push('特殊标记')

  return titles.join(' · ')
}

const handleDateClick = (date) => {
  if (!props.clickable || !date.date) return

  // 发射点击事件
  emit('date-click', {
    date: date.date,
    dateStr: date.dateStr,
    isSigned: isSigned(date.date),
    isToday: isToday(date.date),
    isPadding: date.isPadding
  })

  // 更新选中日期
  emit('update:selectedDate', date.date)
}

const prevMonth = () => {
  currentMonth.value = new Date(
      currentMonth.value.getFullYear(),
      currentMonth.value.getMonth() - 1,
      1
  )
  emitMonthChange()
}

const nextMonth = () => {
  currentMonth.value = new Date(
      currentMonth.value.getFullYear(),
      currentMonth.value.getMonth() + 1,
      1
  )
  emitMonthChange()
}

const emitMonthChange = () => {
  emit('month-change', {
    year: currentMonth.value.getFullYear(),
    month: currentMonth.value.getMonth() + 1,
    date: new Date(currentMonth.value)
  })
}

// 公共方法（通过 defineExpose 暴露）
const goToMonth = (year, month) => {
  currentMonth.value = new Date(year, month, 1)
  emitMonthChange()
}

const goToToday = () => {
  currentMonth.value = new Date()
  emitMonthChange()
}

// 暴露方法给父组件使用
defineExpose({
  goToMonth,
  goToToday
})
</script>

<style scoped>
@import '../../css/components/signInInfoCalendar.css';
</style>