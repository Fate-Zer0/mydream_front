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
                :par_id="msg.msg_id"
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
import type { MsgBoard } from "../../../ts/type/MsgBoard";
import {useUserStore} from "../../../ts/stores/user";
import {withRequest} from "../../../ts/composables/useRequest";
import api from "../../../ts/api/api";

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
  const res = await withRequest(() => api.module.msgBoard.getMsgBoardInfo(userid));
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
    const newMsg: MsgBoard = {
      msg_id: 0,
      msg_content: newMessage.value,
      user: userStore.getUser(),
      msg_upcount: 0,
      isup: false,
      msg_time: "",
      hf_msgbds: []
    }

    await addReplyToMessage(newMsg)
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
      msg_id: parentId,
      msg_content: replyContent.startsWith('@') ? replyContent : `@${parentAuthor} ${replyContent}`,
      user: currentUser,
      msg_upcount: 0,
      isup: false,
      msg_time: "",
      hf_msgbds: []
    }

    await addReplyToMessage(reply)

  } catch (error) {
    console.error('回复失败:', error)
    showErrorToast('回复发布失败，请重试')
  }
}

// 递归查找并添加回复
const addReplyToMessage = async (reply: MsgBoard): Promise<void> => {

  const res = await withRequest(() => api.module.msgBoard.addMsgBoard(reply));
  if (res.retCode=="0000") {
    newMessage.value = ""
    showSuccessToast('留言发布成功！');
    await getMsgBoardInfo(userStore.getUserid())
  }
}

// 点赞逻辑
const toggleLike = async (messageId: number): Promise<void> => {
  try {
    const message = findMessageById(messages.value, messageId)
    if (!message) return

    const user_id = userStore.getUserid();
    const passive_id = message.user.user_id;
    const rec_type = "61001";
    const obj_id = message.msg_id;

    const res = await withRequest(() => api.module.record.addRecord(user_id,passive_id,rec_type,obj_id));
    if (res.retCode=="0000") {
      if (!message.isup) {
        message.msg_upcount += 1
        message.isup = true
        showSuccessToast('点赞成功！')
      } else {
        message.msg_upcount -= 1
        message.isup = false
      }
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    showErrorToast('操作失败，请重试')
  }
}

// 递归查找留言
function findMessageById(messages: MsgBoard[], id: number): MsgBoard | null {
  for (const msg of messages) {
    if (msg.msg_id === id) return msg;

    const replies = msg.hf_msgbds ?? [];
    const result = findMessageById(replies, id);
    if (result) return result;
  }

  return null;
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
@import "../../../css/module/msgBoard/MessageBoard.css";
</style>