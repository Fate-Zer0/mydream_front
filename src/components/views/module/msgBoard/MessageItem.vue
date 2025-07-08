<template>
  <div class="message-card group">
    <!-- 留言主体卡片 -->
    <div class="card bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden">
      <div class="card-body p-6">
        <!-- 用户信息 -->
        <div class="flex items-start gap-4">
          <!-- 用户头像 - 包装在 UserInfoCard 中 -->
          <div class="avatar flex-shrink-0">
            <UserInfoCard
                :user-id="item.user.user_id"
                @addFriend="handleAddFriend"
                @sendMessage="handleSendMessage"
            >
              <div class="w-12 h-12 rounded-2xl ring-2 ring-gray-200 ring-offset-2 ring-offset-white overflow-hidden transition-all duration-300 hover:ring-indigo-300 hover:scale-110">
                <img
                    :src="item.user?.user_img?.file_url || 'https://picsum.photos/200'"
                    :alt="item.user.user_name"
                    class="object-cover"
                />
              </div>
            </UserInfoCard>
          </div>

          <div class="flex-1 min-w-0">
            <!-- 留言头部信息 -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <!-- 用户名 - 也可以触发用户卡片 -->
                <UserInfoCard
                    :user-id="item.user.user_id"
                    @addFriend="handleAddFriend"
                    @sendMessage="handleSendMessage"
                >
                  <h4 class="font-semibold text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer">
                    {{ item.user.user_name }}
                  </h4>
                </UserInfoCard>

                <div v-if="item.user.user_id === currentUser.user_id" class="badge badge-primary badge-sm">
                  我
                </div>
                <span class="text-sm text-gray-500">{{ item.msg_time }}</span>
              </div>

              <!-- 操作菜单 -->
              <div class="dropdown dropdown-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <label tabindex="0" class="btn btn-ghost btn-sm btn-circle hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                  </svg>
                </label>
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-2xl w-32 border border-gray-100">
                  <li><a class="text-sm hover:bg-gray-50 rounded-xl" @click="copyMessage">📋 复制</a></li>
                  <li v-if="item.user.user_id === currentUser.user_id"><a class="text-sm hover:bg-gray-50 rounded-xl text-red-500" @click="deleteMessage">🗑️ 删除</a></li>
                  <li><a class="text-sm hover:bg-gray-50 rounded-xl" @click="reportMessage">⚠️ 举报</a></li>
                </ul>
              </div>
            </div>

            <!-- 留言内容 -->
            <div class="mb-4">
              <div class="bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 rounded-2xl relative border border-gray-100">
                <!-- 装饰性元素 -->
                <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-400 rounded-l-2xl"></div>

                <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">{{ item.msg_content }}</p>

                <!-- 长文本展开/收起 -->
                <div v-if="item.msg_content.length > 200 && !expanded" class="mt-2">
                  <button @click="expanded = true" class="text-indigo-500 hover:text-indigo-700 text-sm font-medium">
                    展开全文 ▼
                  </button>
                </div>
              </div>
            </div>

            <!-- 互动按钮区域 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <!-- 点赞按钮 -->
                <button
                    @click="handleLike"
                    class="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-red-50 group/like"
                    :class="{ 'text-red-500 bg-red-50': item.isup, 'text-gray-500 hover:text-red-500': !item.isup }"
                >
                  <span class="text-lg transition-transform duration-300 group-hover/like:scale-125" :class="{ 'animate-bounce': justLiked }">
                    {{ item.isup ? '❤️' : '🤍' }}
                  </span>
                  <span class="text-sm font-medium">{{ item.msg_upcount || 0 }}</span>
                </button>

                <!-- 回复按钮 -->
                <button
                    @click="toggleReplyInput"
                    class="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-300"
                >
                  <span class="text-lg">💬</span>
                  <span class="text-sm font-medium">回复</span>
                </button>

                <!-- 分享按钮 -->
                <button class="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all duration-300">
                  <span class="text-lg">📤</span>
                  <span class="text-sm font-medium">分享</span>
                </button>
              </div>

              <!-- 回复数量 -->
              <div v-if="item.hf_msgbds && item.hf_msgbds.length > 0" class="text-sm text-gray-500">
                {{ item.hf_msgbds.length }} 条回复
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 回复输入框 -->
    <Transition name="reply-slide">
      <div v-if="showReplyInput" class="mt-4 ml-16">
        <div class="card bg-white/90 backdrop-blur-sm shadow-md border border-indigo-200">
          <div class="card-body p-4">
            <form @submit.prevent="submitReply" class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="avatar flex-shrink-0">
                  <div class="w-8 h-8 rounded-xl overflow-hidden">
                    <img
                        :src="currentUser.user_img?.file_url || 'https://picsum.photos/200'"
                        :alt="currentUser.user_name"
                        class="object-cover"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <textarea
                      v-model="replyText"
                      :placeholder="`回复 ${item.user.user_name}...`"
                      class="textarea textarea-bordered w-full h-20 text-sm border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl resize-none transition-all duration-300"
                      @keydown.enter.ctrl="submitReply"
                      ref="replyTextarea"
                  ></textarea>
                  <div class="text-xs text-gray-400 mt-1">
                    Ctrl + Enter 快速发送
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-2">
                <button
                    @click="cancelReply"
                    type="button"
                    class="btn btn-ghost btn-sm rounded-xl hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                    type="submit"
                    class="btn btn-primary btn-sm rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:scale-105 disabled:opacity-50"
                    :disabled="!replyText.trim() || isSubmittingReply"
                >
                  <span v-if="isSubmittingReply" class="loading loading-spinner loading-xs"></span>
                  {{ isSubmittingReply ? '发送中...' : '💌 发送' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 回复列表 -->
    <div v-if="item.hf_msgbds && item.hf_msgbds.length > 0" class="mt-6 ml-8 space-y-4">
      <div class="relative">
        <!-- 连接线 -->
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 to-purple-200"></div>

        <div v-for="reply in item.hf_msgbds" :key="reply.msg_id" class="relative">
          <!-- 连接点 -->
          <div class="absolute left-4 top-6 w-4 h-4 bg-white border-2 border-indigo-300 rounded-full z-10"></div>

          <MessageItem
              :par_id="props.par_id"
              :item="reply"
              :current-user="currentUser"
              :is-reply="true"
              @reply="(id, content, author) => $emit('reply', id, content, author)"
              @like="(id) => $emit('like', id)"
              @addFriend="(userId) => $emit('addFriend', userId)"
              @sendMessage="(userId) => $emit('sendMessage', userId)"
              class="pl-12"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import UserInfoCard from '../../components/userInfoCard.vue'

const props = defineProps({
  par_id: {
    type: Number,
    default: 0
  },
  item: {
    type: Object,
    required: true
  },
  currentUser: {
    type: Object,
    required: true
  },
  isReply: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['reply', 'like', 'addFriend', 'sendMessage'])

const showReplyInput = ref(false)
const replyText = ref('')
const isSubmittingReply = ref(false)
const expanded = ref(false)
const justLiked = ref(false)
const replyTextarea = ref(null)

// 处理用户卡片的添加好友事件
function handleAddFriend(userId) {
  emit('addFriend', userId)
}

// 处理用户卡片的发送消息事件
function handleSendMessage(userId) {
  emit('sendMessage', userId)
}

// 切换回复输入框
async function toggleReplyInput() {
  showReplyInput.value = !showReplyInput.value
  if (showReplyInput.value) {
    await nextTick()
    replyTextarea.value?.focus()
  }
}

// 提交回复
async function submitReply() {
  if (!replyText.value.trim()) return

  isSubmittingReply.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟API延迟
    emit('reply', props.par_id, replyText.value, props.item.user.user_name)
    replyText.value = ''
    showReplyInput.value = false
  } catch (error) {
    console.error('回复失败:', error)
  } finally {
    isSubmittingReply.value = false
  }
}

// 取消回复
function cancelReply() {
  showReplyInput.value = false
  replyText.value = ''
}

// 处理点赞
async function handleLike() {
  justLiked.value = true
  emit('like', props.item.msg_id)

  // 动画效果
  setTimeout(() => {
    justLiked.value = false
  }, 600)
}

// 复制留言内容
function copyMessage() {
  navigator.clipboard.writeText(props.item.msg_content)
  console.log('复制成功')
}

// 删除留言
function deleteMessage() {
  if (confirm('确定要删除这条留言吗？')) {
    console.log('删除留言:', props.item.msg_id)
  }
}

// 举报留言
function reportMessage() {
  console.log('举报留言:', props.item.msg_id)
}

onMounted(() => {
  // 如果是长文本，默认收起
  if (props.item.msg_content.length > 200) {
    expanded.value = false
  } else {
    expanded.value = true
  }
})
</script>