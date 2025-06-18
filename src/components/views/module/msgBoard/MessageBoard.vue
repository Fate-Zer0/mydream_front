<template>
  <div class="drawer drawer-mobile min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- 顶部导航栏 -->
      <Header />

      <!-- 主体内容 -->
      <main class="container mx-auto p-6 space-y-8 flex-1">
        <!-- 发表新留言卡片 -->
        <div class="card bg-gradient-to-br from-white to-indigo-50/50 shadow-2xl border border-white/20 overflow-hidden">
          <div class="card-body p-8">
            <div class="flex items-center gap-4 mb-6">
              <div class="avatar">
                <div class="w-12 h-12 rounded-2xl ring-4 ring-indigo-100 ring-offset-2 ring-offset-white overflow-hidden">
                  <img :src="currentUser.user_img.file_url" :alt="currentUser.user_name" class="object-cover" />
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">{{ currentUser.user_name }}</h3>
                <p class="text-sm text-gray-500">分享你的想法...</p>
              </div>
            </div>

            <form @submit.prevent="submitMessage" class="space-y-6">
              <div class="relative">
                <textarea
                    v-model="newMessage"
                    placeholder="写下你的留言，让大家听到你的声音..."
                    class="textarea textarea-bordered w-full h-32 text-base border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-2xl resize-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    rows="4"
                    maxlength="500"
                ></textarea>
                <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                  {{ newMessage.length }}/500
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex gap-2">
                  <button type="button" class="btn btn-ghost btn-sm rounded-xl text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                    😊 表情
                  </button>
                  <button type="button" class="btn btn-ghost btn-sm rounded-xl text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                    📷 图片
                  </button>
                </div>
                <button
                    type="submit"
                    class="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 rounded-2xl px-8 hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    :disabled="!newMessage.trim() || isSubmitting"
                >
                  <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
                  {{ isSubmitting ? '发布中...' : '✨ 发布留言' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- 留言列表 -->
        <div class="space-y-6">
          <!-- 空状态 -->
          <div v-if="messages.length === 0" class="text-center py-16">
            <div class="flex flex-col items-center gap-4">
              <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-4xl">
                💭
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">还没有留言哦</h3>
                <p class="text-gray-500">成为第一个留言的人吧！</p>
              </div>
            </div>
          </div>

          <!-- 留言卡片 -->
          <div
              v-for="msg in messages"
              :key="msg.msg_id"
              class="message-card"
          >
            <MessageItem
                :item="msg"
                :current-user="currentUser"
                @reply="handleReply"
                @like="toggleLike"
            />
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="messages.length > 0" class="text-center py-8">
          <button class="btn btn-outline btn-lg rounded-2xl border-2 hover:scale-105 transition-all duration-300">
            📄 加载更多留言
          </button>
        </div>
      </main>
    </div>

    <!-- 侧边菜单 -->
    <SideDrawer :menu-items="menuItems" />
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, nextTick} from 'vue'
import Header from '../../components/homeHead.vue'
import SideDrawer from '../../components/homeSideDrawer.vue'
import MessageItem from './MessageItem.vue'
import type { MsgBoard } from "../../../type/MsgBoard";
import {useUserStore} from "../../../stores/user";
import {withRequest} from "../../../composables/useRequest";
import api from "../../../api/api";

interface MenuItem {
  title: string
  href: string
  icon: string
}

// 菜单数据
const menuItems: MenuItem[] = [
  { title: '首页', href: '/home', icon: '🏠' },
  { title: '留言板', href: '/messageBoard', icon: '💬' },
  { title: '系统设置', href: '/settings', icon: '⚙️' },
  { title: '帮助支持', href: '/help', icon: '❓' }
]

const userStore = useUserStore();

// 当前用户信息
const currentUser = userStore.getUser();

// 响应式数据
const newMessage = ref<string>('')
const isSubmitting = ref<boolean>(false)

// 留言数据
const messages = ref<MsgBoard[]>([
  {
    msg_id: 1,
    msg_content: '欢迎来到留言板！这里是大家交流想法的地方，期待看到更多精彩的留言～',
    user: {
      user_id :  "10001",
      user_name :  "0fate",
      user_pw :  null,
      user_img : null,
    },
    msg_upcount: 5,
    isup: false,
    msg_time: '2024-01-15 10:30',
    hf_msgbds: [
      {
        msg_id: 2,
        msg_content: '留言～留言～',
        user: {
          user_id :  "10001",
          user_name :  "0fate",
          user_pw :  null,
          user_img : null,
        },
        msg_upcount:9,
        isup: false,
        msg_time: '2024-09-20 10:30',
        hf_msgbds: []
      }
    ]
  }
])

async function getMsgBoardInfo(userid?: string) {
  if (!userid) return;
  const res = await withRequest(() => api.msgBoard.getMsgBoardInfo(userid));
  if (res?.retValue) {
    messages.value = res.retValue;
  }
}
// 提交主留言
const submitMessage = async (): Promise<void> => {
  if (!newMessage.value.trim()) return

  isSubmitting.value = true

  const userStore = useUserStore();

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    const newMsg: MsgBoard = {
      msg_id: Date.now(),
      msg_content: newMessage.value,
      user: userStore,
      msg_upcount: 0,
      isup: false,
      msg_time: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      hf_msgbds: []
    }

    messages.value.unshift(newMsg)
    newMessage.value = ''

    showSuccessToast('留言发布成功！')

  } catch (error) {
    console.error('提交留言失败:', error)
    showErrorToast('留言发布失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 处理回复事件
const handleReply = async (parentId: number, replyContent: string, parentAuthor: string): Promise<void> => {
  try {
    const reply: MsgBoard = {
      msg_id: Date.now(),
      msg_content: replyContent.startsWith('@') ? replyContent : `@${parentAuthor} ${replyContent}`,
      user: currentUser,
      msg_upcount: 0,
      isup: false,
      msg_time: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      hf_msgbds: []
    }

    if (addReplyToMessage(messages.value, parentId, reply)) {
      showSuccessToast('回复发布成功！')
    }
  } catch (error) {
    console.error('回复失败:', error)
    showErrorToast('回复发布失败，请重试')
  }
}

// 递归查找并添加回复
const addReplyToMessage = (messages: MsgBoard[], parentId: number, reply: MsgBoard): boolean => {
  for (let msg of messages) {
    if (msg.msg_id === parentId) {
      msg.hf_msgbds.push(reply)
      return true
    }
    if (addReplyToMessage(msg.hf_msgbds, parentId, reply)) {
      return true
    }
  }
  return false
}

// 点赞逻辑
const toggleLike = async (messageId: number): Promise<void> => {
  try {
    const message = findMessageById(messages.value, messageId)
    if (!message) return

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200))

    if (!message.isup) {
      message.msg_upcount += 1
      message.isup = true
      showSuccessToast('点赞成功！')
    } else {
      message.msg_upcount -= 1
      message.isup = false
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    showErrorToast('操作失败，请重试')
  }
}

// 递归查找留言
const findMessageById = (messages: MsgBoard[], id: number): MsgBoard | null => {
  for (let msg of messages) {
    if (msg.msg_id === id) {
      return msg
    }
    const found = findMessageById(msg.hf_msgbds, id)
    if (found) return found
  }
  return null
}

// 提示消息函数
const showSuccessToast = (message: string): void => {
  console.log('Success:', message)
}

const showErrorToast = (message: string): void => {
  console.log('Error:', message)
}

onMounted(async () => {
  await getMsgBoardInfo(userStore.getUserid());
});
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #4f46e5, #7c3aed);
}

/* 输入框焦点效果 */
.textarea:focus {
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* 优化后的留言卡片动画 - 去除抖动，保留放大 */
.message-card {
  animation: fadeInUp 0.5s ease-out;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.message-card:hover {
  transform: scale(1.02);
}

/* 按钮悬浮效果优化 */
.btn:hover:not(.btn-disabled) {
  transform: scale(1.05);
  transition: transform 0.2s ease-out;
}

/* 头像悬浮效果 */
.avatar .w-12:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease-out;
}

/* 加载动画 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 渐入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 去除不必要的变换效果 */
.card:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease-out;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .message-card:hover {
    transform: scale(1.01); /* 移动端减少放大效果 */
  }
}

/* 平滑的色彩过渡 */
.btn-ghost:hover {
  transition: color 0.2s ease-out;
}

/* 优化表单输入框过渡 */
.textarea {
  transition: border-color 0.3s ease-out, box-shadow 0.3s ease-out;
}
</style>