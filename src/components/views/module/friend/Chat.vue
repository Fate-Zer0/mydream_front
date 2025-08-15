<template>
  <div class="drawer drawer-mobile min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100">
    <!-- 抽屉开关 -->
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- 顶部导航栏 -->
      <Header />

      <!-- 主体内容 -->
      <div class="container mx-auto mt-8 px-2 sm:px-4 pb-8 h-[calc(100vh-120px)] max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 h-full">

          <!-- 左侧好友列表 -->
          <aside class="col-span-12 lg:col-span-4 xl:col-span-3 2xl:col-span-3">
            <div class="card h-full border-0 bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-500/10">
              <div class="card-body p-0 flex flex-col h-full">

                <!-- 好友列表标题（固定不滚动） -->
                <div class="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                      <span class="text-2xl">💬</span>
                      好友列表
                    </h2>
                    <button
                        @click="handleApply"
                        class="relative cursor-pointer inline-flex items-center px-4 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 border-0 rounded shadow-lg"
                    >
                      添加
                    </button>
                  </div>

                  <!-- 搜索框 -->
                  <div class="mt-4 relative">
                    <input
                        type="text"
                        placeholder="搜索好友..."
                        class="input input-bordered w-full rounded-2xl bg-white/70 border-indigo-200 pl-12 pr-4 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                        v-model="searchTerm"
                    />
                    <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- ✅ 修复：新增滚动容器 -->
                <div class="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] 2xl:max-h-[calc(100vh-200px)] px-3" style="scrollbar-width: thin; scrollbar-color: rgba(99, 102, 241, 0.3) transparent;">
                  <!-- 可选：添加内边距 -->
                  <div class="space-y-2 py-1">
                    <div
                        v-for="friend in filteredFriends"
                        :key="friend.chat_user.user.user_id"
                        class="friend-item p-2 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg hover:scale-[1.02] relative"
                        :class="{ 'bg-gradient-to-r from-indigo-100 to-purple-100 shadow-lg ring-2 ring-indigo-200': selectedFriend?.chat_user.user.user_id === friend.chat_user.user.user_id }"
                        @click="selectFriend(friend)"
                    >
                      <div class="flex items-center gap-2">

                        <!-- 头像 -->
                        <div class="avatar relative">
                          <div class="w-10 h-10 rounded-full ring-2 ring-white shadow-lg transition-all duration-300">
                            <img :src="friend.chat_user.user.user_img?.file_url || 'https://picsum.photos/200'" :alt="friend.chat_user.user.user_name" class="rounded-full object-cover" />
                          </div>
                          <div
                              class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white shadow-lg"
                              :class="friend.chat_user.user_status_code != '20001' ? 'bg-emerald-500' : 'bg-gray-400'"
                          >
                            <div v-if="friend.chat_user.user_status_code != '20001'" class="w-full h-full rounded-full bg-emerald-500 animate-pulse"></div>
                          </div>
                        </div>

                        <!-- 文本信息区 -->
                        <div class="flex-1 min-w-0 pr-6">
                          <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-gray-800 truncate max-w-[70%]">
                              {{ friend.chat_user.user.user_name }}
                            </h3>
                            <span class="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    {{ formatTime(friend.lastMessage?.createtime || friend.chat_user.last_sign_in_date) }}
                  </span>
                          </div>
                          <p class="text-sm text-gray-600 truncate mt-1">
                            {{ friend.lastMessage?.msg_content || '' }}
                          </p>
                        </div>

                        <!-- 未读数 -->
                        <div v-if="friend.unread_count > 0" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div class="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse min-w-5 h-5 flex items-center justify-center">
                            {{ friend.unread_count > 99 ? '99+' : friend.unread_count }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 可选：空状态 -->
                    <div v-if="filteredFriends.length === 0" class="text-center text-gray-500 py-8">
                      暂无好友
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </aside>

          <!-- 右侧聊天区域 -->
          <main class="col-span-12 lg:col-span-8 xl:col-span-8 2xl:col-span-9">
            <div class="card h-full border-0 bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-500/10">

              <!-- 未选择好友时的提示 -->
              <div v-if="!selectedFriend" class="card-body flex items-center justify-center h-full">
                <div class="text-center">
                  <div class="text-8xl mb-6 animate-bounce">💬</div>
                  <h3 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    开始聊天
                  </h3>
                  <p class="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                    从左侧好友列表中选择一位好友，开始你们的精彩对话吧！
                  </p>
                  <div class="mt-8">
                    <div class="flex justify-center space-x-4">
                      <div class="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                      <div class="w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
                      <div class="w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 聊天界面 -->
              <div v-else class="flex flex-col h-full">

                <!-- 聊天头部 -->
                <div class="p-6 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="avatar">
                        <div class="w-14 h-14 rounded-full ring-2 ring-indigo-200 shadow-lg">
                          <img :src="selectedFriend.chat_user.user.user_img?.file_url || 'https://picsum.photos/200'" :alt="selectedFriend.chat_user.user.user_name" class="rounded-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-800 text-lg">{{ selectedFriend.chat_user.user.user_name }}</h3>
                        <p class="text-sm flex items-center gap-2">
                          <span class="w-2 h-2 rounded-full" :class="selectedFriend.chat_user.user_status_code != '20001' ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                          <span :class="selectedFriend.chat_user.user_status_code != '20001' ? 'text-emerald-600' : 'text-gray-500'">
                            {{ selectedFriend.chat_user.user_status_code != '20001' ? '在线' : '离线' }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 聊天消息区域 -->
                <div class="flex-1 relative bg-gradient-to-br from-indigo-50/20 to-purple-50/20">
                  <div class="absolute inset-0 overflow-y-auto custom-scrollbar p-6" ref="messagesContainer">
                    <div class="space-y-6">
                      <div
                          v-for="message in messages"
                          :key="message.msg_id"
                          class="flex message-item"
                          :class="message.send_id === currentUser.user_id ? 'justify-end' : 'justify-start'"
                      >
                        <!-- 其他人的消息 -->
                        <div v-if="message.send_id !== currentUser.user_id" class="flex items-end gap-3 max-w-[85%] sm:max-w-xs lg:max-w-md">
                          <div class="avatar">
                            <div class="w-10 h-10 rounded-full ring-2 ring-white shadow-md">
                              <img :src="selectedFriend.chat_user.user.user_img?.file_url || 'https://picsum.photos/200'" :alt="selectedFriend.chat_user.user.user_name" class="rounded-full object-cover" />
                            </div>
                          </div>
                          <div class="flex flex-col">
                            <div class="bg-white border border-indigo-100 rounded-2xl rounded-bl-md p-3 shadow-lg relative">
                              <div class="absolute -left-2 bottom-3 w-0 h-0 border-l-0 border-r-8 border-t-8 border-b-0 border-r-white border-t-transparent"></div>
                              <p class="text-gray-800 leading-relaxed break-words whitespace-pre-wrap text-sm" style="word-break: break-word; overflow-wrap: break-word;">{{ message.msg_content }}</p>
                            </div>
                            <span class="text-xs text-gray-500 mt-1 ml-3">{{ formatTime(message.createtime) }}</span>
                          </div>
                        </div>

                        <!-- 我的消息 -->
                        <div v-else class="flex items-end gap-3 max-w-[85%] sm:max-w-xs lg:max-w-md">
                          <div class="flex flex-col">
                            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl rounded-br-md p-3 shadow-lg relative">
                              <div class="absolute -right-2 bottom-3 w-0 h-0 border-r-0 border-l-8 border-t-8 border-b-0 border-l-indigo-500 border-t-transparent"></div>
                              <p class="leading-relaxed break-words whitespace-pre-wrap text-sm" style="word-break: break-word; overflow-wrap: break-word;">{{ message.msg_content }}</p>
                            </div>
                            <span class="text-xs text-gray-500 mt-1 mr-3 text-right">{{ formatTime(message.createtime) }}</span>
                          </div>
                          <div class="avatar">
                            <div class="w-10 h-10 rounded-full ring-2 ring-white shadow-md">
                              <img :src="currentUser.user_img.file_url" :alt="currentUser.user_name" class="rounded-full object-cover" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 输入区域 -->
                <div class="p-6 border-t border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                  <div class="flex items-end gap-4">
                    <div class="flex gap-2">
                      <button class="btn btn-ghost btn-sm rounded-full hover:bg-indigo-100 hover:scale-110 transition-all duration-300">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                          <circle cx="8.5" cy="9.5" r="1.5"/>
                          <circle cx="15.5" cy="9.5" r="1.5"/>
                          <path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                        </svg>
                      </button>
                      <button class="btn btn-ghost btn-sm rounded-full hover:bg-indigo-100 hover:scale-110 transition-all duration-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                      </button>
                      <button class="btn btn-ghost btn-sm rounded-full hover:bg-indigo-100 hover:scale-110 transition-all duration-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>

                    <div class="flex-1">
                      <textarea
                          v-model="newMessage"
                          placeholder="输入消息..."
                          class="textarea textarea-bordered w-full rounded-2xl bg-white/70 border-indigo-200 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none"
                          rows="2"
                          @keydown.enter.prevent="sendMessage"
                      ></textarea>
                    </div>

                    <button
                        @click="sendMessage"
                        :disabled="!newMessage.trim() || isSending"
                        class="btn rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                        :class="!newMessage.trim() || isSending ? 'btn-disabled opacity-50' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700'"
                    >
                      <span v-if="isSending" class="loading loading-spinner loading-sm"></span>
                      <span v-else class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        发送
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- 添加好友弹窗 -->
    <div v-if="showAddFriendModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <!-- 弹窗头部 -->
        <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              添加好友
            </h3>
            <button @click="closeAddFriendModal" class="btn btn-ghost btn-sm rounded-full hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 弹窗内容 -->
        <div class="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <!-- 搜索用户 -->
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              搜索用户
            </h4>
            <div class="relative">
              <input
                  type="text"
                  v-model="userSearchTerm"
                  placeholder="输入用户名搜索..."
                  class="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 pl-4 pr-12 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  @input="searchUsers"
              />
              <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- 搜索结果 -->
            <div v-if="searchResults.length > 0" class="space-y-2">
              <div class="max-h-60 overflow-y-auto custom-scrollbar">
                <div
                    v-for="user in searchResults"
                    :key="user.user_id"
                    class="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                >
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="w-10 h-10 rounded-full ring-2 ring-white shadow-md">
                        <img :src="user.user_img?.file_url || 'https://picsum.photos/200'" :alt="user.user_name" class="rounded-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <h5 class="font-semibold text-gray-800">{{ user.user_name }}</h5>
<!--                      <p class="text-sm text-gray-600">{{ user.email }}</p>-->
                    </div>
                  </div>
                  <button
                      @click="sendFriendRequest(user)"
                      :disabled="isRequestSent(user.user_id)"
                      class="btn btn-sm rounded-lg"
                      :class="isRequestSent(user.user_id) ? 'btn-disabled' : 'btn-primary bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600'"
                  >
                    {{ isRequestSent(user.user_id) ? '已发送' : '添加' }}
                  </button>
                </div>
              </div>
            </div>

            <div v-else-if="userSearchTerm && !isSearching" class="text-center py-8 text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <p>未找到相关用户</p>
            </div>
          </div>

          <!-- 待处理的好友申请 -->
          <div v-if="pendingApplications.length > 0" class="space-y-4">
            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              待处理申请
              <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{{ pendingApplications.length }}</span>
            </h4>
            <div class="space-y-3">
              <div
                  v-for="application in pendingApplications"
                  :key="application.fri_id"
                  class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
              >
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-full ring-2 ring-white shadow-md">
                      <img :src="application.user.user_img?.file_url || 'https://picsum.photos/200'" :alt="application.user.user_name" class="rounded-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <h5 class="font-semibold text-gray-800">{{ application.user.user_name }}</h5>
                    <p class="text-xs text-gray-500">{{ formatDateSignin(application.createtime) }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                      @click="acceptFriendRequest(application)"
                      class="btn btn-sm rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600"
                  >
                    同意
                  </button>
                  <button
                      @click="rejectFriendRequest(application)"
                      class="btn btn-sm rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:from-red-600 hover:to-pink-600"
                  >
                    拒绝
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 我发起的好友申请 -->
          <div v-if="sentApplications.length > 0" class="space-y-4">
            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              我的申请
            </h4>
            <div class="space-y-3">
              <div
                  v-for="application in sentApplications"
                  :key="application.fri_id"
                  class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200"
              >
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-full ring-2 ring-white shadow-md">
                      <img :src="application.friend.user_img?.file_url || 'https://picsum.photos/200'" :alt="application.friend.user_name" class="rounded-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <h5 class="font-semibold text-gray-800">{{ application.friend.user_name }}</h5>
                    <p class="text-sm text-gray-600">等待对方确认</p>
                    <p class="text-xs text-gray-500">{{ formatDateSignin(application.createtime) }}</p>
                  </div>
                </div>
                <button
                    @click="cancelFriendRequest(application)"
                    class="btn btn-sm rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 hover:from-gray-600 hover:to-gray-700"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 侧边抽屉菜单 -->
    <SideDrawer :menu-items="menuItems" />
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, nextTick, watch} from 'vue';
import Header from '../../components/homeHead.vue';
import SideDrawer from '../../components/homeSideDrawer.vue';
import {withRequest} from "../../../ts/composables/useRequest";
import api from "../../../ts/api/api";
import {useUserStore} from "../../../ts/stores/user";
import type {FriendInfo} from "../../../ts/type/FriendInfo";
import type {ChatInfo} from "../../../ts/type/ChatInfo";
import {useAlertStore} from "../../../ts/stores/alert";
import {User} from "../../../ts/type/User";
import type {Message} from "../../../ts/type/Message";
import WebSocketServiceWrapper from "../../../ts/websocket/websocket";

const userStore = useUserStore();
const alertStore = useAlertStore();

// 当前用户信息
const currentUser = userStore.getUser();

const wsService = WebSocketServiceWrapper.getInstance();

const menuItems = [
  { title: '首页', href: '/home', icon: '🏠' },
  { title: '留言板', href: '/messageBoard', icon: '💬' },
  { title: '系统设置', href: '/settings', icon: '⚙️' },
  { title: '帮助支持', href: '/help', icon: '❓' }
]


const formatDateSignin = (dateString: string): string => {
  if (!dateString) return '未知'

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime()) // 获取时间差，单位是毫秒

  // 如果是今天，计算出小时和分钟前
  if (isToday(date)) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60)); // 小时差
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60)); // 分钟差

    if (diffHours < 1) {
      return '刚刚';
    } else {
      return `${diffHours}小时前`;
    }
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

  if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else if (diffDays < 30) {
    return `${Math.ceil(diffDays / 7)}周前`;
  } else if (diffDays < 365) {
    return `${Math.ceil(diffDays / 30)}月前`;
  } else {
    return `${Math.ceil(diffDays / 365)}年前`;
  }
};

