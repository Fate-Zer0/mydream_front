<template>
  <div class="user-info-card-container">
    <!-- 用户头像触发区域 -->
    <div
        ref="avatarRef"
        class="avatar-trigger"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
      <slot></slot>
    </div>

    <!-- 用户信息卡片 -->
    <Teleport to="body">
      <Transition name="user-card">
        <div
            v-if="showCard"
            ref="cardRef"
            class="user-info-card"
            :style="cardStyle"
            @mouseenter="handleCardMouseEnter"
            @mouseleave="handleCardMouseLeave"
        >
          <div class="card-content">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p class="loading-text">正在加载用户信息...</p>
            </div>

            <!-- 用户信息 -->
            <div v-else-if="userInfo" class="user-info">
              <!-- 用户头像和基本信息 -->
              <div class="user-header">
                <div class="user-avatar">
                  <img
                      :src="userInfo.user.user_img?.file_url || 'https://picsum.photos/200'"
                      :alt="userInfo.user.user_name"
                      class="avatar-img"
                  />
                  <div class="avatar-overlay"></div>
                </div>
                <div class="user-basic">
                  <h3 class="user-name">
                    {{ userInfo.user.user_name }}
                    <div class="user-status">
                      {{ userInfo.user_status_name }}
                    </div>
                  </h3>
                  <div class="user-meta">
                    <span class="user-sex">
                      <span class="meta-icon">👤</span>
                      {{ userInfo.user_sex_name || '未知' }}
                    </span>
                    <span class="user-points">
                      <span class="meta-icon">💎</span>
                      {{ userInfo.user_points || 0 }} 积分
                    </span>
                  </div>
                </div>
              </div>

              <!-- 个性签名 -->
              <div class="user-signature">
                <div class="signature-header">
                  <span class="signature-icon">✨</span>
                  <span class="signature-title">个性签名</span>
                </div>
                <p class="signature-text">
                  {{ userInfo.user_grjj || '用户当前没有设置个性签名' }}
                </p>
              </div>

              <!-- 用户统计信息 -->
              <div class="user-stats">
                <div class="stat-item">
                  <div class="stat-label">
                    <span class="stat-icon">📅</span>
                    注册时间
                  </div>
                  <span class="stat-value">{{ formatDate(userInfo.user_create_date) }}</span>
                </div>
                <div class="stat-item">
                  <div class="stat-label">
                    <span class="stat-icon">⏰</span>
                    最后登录
                  </div>
                  <span class="stat-value">{{ formatDateSignin(userInfo.last_sign_in_date) }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="user-actions">
                <button
                    @click="addFriend"
                    class="btn-add-friend"
                    :disabled="isAddingFriend || isFriend"
                >
                  <span v-if="isAddingFriend" class="loading loading-spinner loading-xs"></span>
                  <span v-else class="btn-icon">
                    {{ isFriend ? '✅' : '👥' }}
                  </span>
                  {{
                    isAddingFriend ? '添加中...' :
                        isFriend ? '已添加' : '添加好友'
                  }}
                </button>

                <button @click="sendMessage" class="btn-message">
                  <span class="btn-icon">💬</span>
                  发消息
                </button>
              </div>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="error" class="error-state">
              <div class="error-icon">😵</div>
              <p class="error-message">{{ error }}</p>
              <button @click="retryLoad" class="retry-btn">
                <span class="btn-icon">🔄</span>
                重试
              </button>
            </div>
          </div>

          <!-- 卡片箭头 -->
          <div class="card-arrow" :style="arrowStyle"></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUnmounted } from 'vue'
import type { UserInfo } from '../../ts/type/UserInfo'
import {withRequest} from "../../ts/composables/useRequest";
import api from "../../ts/api/api";
import {useUserStore} from "../../ts/stores/user";
import {useAlertStore} from "../../ts/stores/alert";

const userStore = useUserStore();
const alertStore = useAlertStore();
interface Props {
  userId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addFriend: [userId: string]
  sendMessage: [userId: string]
}>()

// 响应式数据
const showCard = ref(false)
const loading = ref(false)
const userInfo = ref<UserInfo | null>(null)
const error = ref<string | null>(null)
const isAddingFriend = ref(false)
const isFriend = ref(false)

// DOM 引用
const avatarRef = ref<HTMLElement>()
const cardRef = ref<HTMLElement>()

// 鼠标悬停状态
const isHoveringAvatar = ref(false)
const isHoveringCard = ref(false)

// 卡片位置
const cardPosition = ref({ x: 0, y: 0 })
const arrowPosition = ref({ x: 0, y: 0 })

// 延迟定时器
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

// 计算卡片样式
const cardStyle = computed(() => ({
  left: `${cardPosition.value.x}px`,
  top: `${cardPosition.value.y}px`,
  transform: 'translateY(-50%)'
}))

