<template>
  <div class="drawer drawer-mobile min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- 抽屉开关 -->
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <!-- 👇 顶部导航栏 -->
      <Header />
      <!-- 背景装饰 -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl floating-animation"></div>
        <div class="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl floating-animation-delay"></div>
        <div class="absolute top-1/3 left-1/2 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl floating-animation-slow"></div>
      </div>

      <div class="container mx-auto px-4 py-8 relative z-10">
        <!-- 页面标题 -->
        <div class="text-center mb-12">
          <h1 class="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 tracking-tight">
            🚀 功能页面集合
          </h1>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            探索各种实用功能，提升你的工作效率和娱乐体验
          </p>
        </div>

        <!-- 搜索和筛选栏 -->
        <div class="glass-effect rounded-3xl p-8 mb-8 shadow-2xl border border-white/30">
          <div class="flex flex-col lg:flex-row gap-6 items-center">
            <!-- 搜索框 -->
            <div class="relative flex-1 w-full lg:w-auto">
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="🔍 搜索功能页面..."
                  class="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-gray-200/50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/50 outline-none transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 search-input shadow-lg"
              >
              <div class="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </div>
              <!-- 清除搜索按钮 -->
              <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span class="text-lg">✕</span>
              </button>
            </div>

            <!-- 分类筛选 -->
            <div class="flex flex-wrap gap-3">
              <button
                  v-for="category in categories"
                  :key="category.name"
                  @click="selectedCategory = category.name"
                  :class="getCategoryButtonClass(category.name)"
                  class="px-6 py-3 rounded-2xl font-semibold transition-all duration-200 border-2 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <span class="text-lg">{{ category.icon }}</span>
                <span>{{ category.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-xl">
            <div class="text-3xl font-bold text-indigo-600 mb-1">{{ totalPages }}</div>
            <div class="text-sm text-gray-600 font-medium">总功能数</div>
          </div>
          <div class="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-xl">
            <div class="text-3xl font-bold text-emerald-600 mb-1">{{ favoriteCount }}</div>
            <div class="text-sm text-gray-600 font-medium">收藏数</div>
          </div>
          <div class="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-xl">
            <div class="text-3xl font-bold text-purple-600 mb-1">{{ filteredPages.length }}</div>
            <div class="text-sm text-gray-600 font-medium">当前显示</div>
          </div>
          <div class="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow-xl">
            <div class="text-3xl font-bold text-orange-600 mb-1">{{ recentlyAdded }}</div>
            <div class="text-sm text-gray-600 font-medium">最近新增</div>
          </div>
        </div>

        <!-- 功能页面网格 -->
        <TransitionGroup name="card-list" tag="div" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" appear>
          <div
              v-for="(page, index) in filteredPages"
              :key="page.id"
              class="card-item"
          >
            <div class="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden h-full flex flex-col card-hover group">
              <!-- 封面图片 -->
              <div class="relative h-52 overflow-hidden">
                <img
                    :src="page.cover"
                    :alt="page.name"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    @error="handleImageError"
                >
                <!-- 渐变遮罩 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-100 transition-opacity duration-300"></div>

                <!-- 分类标签 -->
                <div class="absolute top-4 left-4">
                  <span
                      :class="getCategoryColor(page.category)"
                      class="px-4 py-2 rounded-full text-sm font-bold text-white shadow-xl backdrop-blur-sm border border-white/20"
                  >
                    {{ getCategoryIcon(page.category) }} {{ page.category }}
                  </span>
                </div>
                <!-- 状态标签 -->
                <div v-if="page.status" class="absolute top-4 right-4">
                  <span
                      :class="getStatusColor(page.status)"
                      class="px-3 py-2 rounded-full text-sm font-bold text-white shadow-xl backdrop-blur-sm border border-white/20 animate-pulse"
                  >
                    {{ page.status }}
                  </span>
                </div>
              </div>

              <!-- 卡片内容 -->
              <div class="p-6 flex-1 flex flex-col">
                <h3 class="text-xl font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
                  {{ page.name }}
                </h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                  {{ page.description }}
                </p>

                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 mb-6">
                  <span
                      v-for="tag in page.tags"
                      :key="tag"
                      class="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-700 transition-all cursor-pointer transform hover:scale-105 font-medium"
                      @click="searchByTag(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- 操作按钮 -->
                <div class="flex gap-3 mt-auto">
                  <button
                      @click="visitPage(page)"
                      class="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-bold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-2xl transform hover:scale-105 active:scale-95 relative overflow-hidden group/btn"
                      :disabled="loading"
                  >
                    <span class="relative z-10 flex items-center justify-center gap-2">
                      <span class="text-lg">🚀</span>
                      <span>访问</span>
                    </span>
                    <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <button
                      @click="toggleFavorite(page)"
                      :class="getFavoriteButtonClass(page.isFavorite)"
                      class="w-12 h-12 rounded-2xl transition-all duration-300 hover:shadow-xl transform hover:scale-110 active:scale-95 flex items-center justify-center font-bold relative overflow-hidden group/fav"
                      :disabled="loading"
                  >
                    <span class="relative z-10 text-xl transition-transform duration-300 group-hover/fav:scale-125">
                      {{ page.isFavorite ? '❤️' : '🤍' }}
                    </span>
                    <div v-if="page.isFavorite" class="absolute inset-0 bg-gradient-to-r from-red-400/30 to-pink-400/30 animate-pulse"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- 空状态 -->
        <Transition name="empty-state">
          <div v-if="filteredPages.length === 0" class="text-center py-20">
            <div class="text-8xl mb-6 animate-bounce">🔍</div>
            <h3 class="text-3xl font-bold text-gray-800 mb-4">没有找到相关功能</h3>
            <p class="text-gray-600 mb-8 text-lg">试试调整搜索关键词或选择其他分类</p>
            <button
                @click="clearFilters"
                class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <span class="flex items-center gap-2">
                <span>🔄</span>
                <span>清除筛选条件</span>
              </span>
            </button>
          </div>
        </Transition>

        <!-- 添加新功能按钮 -->
        <div class="fixed bottom-8 right-8 z-40">
          <button
              @click="showAddModal = true"
              class="w-16 h-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center text-2xl relative overflow-hidden group add-btn-float"
              :disabled="loading"
          >
            <span class="relative z-10 transition-transform duration-300 group-hover:rotate-90">➕</span>
            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      <!-- 添加功能模态框 -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showAddModal" class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/30">
              <div class="p-8">
                <div class="flex justify-between items-center mb-8">
                  <h2 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">➕ 添加新功能</h2>
                  <button
                      @click="closeAddModal"
                      class="text-gray-400 hover:text-gray-600 text-3xl transition-all duration-300 hover:rotate-90 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>

                <!-- 添加表单 -->
                <form @submit.prevent="addNewPage" class="space-y-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">
                      功能名称 <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="newPage.name"
                        type="text"
                        required
                        maxlength="50"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        placeholder="请输入功能名称"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">功能描述</label>
                    <textarea
                        v-model="newPage.description"
                        rows="3"
                        maxlength="200"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm"
                        placeholder="请描述这个功能的用途和特点"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">
                      分类 <span class="text-red-500">*</span>
                    </label>
                    <select
                        v-model="newPage.category"
                        required
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="">选择分类</option>
                      <option
                          v-for="cat in categories.slice(1)"
                          :key="cat.name"
                          :value="cat.name"
                      >
                        {{ cat.icon }} {{ cat.name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">封面链接</label>
                    <input
                        v-model="newPage.cover"
                        type="url"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        placeholder="https://example.com/image.jpg"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">
                      页面链接 <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="newPage.url"
                        type="url"
                        required
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        placeholder="https://example.com"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">标签 (用逗号分隔)</label>
                    <input
                        v-model="newPage.tagsInput"
                        type="text"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        placeholder="标签1, 标签2, 标签3"
                    >
                  </div>

                  <div class="flex gap-4 pt-6">
                    <button
                        type="submit"
                        :disabled="loading"
                        class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                    >
                      <span v-if="loading" class="inline-flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        添加中...
                      </span>
                      <span v-else class="flex items-center gap-2">
                        <span>✨</span>
                        <span>添加功能</span>
                      </span>
                    </button>
                    <button
                        type="button"
                        @click="closeAddModal"
                        :disabled="loading"
                        class="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      取消
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <SideDrawer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, nextTick } from 'vue'
import Header from "../components/homeHead.vue";
import SideDrawer from "../components/homeSideDrawer.vue";

// 类型定义
interface Category {
  name: string
  icon: string
}

interface FunctionPage {
  id: number
  name: string
  description: string
  category: string
  cover: string
  url: string
  tags: string[]
  status?: string
  isFavorite: boolean
  createdAt: Date
}

interface NewPageForm {
  name: string
  description: string
  category: string
  cover: string
  url: string
  tagsInput: string
}

// 响应式数据
const searchQuery = ref<string>('')
const selectedCategory = ref<string>('全部')
const showAddModal = ref<boolean>(false)
const loading = ref<boolean>(false)

// 分类数据
const categories = ref<Category[]>([
  { name: '全部', icon: '🌟' },
  { name: '游戏', icon: '🎮' },
  { name: '工具', icon: '🛠️' },
  { name: '传送门', icon: '🚪' },
  { name: '其他', icon: '📦' }
])

// 功能页面数据
const pages = ref<FunctionPage[]>([
  {
    id: 1,
    name: '在线代码编辑器',
    description: '支持多种编程语言的在线代码编辑和运行环境，实时预览效果。',
    category: '工具',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    url: '#',
    tags: ['编程', '在线', '实时'],
    status: '推荐',
    isFavorite: false,
    createdAt: new Date('2025-08-01')
  },
  {
    id: 2,
    name: '摩斯密码',
    description: '快速压缩图片大小，支持多种格式，保持高质量输出。',
    category: '工具',
    cover: 'https://images.unsplash.com/photo-1616628188750-294d61747b99?w=400&h=300&fit=crop',
    url: '/mosi',
    tags: ['在线', '解码', '加密'],
    status: '热门',
    isFavorite: false,
    createdAt: new Date('2025-08-01')
  }
])

// 新页面表单数据
const newPage = reactive<NewPageForm>({
  name: '',
  description: '',
  category: '',
  cover: '',
  url: '',
  tagsInput: ''
})

// 计算属性
const filteredPages = computed<FunctionPage[]>(() => {
  let filtered = pages.value

  // 按分类过滤
  if (selectedCategory.value !== '全部') {
    filtered = filtered.filter(page => page.category === selectedCategory.value)
  }

  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(page =>
        page.name.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query) ||
        page.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

const totalPages = computed<number>(() => pages.value.length)

const favoriteCount = computed<number>(() =>
    pages.value.filter(page => page.isFavorite).length
)

const recentlyAdded = computed<number>(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return pages.value.filter(page => page.createdAt > thirtyDaysAgo).length
})

// 方法
const getCategoryButtonClass = (categoryName: string): string => {
  return selectedCategory.value === categoryName
      ? 'relative px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 will-change:transform flex items-center justify-center gap-2'
      : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-xl border-white/50'
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    '游戏': 'bg-gradient-to-r from-red-500 to-pink-500',
    '工具': 'bg-gradient-to-r from-blue-500 to-indigo-500',
    '传送门': 'bg-gradient-to-r from-green-500 to-emerald-500',
    '其他': 'bg-gradient-to-r from-purple-500 to-violet-500'
  }
  return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600'
}

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    '游戏': '🎮',
    '工具': '🛠️',
    '传送门': '🚪',
    '其他': '📦'
  }
  return icons[category] || '📋'
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    '推荐': 'bg-gradient-to-r from-yellow-500 to-orange-500',
    '热门': 'bg-gradient-to-r from-red-500 to-pink-500',
    '精选': 'bg-gradient-to-r from-indigo-500 to-purple-500',
    '新品': 'bg-gradient-to-r from-green-500 to-emerald-500'
  }
  return colors[status] || 'bg-gradient-to-r from-gray-500 to-gray-600'
}