// 优化时间格式化方法 - 使显示更紧凑
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  // 如果是完整的日期时间格式 (2025-07-31 15:09:00)
  if (timeString.includes(' ') && timeString.length > 16) {
    // 提取日期和时间部分
    const [datePart, timePart] = timeString.split(' ');
    
    // 获取今天的日期
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // 格式: YYYY-MM-DD
    
    // 如果是今天的消息，只显示时间
    if (datePart === todayStr) {
      return timePart.substring(0, 5); // 只返回小时和分钟 (15:09)
    }
    
    // 如果是昨天的消息
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (datePart === yesterdayStr) {
      return `昨天`; // 只显示"昨天"更紧凑
    }
    
    // 如果是今年的消息，显示月/日
    const currentYear = today.getFullYear().toString();
    if (datePart.startsWith(currentYear)) {
      return `${datePart.substring(5, 10).replace('-', '/')}`; // 格式: MM/DD
    }
    
    // 其他情况显示年/月/日
    return `${datePart.substring(2, 10).replace(/-/g, '/')}`; // 格式: YY/MM/DD
  }
  
  return timeString; // 如果不是预期的格式，返回原始字符串
};

// 辅助函数：判断是否为今天
function isToday(someDate: Date): boolean {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear();
}

// 搜索关键词
const searchTerm = ref('');

