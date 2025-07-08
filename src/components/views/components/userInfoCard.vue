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
                    :disabled="isAddingFriend"
                >
                  <span v-if="isAddingFriend" class="loading loading-spinner loading-xs"></span>
                  <span v-else class="btn-icon">👥</span>
                  {{ isAddingFriend ? '添加中...' : '添加好友' }}
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

// 重试加载
function retryLoad() {
  loadUserInfo()
}

// 添加好友
async function addFriend() {
  if (!userInfo.value) return

  isAddingFriend.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('addFriend', props.userId)
    console.log('好友添加成功')
  } catch (err) {
    console.error('添加好友失败:', err)
  } finally {
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
.user-info-card-container {
  position: relative;
  display: inline-block;
}

.avatar-trigger {
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-trigger:hover {
  transform: scale(1.05);
}

.user-info-card {
  position: fixed;
  width: 340px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  z-index: 1000;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.card-content {
  padding: 24px;
  position: relative;
}

.card-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #f59e0b);
  border-radius: 20px 20px 0 0;
}

.card-arrow {
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: rotate(45deg);
  z-index: -1;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 140px;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 用户信息样式 */
.user-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.user-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-avatar:hover .avatar-overlay {
  opacity: 1;
}

.user-avatar:hover .avatar-img {
  transform: scale(1.1);
}

.user-basic {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.user-sex,
.user-points {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-weight: 500;
}

.meta-icon {
  font-size: 12px;
}

.user-signature {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 12px;
  border-left: 4px solid #6366f1;
  position: relative;
  overflow: hidden;
}

.user-signature::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.03), rgba(139, 92, 246, 0.03));
  pointer-events: none;
}

.signature-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.signature-icon {
  font-size: 14px;
}

.signature-title {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.signature-text {
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  margin: 0;
  font-style: italic;
  position: relative;
  z-index: 1;
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.user-name {
  margin: 0;
  padding: 0;
  font-size: 1.5rem; /* 用户名大小 */
  display: flex;
  align-items: center; /* 垂直居中子元素 */
  justify-content: space-between; /* 左右分布 */
  width: 100%; /* 确保可以撑开以支持靠右 */
}

.user-status {
  font-size: 0.7em; /* 更小的字体 */
  white-space: nowrap; /* 防止换行 */
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.stat-icon {
  font-size: 14px;
}

.stat-value {
  color: #1e293b;
  font-weight: 600;
  font-size: 13px;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.btn-add-friend,
.btn-message {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.btn-add-friend {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-add-friend::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-add-friend:hover::before {
  left: 100%;
}

.btn-add-friend:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-add-friend:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-message {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-message:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 14px;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 140px;
  gap: 16px;
}

.error-icon {
  font-size: 48px;
  opacity: 0.7;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin: 0;
}

.retry-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* 过渡动画 */
.user-card-enter-active,
.user-card-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.user-card-enter-from {
  opacity: 0;
  transform: translateY(-50%) scale(0.8) rotate(5deg);
}

.user-card-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.8) rotate(-5deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info-card {
    width: 300px;
  }

  .card-content {
    padding: 20px;
  }

  .user-name {
    font-size: 18px;
  }

  .user-actions {
    flex-direction: column;
  }
}
</style>