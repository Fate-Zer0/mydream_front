<!-- HotDynamics.vue -->
<template>
  <section class="mb-10 border border-gray-200 rounded-xl p-6 bg-white/90 backdrop-blur-sm shadow-sm">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
        <span class="text-2xl animate-pulse text-black">🔥</span>
        热门动态
      </h2>
      <button
          class="btn btn-sm btn-ghost rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 flex items-center gap-1 group"
          @click="$emit('view-all')"
      >
        <span class="font-medium">查看更多</span>
        <svg
            class="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <!-- 内容卡片区域 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
          v-for="post in posts"
          :key="post.id"
          class="card bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-indigo-200 cursor-pointer"
          @click="$emit('post-click', post)"
      >
        <div class="card-body p-5">
          <div class="flex items-start gap-3">
            <!-- 头像 -->
            <div class="avatar">
              <div class="w-10 h-10 rounded-full ring-2 ring-indigo-100 shadow-sm">
                <img
                    :src="post.avatar"
                    :alt="`${post.author}的头像`"
                    class="rounded-full object-cover"
                />
              </div>
            </div>

            <!-- 内容 -->
            <div class="flex-1 min-w-0">
              <!-- 标题 + 标签 -->
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-800 truncate">{{ post.title }}</h3>
                <span
                    class="text-xs font-medium px-2 py-0.5 rounded-full"
                    :class="getBadgeClass(post.type)"
                >
                  {{ post.badge }}
                </span>
              </div>

              <!-- 正文 -->
              <p class="text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                {{ post.content }}
              </p>

              <!-- 时间 & 互动数据 -->
              <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>{{ post.time }}</span>
                <div class="flex items-center gap-3">
                  <!-- 点赞 -->
                  <span class="flex items-center gap-1 hover:text-red-500 transition-colors duration-150">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {{ post.likes }}
                  </span>

                  <!-- 评论 -->
                  <span class="flex items-center gap-1 hover:text-blue-500 transition-colors duration-150">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {{ post.comments }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * Props 说明：
 * - posts: 动态数据数组
 */
defineProps({
  posts: {
    type: Array,
    required: true,
    validator: (value) =>
        value.every((item) =>
            ['title', 'content', 'author', 'avatar', 'time', 'likes', 'comments', 'type', 'badge'].every(
                (key) => key in item
            )
        ),
  },
});

/**
 * 事件定义：
 * - view-all: 点击“查看更多”
 * - post-click: 点击某条动态
 */
const emit = defineEmits(['view-all', 'post-click']);

/**
 * 根据 type 返回徽章样式类
 */
const getBadgeClass = (type) => {
  const classes = {
    hot: 'bg-red-100 text-red-600',
    update: 'bg-green-100 text-green-600',
    challenge: 'bg-yellow-100 text-yellow-600',
    share: 'bg-blue-100 text-blue-600',
  };
  return classes[type] || 'bg-gray-100 text-gray-600';
};
</script>

<style scoped>
/* 可选：添加一些全局兼容样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>