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

          <!-- 左侧文件上传区域 -->
          <aside class="col-span-12 lg:col-span-5 xl:col-span-4">
            <div class="card h-full border-0 bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-500/10">
              <div class="card-body p-0 flex flex-col flex-1 overflow-y-auto max-h-[calc(100vh-100px)] px-3" style="scrollbar-width: thin;">

                <!-- 上传区域标题 -->
                <div class="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                  <h2 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                    <span class="text-2xl">📁</span>
                    文件上传
                  </h2>
                </div>

                <!-- 文件拖拽上传区域 -->
                <div class="p-6 flex-1">
                  <div
                      class="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/30"
                      :class="isDragOver ? 'border-indigo-500 bg-indigo-50/50' : ''"
                      @drop="handleDrop"
                      @dragover.prevent="isDragOver = true"
                      @dragleave.prevent="isDragOver = false"
                      @dragenter.prevent
                  >
                    <div class="space-y-4">
                      <div class="text-6xl animate-bounce">📤</div>
                      <div>
                        <p class="text-lg font-semibold text-gray-700 mb-2">
                          拖拽文件到这里 或
                          <button @click="triggerFileInput" class="text-indigo-600 hover:text-indigo-700 underline">
                            点击选择文件
                          </button>
                        </p>
                        <p class="text-sm text-gray-500">
                          支持 PDF, DOC, XLS, PPT, TXT, 图片等格式
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 隐藏的文件输入 -->
                  <input
                      ref="fileInput"
                      type="file"
                      multiple
                      class="hidden"
                      @change="handleFileSelect"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  />

                  <!-- 文件上传表单 -->
                  <div v-if="selectedFiles.length > 0" class="mt-6 space-y-4">
                    <h3 class="font-semibold text-gray-800 flex items-center gap-2">
                      <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      待上传文件 ({{ selectedFiles.length }})
                    </h3>

                    <!-- 文件列表 -->
                    <div class="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                      <div
                          v-for="(file, index) in selectedFiles"
                          :key="index"
                          class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div class="flex items-center gap-2 flex-1 min-w-0">
                          <div class="text-2xl">{{ getFileIcon(file.type) }}</div>
                          <div class="min-w-0 flex-1">
                            <p class="font-medium text-gray-800 truncate">{{ file.name }}</p>
                            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                          </div>
                        </div>
                        <button
                            @click="removeFile(index)"
                            class="btn btn-ghost btn-xs rounded-full hover:bg-red-100 hover:text-red-600"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <!-- 文件描述 -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">文件描述</label>
                      <textarea
                          v-model="fileDescription"
                          placeholder="请输入文件描述信息..."
                          class="textarea textarea-bordered w-full rounded-xl bg-white/70 border-indigo-200 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 resize-none"
                          rows="3"
                      ></textarea>
                    </div>

                    <!-- 标签输入 -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">文件标签</label>
                      <div class="flex gap-2">
                        <input
                            v-model="tagInput"
                            @keydown.enter.prevent="addTag"
                            placeholder="输入标签后按回车"
                            class="input input-bordered flex-1 rounded-xl bg-white/70 border-indigo-200 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                        />
                        <button
                            @click="addTag"
                            :disabled="!tagInput.trim()"
                            class="btn btn-primary bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 rounded-xl"
                        >
                          添加
                        </button>
                      </div>

                      <!-- 标签显示 -->
                      <div v-if="fileTags.length > 0" class="flex flex-wrap gap-2 mt-2">
                        <div
                            v-for="(tag, index) in fileTags"
                            :key="index"
                            class="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {{ tag }}
                          <button @click="removeTag(index)" class="hover:text-red-500">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- 上传按钮 -->
                    <div class="flex gap-2">
                      <button
                          @click="uploadFiles"
                          :disabled="isUploading"
                          class="btn flex-1 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                          :class="isUploading ? 'btn-disabled opacity-50' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600'"
                      >
                        <span v-if="isUploading" class="loading loading-spinner loading-sm"></span>
                        <span v-else class="flex items-center gap-2">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          {{ isUploading ? '上传中...' : '开始上传' }}
                        </span>
                      </button>
                      <button
                          @click="clearFiles"
                          class="btn btn-ghost rounded-xl hover:bg-red-50 hover:text-red-600"
                      >
                        清空
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- 右侧文件报表区域 -->
          <main class="col-span-12 lg:col-span-7 xl:col-span-8">
            <div class="card h-full border-0 bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-500/10">
              <div class="card-body p-0 flex flex-col h-full">

                <!-- 报表区域标题 -->
                <div class="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                      <span class="text-2xl">🎵</span>
                      文件报表
                    </h2>
                    <div class="flex items-center gap-2">
                      <!-- 标签过滤 -->
                      <select
                          v-model="selectedTagFilter"
                          class="select select-bordered select-sm rounded-xl bg-white/70 border-indigo-200 focus:border-indigo-400"
                      >
                        <option value="">所有标签</option>
                        <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
                      </select>

                    </div>
                  </div>

                  <!-- 搜索框 -->
                  <div class="mt-4 relative">
                    <input
                        type="text"
                        placeholder="搜索文件..."
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

                <!-- 文件列表区域 -->
                <div class="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] px-3" style="scrollbar-width: thin; scrollbar-color: rgba(99, 102, 241, 0.3) transparent;">
                  <div class="space-y-3 py-4">
                    <!-- 统计信息 -->
                    <div class="grid grid-cols-3 gap-4 mb-6">
                      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
                        <div class="text-center">
                          <div class="text-2xl font-bold text-blue-600">{{ shareFiles.length }}</div>
                          <div class="text-sm text-gray-600">总文件数</div>
                        </div>
                      </div>
                      <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                        <div class="text-center">
                          <div class="text-2xl font-bold text-green-600">{{ totalFileSize }}</div>
                          <div class="text-sm text-gray-600">总大小</div>
                        </div>
                      </div>
                      <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200">
                        <div class="text-center">
                          <div class="text-2xl font-bold text-purple-600">{{ allTags.length }}</div>
                          <div class="text-sm text-gray-600">标签数</div>
                        </div>
                      </div>
                    </div>

                    <!-- 文件列表 -->
                    <div
                        v-for="file in filteredFiles"
                        :key="file.share_id"
                        class="file-item p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-lg hover:scale-[1.02] bg-white/70 border border-gray-200"
                    >
                      <div class="flex items-start gap-4">
                        <!-- 文件图标 -->
                        <div class="text-4xl">{{ getFileIcon(file.file_type) }}</div>

                        <!-- 文件信息 -->
                        <div class="flex-1 min-w-0">
                          <div class="flex items-start justify-between">
                            <div class="min-w-0 flex-1">
                              <h3 class="font-semibold text-gray-800 truncate">{{ file.file_name || '未命名文件' }}</h3>
                              <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ file.description || '暂无描述' }}</p>

                              <!-- 文件详情 -->
                              <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>{{ formatFileSize(Number(file.file_size)) }}</span>
                                <span>{{ file.share_user?.user_name||'未命名用户' }}</span>
                                <span>{{ formatTime(file.share_time) }}</span>
                              </div>

                              <!-- 标签 -->
                              <div v-if="file.tags != null && file.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                                <span
                                    v-for="tag in file.tags"
                                    :key="tag.tag_id"
                                    class="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                                >
                                  {{ tag }}
                                </span>
                              </div>
                            </div>

                            <!-- 操作按钮 -->
                            <div class="flex flex-col gap-2 ml-4">
                              <button
                                  @click="downloadFile(file)"
                                  class="btn btn-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 rounded-lg hover:from-blue-600 hover:to-indigo-600"
                              >
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                下载
                              </button>
                              <button
                                  @click="deleteFile(file)"
                                  class="btn btn-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 rounded-lg hover:from-red-600 hover:to-pink-600"
                              >
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                删除
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 空状态 -->
                    <div v-if="filteredFiles.length === 0" class="text-center py-12">
                      <div class="text-6xl mb-4 opacity-50">📁</div>
                      <h3 class="text-xl font-semibold text-gray-600 mb-2">暂无文件</h3>
                      <p class="text-gray-500">{{ searchTerm ? '未找到匹配的文件' : '开始上传您的第一个文件吧' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- 上传进度弹窗 -->
    <div v-if="showUploadProgress" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        <div class="p-6">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">⬆️</div>
            <h3 class="text-lg font-bold text-gray-800">文件上传中</h3>
          </div>
          <div class="space-y-3">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                  class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  :style="`width: ${uploadProgress}%`"
              ></div>
            </div>
            <p class="text-sm text-gray-600 text-center">{{ uploadProgress }}% 完成</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 侧边抽屉菜单 -->
    <SideDrawer :menu-items="menuItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Header from '../../components/homeHead.vue';
import SideDrawer from '../../components/homeSideDrawer.vue';
import {withRequest} from "../../../ts/composables/useRequest";
import api from "../../../ts/api/api";
import type {ShareFileInfo} from "../../../ts/type/ShareFileInfo";
import {Tag} from "../../../ts/type/Tag";
import {useUserStore} from "../../../ts/stores/user";

const userStore = useUserStore();
const currentUser = userStore.getUser();

// 菜单项
const menuItems = [
  { title: '首页', href: '/home', icon: '🏠' },
  { title: '好友聊天', href: '/chat', icon: '💬' },
  { title: '系统设置', href: '/settings', icon: '⚙️' },
  { title: '帮助支持', href: '/help', icon: '❓' }
];

// 文件相关数据
interface FileInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  description: string;
  tags: string[];
  uploader: string;
  uploadTime: string;
  url: string;
}

const selectedFiles = ref<File[]>([]);
const fileDescription = ref('');
const tagInput = ref('');
const fileTags = ref<string[]>([]);
const isDragOver = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const showUploadProgress = ref(false);
const fileInput = ref();
const searchTerm = ref('');
const selectedTagFilter = ref('');

const shareFiles = ref<ShareFileInfo[]>([
  {
    share_id: '',
    share_user : null ,
    share_file: null ,
    file_name: '' ,
    share_time: '' ,
    file_size: '' ,
    file_type: '' ,
    description: '' ,
    share_state: '',
    tags: null,
  }
]);
// 计算属性
const filteredFiles = computed(() => {
  let filtered = shareFiles.value;

  // 按搜索关键词过滤
  if (searchTerm.value) {
    filtered = filtered.filter(file =>
        file.file_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        file.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        file.share_user.user_id.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  // 按标签过滤
  if (selectedTagFilter.value) {
    filtered = filtered.filter(file =>
        file.tags.some(tag => tag.tag_name === selectedTagFilter.value)
    );
  }

  return filtered.sort((a, b) => new Date(b.share_time).getTime() - new Date(a.share_time).getTime());
});

const allTags = computed(() => {
  const tags = new Set<string>();
  shareFiles.value.forEach(file => {
    if(file.tags == null){
      return;
    }
    file.tags.forEach(tag => tags.add(tag.tag_name));
  });
  return Array.from(tags);
});

const totalFileSize = computed(() => {
  const total = shareFiles.value.reduce((sum, file) => sum + Number(file.file_size), 0);
  return formatFileSize(total);
});

// 工具函数
const getFileIcon = (type: string): string => {
  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼️';
  if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
  if (type.includes('presentation') || type.includes('powerpoint')) return '📽️';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('text')) return '📃';
  if (type.includes('video')) return '🎥';
  if (type.includes('audio')) return '🎵';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  return '📎';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatTime = (timeString: string): string => {
  if (!timeString) return '';

  const [datePart, timePart] = timeString.split(' ');
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (datePart === todayStr) {
    return timePart.substring(0, 5);
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (datePart === yesterdayStr) {
    return '昨天';
  }

  const currentYear = today.getFullYear().toString();
  if (datePart.startsWith(currentYear)) {
    return datePart.substring(5, 10).replace('-', '/');
  }

  return datePart.substring(2, 10).replace(/-/g, '/');
};

// 文件操作方法
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  if (event.dataTransfer?.files) {
    selectedFiles.value = Array.from(event.dataTransfer.files);
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const clearFiles = () => {
  selectedFiles.value = [];
  fileDescription.value = '';
  fileTags.value = [];
};

// 标签操作
const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !fileTags.value.includes(tag)) {
    fileTags.value.push(tag);
    tagInput.value = '';
  }
};

const removeTag = (index: number) => {
  fileTags.value.splice(index, 1);
};

const tags = computed<Tag[]>(() => {
  return fileTags.value.map(tagName => ({
    tag_name: tagName,
    tag_id: '',
    conn_id: '', // 填充你的业务逻辑
    tag_state: '',
  }));
});

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return;

  isUploading.value = true;
  showUploadProgress.value = true;
  uploadProgress.value = 0;

  try {
    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      uploadProgress.value = i;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    let successCount = 0;
    let failureCount = 0;

    for (const file of selectedFiles.value) { // 使用 for...of 更清晰
      try {
        const shareFile: ShareFileInfo = {
          share_id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          share_user: currentUser,
          share_file: null,
          file_name: file.name,
          share_time: '',
          file_size: String(file.size),
          file_type: file.type,
          description: fileDescription.value,
          share_state: null,
          tags: tags.value,
        };

        const res = await withRequest(() => api.module.shareFile.uploadShare(file, shareFile));

        if (res?.retValue) {
          shareFiles.value.unshift(res.retValue);
          successCount++;
        } else {
          failureCount++;
        }
      } catch (fileError) {
        console.error('单个文件上传失败:', file.name, fileError);
        failureCount++;
      }
    }

    if (successCount > 0) {
      alert(`成功上传 ${successCount} 个文件！`);
    }
    if (failureCount > 0) {
      alert(`有 ${failureCount} 个文件上传失败！`);
    }

    clearFiles();
    showUploadProgress.value = false;

  } catch (error) {
    console.error('上传过程出错:', error);
    alert('上传失败，请重试');
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
};

// 下载文件
const downloadFile = (file: ShareFileInfo) => {
  // 模拟下载
  const link = document.createElement('a');
  link.href = file.share_file.file_url;
  link.download = file.file_name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 删除文件
const deleteFile = (file: ShareFileInfo) => {
  if (confirm(`确定要删除文件 "${file.file_name}" 吗？`)) {
    const index = shareFiles.value.findIndex(f => f.share_id === file.share_id);
    if (index > -1) {
      shareFiles.value.splice(index, 1);
    }
  }
};

onMounted(async () => {
  await getShareFile(currentUser.user_id);
});

const getShareFile = async (userid) => {
  const res = await withRequest(() => api.module.shareFile.getShareList(userid));
  if(res?.retValue){
    shareFiles.value = res.retValue;
  }
}
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

/* 文件列表滚动条 */
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

/* 文件项悬停效果 */
.file-item:hover {
  transform: translateY(-2px);
}

/* 拖拽区域效果 */
.border-dashed {
  background-image: url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20'%3e%3cg fill='none' stroke='%236366f1' stroke-width='1'%3e%3cpath d='m0 10h20M10 0v20'/%3e%3c/g%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)' opacity='0.1'/%3e%3c/svg%3e");
}

/* 动画效果 */
.file-item {
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

/* 文本截断效果 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


/* 响应式调整 */
@media (max-width: 1024px) {
  .container {
    height: calc(100vh - 80px);
  }

  .grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 640px) and (max-width: 1024px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 上传进度条动画 */
.h-2 {
  transition: width 0.3s ease-in-out;
}

/* 拖拽状态样式 */
.border-dashed.border-indigo-500 {
  background-color: rgba(99, 102, 241, 0.05);
}
</style>