const getFavoriteButtonClass = (isFavorite: boolean): string => {
  return isFavorite
      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl border-2 border-red-300'
      : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:from-gray-400 hover:to-gray-500 shadow-lg border-2 border-gray-200'
}

const visitPage = (page: FunctionPage): void => {
  if (page.url && page.url !== '#') {
    window.open(page.url, '_blank')
  } else {
    alert(`即将前往：${page.name}`)
  }
}

const toggleFavorite = (page: FunctionPage): void => {
  page.isFavorite = !page.isFavorite
  // 这里可以调用API保存收藏状态
}

const searchByTag = (tag: string): void => {
  searchQuery.value = tag
}

const clearFilters = (): void => {
  searchQuery.value = ''
  selectedCategory.value = '全部'
}

const handleImageError = (event: Event): void => {
  const img = event.target as HTMLImageElement
  img.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
}

const closeAddModal = (): void => {
  showAddModal.value = false
  // 重置表单
  Object.keys(newPage).forEach(key => {
    newPage[key as keyof NewPageForm] = ''
  })
}

const addNewPage = async (): Promise<void> => {
  if (!newPage.name || !newPage.category || !newPage.url) {
    alert('请填写必填字段')
    return
  }

  loading.value = true

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    const tags = newPage.tagsInput
        ? newPage.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []

    const page: FunctionPage = {
      id: Date.now(),
      name: newPage.name,
      description: newPage.description || '暂无描述',
      category: newPage.category,
      cover: newPage.cover || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
      url: newPage.url,
      tags: tags,
      isFavorite: false,
      createdAt: new Date()
    }

    pages.value.unshift(page)
    closeAddModal()

    alert('功能页面添加成功！')
  } catch (error) {
    console.error('添加功能页面失败:', error)
    alert('添加失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 卡片悬停效果 */
.card-hover {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform;
}

.card-hover:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* 玻璃态效果 */
.glass-effect {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 激活分类样式 */
.category-active {
  transform: scale(1.05);
  font-weight: 700;
}

/* 快速过渡动画 */
.card-list-move,
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0, 0.1, 1);
}

.card-list-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(30px);
}