const ChatInfos = ref<ChatInfo[]>([
  {
    chat_user:{
      user : {
        user_id :  "10001",
        user_name :  "0fate",
        user_pw :  null,
        user_img : null,
      },
      user_create_date : "2023-05-01 10:00:00",
      last_sign_in_date : "2023-05-01 10:00:00",
      user_points : "100",
      user_sex_code : "1",
      user_sex_name : "男",
      user_grjj : "这个人很懒，什么都没写",
      user_status_code : "20001",
      user_status_name : "在线"
    },
    lastMessage:{
      msg_id: '',
      msg_content: '',
      createtime:'',
      send_id: '',
      receive_id: '',
      msg_type: '',
      msg_state: '',
      file_info: null,
      send_type: ''
    },
    unread_count: 0 ,
    chat_count:2
  }
])

// 添加好友相关的响应式数据
const showAddFriendModal = ref(false);
const userSearchTerm = ref('');
const searchResults = ref<User[]>([]);
const isSearching = ref(false);
const sentRequestIds = ref(new Set());

// 待处理的好友申请
const pendingApplications = ref<FriendInfo[]>([
  {
    fri_id: "1",
    user: {
      user_id: '2',
      user_name: '王小二',
      user_pw: '',
      user_img: {
        file_name: '王小二.jpg',
        file_path: '',
        file_url: 'https://picsum.photos/100/100?random=2'
      }
    },
    friend: null,
    createtime: '2025-07-17 08:52:41',
    state: '0'
  }
]);