// 计算箭头样式
const arrowStyle = computed(() => ({
  left: `${arrowPosition.value.x}px`,
  top: `${arrowPosition.value.y}px`
}))

// 鼠标进入头像
function handleMouseEnter() {
  isHoveringAvatar.value = true

  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  showTimer = setTimeout(() => {
    if (isHoveringAvatar.value) {
      showUserCard()
    }
  }, 300)
}

// 鼠标离开头像
function handleMouseLeave() {
  isHoveringAvatar.value = false

  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }

  scheduleHideCard()
}

// 鼠标进入卡片
function handleCardMouseEnter() {
  isHoveringCard.value = true

  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 鼠标离开卡片
function handleCardMouseLeave() {
  isHoveringCard.value = false
  scheduleHideCard()
}

// 安排隐藏卡片
function scheduleHideCard() {
  hideTimer = setTimeout(() => {
    if (!isHoveringAvatar.value && !isHoveringCard.value) {
      hideUserCard()
    }
  }, 200)
}

// 显示用户卡片
async function showUserCard() {
  if (!avatarRef.value) return

  const avatarRect = avatarRef.value.getBoundingClientRect()
  const cardWidth = 340
  const cardHeight = 320

  let x = avatarRect.right + 15
  let y = avatarRect.top + avatarRect.height / 2

  // 检查右侧空间是否足够
  if (x + cardWidth > window.innerWidth) {
    x = avatarRect.left - cardWidth - 15
  }

  // 检查垂直位置
  if (y - cardHeight / 2 < 10) {
    y = cardHeight / 2 + 10
  } else if (y + cardHeight / 2 > window.innerHeight - 10) {
    y = window.innerHeight - cardHeight / 2 - 10
  }

  cardPosition.value = { x, y }

  // 计算箭头位置
  const arrowY = avatarRect.top + avatarRect.height / 2 - y + cardHeight / 2
  arrowPosition.value = { x: x > avatarRect.right ? -10 : cardWidth, y: arrowY }

  showCard.value = true

  await chickIsFriend()
  await loadUserInfo()
}

// 隐藏用户卡片
function hideUserCard() {
  showCard.value = false
  setTimeout(() => {
    if (!showCard.value) {
      userInfo.value = null
      error.value = null
    }
  }, 300)
}

// 加载用户信息
async function loadUserInfo() {
  if (userInfo.value) return

  loading.value = true
  error.value = null

  try {
    const res = await withRequest(() => api.account.user.getUserInfo(props.userId));
    if (res?.retValue) {
      userInfo.value = res.retValue
    } else {
      error.value = '加载用户信息失败'
    }
  } catch (err) {
    error.value = '加载用户信息失败'
    console.error('加载用户信息失败:', err)
  } finally {
    loading.value = false
  }
}

async function chickIsFriend(){
  if (userInfo.value) return

  loading.value = true
  error.value = null

  const user_id = userStore.getUserid();

  try {
    const res = await withRequest(() => api.module.friend.chickIsFriend(user_id,props.userId));
    isFriend.value = res.retValue;
  } catch (err) {
    error.value = '加载好友信息失败'
    console.error('加载好友信息失败:', err)
  } finally {
    loading.value = false
  }
}

// 重试加载
function retryLoad() {
  loadUserInfo()
  chickIsFriend()
}

// 添加好友
async function addFriend() {
  if (!userInfo.value) {
    isAddingFriend.value = false
    return
  }


  isAddingFriend.value = true
  const user_id = userStore.getUserid();

  if(user_id == props.userId){
    alertStore.showAlertWithAutoHide("alert-warning", "请勿添加自己为好友");
    await chickIsFriend()
    isAddingFriend.value = false
    return
  }

  try {
    const res = await withRequest(() => api.module.friend.addFriend(user_id,props.userId));
    if(res?.retCode=="0000"){
      alertStore.showAlertWithAutoHide("alert-success", `已发送添加请求`);
    }else{
      alertStore.showAlertWithAutoHide("alert-warning", res.retDesc);
    }
  } catch (err) {
    console.error('添加好友失败:', err)
  } finally {
    const res = await withRequest(() => api.module.friend.chickIsFriend(user_id,props.userId));
    isFriend.value = res.retValue;
    await new Promise(resolve => setTimeout(resolve, 200))
    isAddingFriend.value = false
  }
}

// 发送消息
function sendMessage() {
  if (!userInfo.value) return

  emit('sendMessage', props.userId)
  hideUserCard()
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateSignin = (dateString: string): string => {
  if (!dateString) return '未知'

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1

  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else if (diffDays < 30) {
    return `${Math.ceil(diffDays / 7)}周前`
  } else if (diffDays < 365) {
    return `${Math.ceil(diffDays / 30)}月前`
  } else {
    return `${Math.ceil(diffDays / 365)}年前`
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (showTimer) {
    clearTimeout(showTimer)
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
})
</script>

<style scoped>
@import '../../css/components/userInfoCard.css';
</style>