.card-list-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-30px);
}

.card-list-leave-active {
  position: absolute;
}

/* 浮动动画 */
.floating-animation {
  animation: float 8s ease-in-out infinite;
}

.floating-animation-delay {
  animation: float 10s ease-in-out infinite reverse;
}

.floating-animation-slow {
  animation: float 12s ease-in-out infinite;
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(1deg);
  }
  50% {
    transform: translateY(-10px) rotate(-1deg);
  }
  75% {
    transform: translateY(-15px) rotate(0.5deg);
  }
}

/* 添加按钮浮动 */
.add-btn-float {
  animation: addBtnFloat 3s ease-in-out infinite;
}

@keyframes addBtnFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.modal-enter-active .bg-white {
  animation: modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 空状态动画 */
.empty-state-enter-active,
.empty-state-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.empty-state-enter-from,
.empty-state-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 搜索输入框增强 */
.search-input:focus {
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1), 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 按钮增强效果 */
button:active {
  transform: scale(0.95);
}

/* 标签悬停效果 */
.tag-hover:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 响应式优化 */
@media (max-width: 640px) {
  .card-hover:hover {
    transform: translateY(-6px) scale(1.02);
  }

  .floating-animation,
  .floating-animation-delay,
  .floating-animation-slow {
    animation: none;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .floating-animation,
  .floating-animation-delay,
  .floating-animation-slow,
  .add-btn-float {
    animation: none;
  }
}

/* 高对比度支持 */
@media (prefers-contrast: high) {
  .glass-effect {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(0, 0, 0, 0.2);
  }

  .card-hover {
    border: 2px solid rgba(0, 0, 0, 0.1);
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .glass-effect {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .bg-white\/90 {
    background: rgba(17, 24, 39, 0.9);
  }

  .text-gray-800 {
    color: rgb(229, 231, 235);
  }

  .text-gray-600 {
    color: rgb(156, 163, 175);
  }
}
</style>