// 我发起的好友申请
const sentApplications = ref<FriendInfo[]>([
  {
    fri_id: "1",
    user: null,
    friend: {
      user_id: '2',
      user_name: '王小二',
      user_pw: '',
      user_img: {
        file_name: '王小二.jpg',
        file_path: '',
        file_url: 'https://picsum.photos/100/100?random=2'
      }
    },
    createtime: '2025-07-17 08:52:41',
    state: '0'
  }
]);

// 打开添加好友弹窗
const handleApply = () => {
  showAddFriendModal.value = true;
};

// 关闭添加好友弹窗
const closeAddFriendModal = () => {
  showAddFriendModal.value = false;
  userSearchTerm.value = '';
  searchResults.value = [];
  sentRequestIds.value.clear();
};

// 搜索用户
const searchUsers = async () => {
  if (!userSearchTerm.value.trim()) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  try {
    const res = await withRequest(() => api.module.friend.searchUser(userSearchTerm.value));

    searchResults.value = res?.retValue;

  } catch (error) {
    console.error('搜索用户失败:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// 防抖搜索
let searchTimeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(searchUsers, 300);
};

// 发送好友申请
const sendFriendRequest = async (user) => {
  await addFriend(user.user_id);
};

// 添加好友
async function addFriend(friend_id) {
  const user_id = userStore.getUserid();
  if(user_id == friend_id){
    alertStore.showAlertWithAutoHide("alert-warning", "请勿添加自己为好友");
    return
  }

  try {
    const res = await withRequest(() => api.module.friend.addFriend(user_id,friend_id));
    if(res?.retCode=="0000"){
      alertStore.showAlertWithAutoHide("alert-success", `已发送添加请求`);
    }else{
      alertStore.showAlertWithAutoHide("alert-warning", res.retDesc);
    }
  } catch (err) {
    console.error('添加好友失败:', err)
  } finally {
    await flushAddFriendInfo();
  }
}

// 检查是否已发送申请
const isRequestSent = (userId) => {
  // if(friends.value.filter(friend =>
  //     friend.id.includes(userId.value)
  // ).length>0){
  //   return true;
  // }else{
  //   return false;
  // }

  return sentRequestIds.value.has(userId);
};

// 同意好友申请
const acceptFriendRequest = async (application) => {
  try {
    await updateFriendState(application.fri_id, '1');
  } catch (error) {
    console.error('取消好友申请失败:', error);
    alertStore.showAlertWithAutoHide("alert-warning", "操作失败，请稍后重试");
  }
};

// 拒绝好友申请
const rejectFriendRequest = async (application) => {
  try {
    await updateFriendState(application.fri_id, '-1');
  } catch (error) {
    console.error('取消好友申请失败:', error);
    alertStore.showAlertWithAutoHide("alert-warning", "操作失败，请稍后重试");
  }
};

// 取消好友申请
const cancelFriendRequest = async (application) => {
  try {
    await updateFriendState(application.fri_id, '-2');
  } catch (error) {
    console.error('取消好友申请失败:', error);
    alertStore.showAlertWithAutoHide("alert-warning", "操作失败，请稍后重试");
  }
};

// 显示成功消息
const showSuccessMessage = (message) => {
  // 这里可以使用 toast 库或者自定义提示组件
  console.log('成功:', message);
  // 例如：toast.success(message);
};

// 显示错误消息
const showErrorMessage = (message) => {
  // 这里可以使用 toast 库或者自定义提示组件
  console.log('错误:', message);
  // 例如：toast.error(message);
};

// 监听搜索输入变化
watch(userSearchTerm, () => {
  debouncedSearch();
});

// 当前选中的好友
const selectedFriend = ref<ChatInfo>(null);

// 聊天消息
const messages = ref<Message[]>([]);

// 新消息
const newMessage = ref('');

// 发送状态
const isSending = ref(false);

// 消息容器引用
const messagesContainer = ref(null);

// 过滤后的好友列表
const filteredFriends = computed(() => {
  if (!searchTerm.value) {
    return ChatInfos.value;
  }
  return ChatInfos.value.filter(ChatInfos =>
      ChatInfos.chat_user.user.user_name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// 选择好友
const selectFriend = async (friend) => {
  selectedFriend.value = friend;
  // 清除未读消息
  friend.unread_count = 0;

  await loadChatHistory(friend.chat_user.user.user_id);
};

// 加载聊天历史（模拟接口）
const loadChatHistory = async (friendId) => {

  const res = await withRequest(() => api.module.chat.getChatMessageListByUseridAndFriendid(currentUser.user_id,friendId));
  if(res?.retValue){
    messages.value = res.retValue;

    // 滚动到底部
    await nextTick();
    scrollToBottom();
  }else{
    alertStore.showAlertWithAutoHide("alert-warning", res.retDesc);
  }
};

const getLastMessage = async (userid,friendId) => {
  const res = await withRequest(() => api.module.chat.getLastMessage(userid,friendId));
  if(res?.retValue){
    messages.value.push(res.retValue);

    // 滚动到底部
    await nextTick();
    scrollToBottom();
  }else{
    alertStore.showAlertWithAutoHide("alert-warning", res.retDesc);
  }
}

// 发送消息
const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  isSending.value = true;

  // 添加我的消息
  const myMessage = {
    msg_id: '',
    msg_content: newMessage.value,
    createtime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    send_id: currentUser.user_id,
    receive_id: selectedFriend.value.chat_user.user.user_id,
    msg_type: '1',
    msg_state: '0',
    file_info: null,
    send_type: '1'
  };

  messages.value.push(myMessage);
  const messageContent = newMessage.value;
  newMessage.value = '';

  // 滚动到底部
  await nextTick();
  scrollToBottom();

  const res = await withRequest(() => api.module.chat.addChatMassage(myMessage));
  if(res?.retCode == '0000'){
    wsService.sendMessage('/app/chat', {
      type: 'Chat',
      to: selectedFriend.value.chat_user.user.user_id
    });
  }else{
    alertStore.showAlertWithAutoHide("alert-warning", res.retDesc);
  }

  isSending.value = false;
};

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 强制滚动到底部（确保能到达最底部）
const forceScrollToBottom = () => {
  if (messagesContainer.value) {
    // 使用 scrollTo 方法确保滚动到底部
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

async function getAddFriendInfo(user_id,friend_id,state){
  const res = await withRequest(() => api.module.friend.getAddFriendInfo(user_id,friend_id,state));
  return res.retValue;
}

async function getAddFriendInfoIsMyAdd(){
  const user_id = userStore.getUserid();
  sentApplications.value = await getAddFriendInfo(user_id,"","0");
}

async function getAddFriendInfoIsAddMy(){
  const user_id = userStore.getUserid();
  pendingApplications.value = await getAddFriendInfo("",user_id,"0");
}

async function updateFriendState(fri_id,state){
  const res = await withRequest(() => api.module.friend.updateFriendState(fri_id,state));
  if(res.retValue){
    alertStore.showAlertWithAutoHide("alert-success", `处理成功!`);
  }else{
    alertStore.showAlertWithAutoHide("alert-warning", res.retDesc);
  }
  await flushAddFriendInfo();
}

async function getChatInfoList(user_id){
  const res = await withRequest(() => api.module.chat.getChatInfoList(user_id));
  if(res?.retValue){
    ChatInfos.value = res.retValue;
  }else{
    alertStore.showAlertWithAutoHide("alert-warning", res.retDesc);
  }
}

async function flushAddFriendInfo(){
  await getAddFriendInfoIsMyAdd();
  await getAddFriendInfoIsAddMy();
}

onMounted(async () => {
  wsService.onMessage(async(data) => {
    if(data.type == "Chat"){
      if(data.to == currentUser.user_id){
        await getLastMessage(currentUser.user_id,selectedFriend.value.chat_user.user.user_id);
      }else{
        await getChatInfoList(currentUser.user_id);
      }
    }
  });

  await getChatInfoList(currentUser.user_id);

  if (ChatInfos.value.length > 0) {
    await selectFriend(ChatInfos.value[0]);
  }

  sentRequestIds.value = new Set(
      sentApplications.value.map(app => app.fri_id)
  );

  try {
    await flushAddFriendInfo();
  } catch (error) {
    console.error('刷新添加好友信息失败:', error);
  }
});
</script>
<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(199, 210, 254, 0.2);
  border-radius: 10px;
  margin: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #a855f7, #6366f1);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #9333ea, #4f46e5);
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
}

/* 好友列表滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(199, 210, 254, 0.2);
  border-radius: 10px;
  margin: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #c7d2fe, #a5b4fc);
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #a5b4fc, #818cf8);
}

/* 好友列表项悬停效果 */
.friend-item:hover {
  transform: translateY(-2px);
}

/* 消息动画 */
.message-item {
  animation: fadeInUp 0.4s ease-out;
}

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

/* 动画延迟 */
.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

/* 输入框聚焦效果 */
.textarea:focus, .input:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  border-color: #6366f1;
}

/* 按钮悬停效果 */
.btn:hover {
  transform: translateY(-1px);
}

/* 头像边框动画 */
.avatar img {
  transition: all 0.3s ease;
}

.avatar:hover img {
  transform: scale(1.05);
}

/* 在线状态脉动效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* 响应式布局优化 */



/* 好友列表项悬停效果 */
.friend-item:hover {
  transform: translateX(2px);
}

/* 消息动画 */
.space-y-4 > * {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式布局优化 */
@media (max-width: 1024px) {
  .container {
    height: calc(100vh - 80px);
  }
}

/* 响应式调整 */
@media (min-width: 1280px) and (max-width: 1600px) {
  .friend-item {
    padding: 0.5rem;
  }
  
  .avatar .w-12 {
    width: 2.5rem;
  }
  
  .avatar .h-12 {
    height: 2.5rem;
  }
}

/* 确保消息不会导致水平滚动 */
.message-item {
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

/* 输入框聚焦效果 */
.textarea:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
</style>