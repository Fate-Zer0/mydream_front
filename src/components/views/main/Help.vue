<template>
  <div class="drawer drawer-mobile min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- 抽屉开关 -->
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- 👇 顶部导航栏 -->
      <Header />
      <!-- 👇 主体内容 -->
      <div class="container mx-auto mt-8 px-4 pb-8">
        <!-- 👇 页面标题区域 -->
        <section class="mb-10">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              帮助与支持
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              欢迎来到帮助中心！这里有您需要的所有信息和解答
            </p>
          </div>
        </section>

<!--        &lt;!&ndash; 👇 搜索区域 &ndash;&gt;-->
<!--        <section class="mb-10">-->
<!--          <div class="max-w-2xl mx-auto">-->
<!--            <div class="card border border-white/20 bg-gradient-to-br from-white to-indigo-50/50 shadow-xl">-->
<!--              <div class="card-body p-6">-->
<!--                <div class="form-control">-->
<!--                  <div class="input-group">-->
<!--                    <input-->
<!--                        v-model="searchQuery"-->
<!--                        type="text"-->
<!--                        placeholder="搜索帮助内容..."-->
<!--                        class="input input-bordered flex-1 rounded-2xl border-gray-200 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"-->
<!--                        @keyup.enter="handleSearch"-->
<!--                    />-->
<!--                    <button-->
<!--                        @click="handleSearch"-->
<!--                        class="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 rounded-2xl ml-2 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"-->
<!--                    >-->
<!--                      <span class="mr-1">🔍</span>-->
<!--                      搜索-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </section>-->

        <!-- 👇 快速导航 -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">快速导航</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                v-for="(nav, i) in quickNavs"
                :key="i"
                class="card group cursor-pointer overflow-hidden border border-white/20 bg-gradient-to-br from-white to-gray-50/50 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                @click="scrollToSection(nav.target)"
            >
              <div class="card-body relative p-6 text-center">
                <!-- 装饰性背景 -->
                <div
                    class="absolute right-0 top-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br opacity-10 transition-transform duration-500 group-hover:scale-150"
                    :class="nav.bgColor"
                ></div>

                <div
                    class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg"
                    :class="nav.iconBg"
                >
                  {{ nav.icon }}
                </div>
                <h3 class="text-lg font-semibold text-gray-800 transition-colors duration-200 group-hover:text-indigo-600">
                  {{ nav.title }}
                </h3>
                <p class="text-sm text-gray-600 mt-2">{{ nav.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 👇 常见问题 -->
        <section id="faq" class="mb-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">常见问题</h2>
          <div class="max-w-4xl mx-auto">
            <div
                v-for="(faq, i) in faqs"
                :key="i"
                class="card mb-4 border border-white/20 bg-gradient-to-br from-white to-gray-50/50 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div
                  class="card-body cursor-pointer p-6"
                  @click="toggleFaq(i)"
              >
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                    <span class="mr-3 text-xl">{{ faq.icon }}</span>
                    {{ faq.question }}
                  </h3>
                  <button
                      class="btn btn-circle btn-sm border-0 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all duration-200"
                      :class="{ 'rotate-180': faq.isOpen }"
                  >
                    <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
                <Transition name="faq-content">
                  <div v-if="faq.isOpen" class="mt-4 pl-10">
                    <p class="text-gray-600 leading-relaxed">{{ faq.answer }}</p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </section>

        <!-- 👇 使用指南 -->
        <section id="guide" class="mb-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">使用指南</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
                v-for="(guide, i) in guides"
                :key="i"
                class="card border border-white/20 bg-gradient-to-br from-white to-gray-50/50 shadow-xl transition-all duration-300 hover:shadow-2xl"
            >
              <div class="card-body p-6">
                <div class="flex items-start mb-4">
                  <div
                      class="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-lg flex-shrink-0"
                      :class="guide.iconBg"
                  >
                    {{ guide.icon }}
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">{{ guide.title }}</h3>
                    <p class="text-gray-600 leading-relaxed">{{ guide.description }}</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <div
                      v-for="(step, stepIndex) in guide.steps"
                      :key="stepIndex"
                      class="flex items-center text-sm text-gray-600"
                  >
										<span class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
											{{ stepIndex + 1 }}
										</span>
                    {{ step }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 👇 联系我们 -->
        <section id="contact" class="mb-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">联系我们</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div class="card border border-white/20 bg-gradient-to-br from-white to-blue-50/50 shadow-xl">
              <div class="card-body p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span class="mr-3 text-2xl">📧</span>
                  在线客服
                </h3>
                <p class="text-gray-600 mb-4">我们的客服团队随时为您提供帮助</p>
                <div class="space-y-3">
                  <div class="flex items-center text-sm text-gray-600">
                    <span class="mr-2">🕐</span>
                    服务时间：周一至周五 9:00-18:00
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <span class="mr-2">📱</span>
                    客服热线：153-9552-9515
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <span class="mr-2">✉️</span>
                    邮箱：2661442527@qq.com
                  </div>
                </div>
                <div class="card-actions mt-4">
                  <button class="btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg">
                    <span class="mr-1">💬</span>
                    在线咨询
                  </button>
                </div>
              </div>
            </div>

            <div class="card border border-white/20 bg-gradient-to-br from-white to-green-50/50 shadow-xl">
              <div class="card-body p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span class="mr-3 text-2xl">💬</span>
                  意见反馈
                </h3>
                <div class="form-control space-y-4">
                  <div>
                    <label class="label">
                      <span class="label-text text-gray-700">反馈类型</span>
                    </label>
                    <select
                        v-model="feedbackType"
                        class="select select-bordered w-full rounded-xl border-gray-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    >
                      <option value="">请选择反馈类型</option>
                      <option value="bug">问题报告</option>
                      <option value="feature">功能建议</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text text-gray-700">详细描述</span>
                    </label>
                    <textarea
                        v-model="feedbackContent"
                        class="textarea textarea-bordered w-full rounded-xl border-gray-200 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        placeholder="请详细描述您的问题或建议..."
                        rows="3"
                    ></textarea>
                  </div>
                  <button
                      @click="submitFeedback"
                      class="btn bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg"
                      :disabled="!feedbackType || !feedbackContent"
                  >
                    <span class="mr-1">📤</span>
                    提交反馈
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 👇 版本信息 -->
        <section id="version" class="mb-10">
          <div class="card border border-white/20 bg-gradient-to-br from-white to-purple-50/50 shadow-xl max-w-2xl mx-auto">
            <div class="card-body p-6 text-center">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                <span class="mr-3 text-2xl">ℹ️</span>
                版本信息
              </h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="text-gray-600">
                  <div class="font-semibold">当前版本</div>
                  <div class="text-indigo-600">v0.0.1</div>
                </div>
                <div class="text-gray-600">
                  <div class="font-semibold">更新时间</div>
                  <div class="text-indigo-600">2025-06-12</div>
                </div>
                <div class="text-gray-600">
                  <div class="font-semibold">系统状态</div>
                  <div class="text-green-600 flex items-center justify-center">
                    <span class="mr-1">✅</span>正常运行
                  </div>
                </div>
                <div class="text-gray-600">
                  <div class="font-semibold">在线用户</div>
                  <div class="text-indigo-600">2</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 👇 侧边抽屉菜单 -->
    <SideDrawer :menu-items="menuItems" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Header from "../components/homeHead.vue";
import SideDrawer from '../components/homeSideDrawer.vue';

// 菜单项
const menuItems = [
  { title: '首页', href: '/home', icon: '🏠' },
  { title: '留言板', href: '/messageBoard', icon: '📊' },
  { title: '系统设置', href: '/settings', icon: '⚙️' },
  { title: '帮助支持', href: '/help', icon: '❓' }
];

// 搜索查询
const searchQuery = ref('');

// 快速导航数据
const quickNavs = ref([
  {
    title: "常见问题",
    description: "查看最常见的问题解答",
    icon: "❓",
    iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    bgColor: "from-blue-500 to-indigo-500",
    target: "faq"
  },
  {
    title: "使用指南",
    description: "详细的功能使用说明",
    icon: "📖",
    iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
    bgColor: "from-green-500 to-emerald-500",
    target: "guide"
  },
  {
    title: "联系客服",
    description: "获取人工客服支持",
    icon: "🎧",
    iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
    bgColor: "from-purple-500 to-pink-500",
    target: "contact"
  },
  {
    title: "版本信息",
    description: "查看当前系统版本",
    icon: "ℹ️",
    iconBg: "bg-gradient-to-br from-orange-100 to-yellow-100",
    bgColor: "from-orange-500 to-yellow-500",
    target: "version"
  }
]);

// 常见问题数据
const faqs = ref([
  {
    icon: "🔐",
    question: "如何重置我的密码？",
    answer: "您可以在登录页面点击\"忘记密码\"链接，输入您的邮箱地址，系统会发送重置密码的链接到您的邮箱。请注意检查垃圾邮件文件夹。",
    isOpen: false
  },
  {
    icon: "📊",
    question: "如何查看我的学习统计数据？",
    answer: "进入\"数据统计\"页面，您可以查看详细的学习进度、签到记录、目标完成情况等统计信息。数据会实时更新，帮助您更好地了解学习状况。",
    isOpen: false
  },
  {
    icon: "🎯",
    question: "如何设置和管理学习目标？",
    answer: "在\"目标追踪\"模块中，您可以创建新的学习目标，设置截止日期和优先级。系统会自动跟踪您的进度，并在即将到期时提醒您。",
    isOpen: false
  },
  {
    icon: "📱",
    question: "支持手机端使用吗？",
    answer: "是的，我们的平台完全支持响应式设计，可以在手机、平板和电脑上完美使用。您可以随时随地访问您的学习内容。",
    isOpen: false
  },
  {
    icon: "🔔",
    question: "如何设置通知提醒？",
    answer: "在\"系统设置\"中，您可以自定义各种通知设置，包括签到提醒、目标到期提醒、学习进度通知等。您可以选择通过邮件或站内消息接收提醒。",
    isOpen: false
  }
]);

// 使用指南数据
const guides = ref([
  {
    title: "新手入门",
    description: "快速了解平台的主要功能和使用方法",
    icon: "🚀",
    iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    steps: [
      "完成账户注册和个人信息设置",
      "浏览主页了解各个功能模块",
      "设置您的第一个学习目标",
      "开始每日签到获取积分",
      "探索数据统计功能追踪进度"
    ]
  },
  {
    title: "高级功能",
    description: "深入使用平台的高级功能提升效率",
    icon: "⚡",
    iconBg: "bg-gradient-to-br from-purple-100 to-pink-100",
    steps: [
      "创建复杂的学习计划和里程碑",
      "使用数据分析优化学习策略",
      "设置个性化的提醒和通知",
      "导出学习报告和统计数据",
      "利用社交功能与他人交流学习心得"
    ]
  }
]);

// 反馈表单数据
const feedbackType = ref('');
const feedbackContent = ref('');

// 搜索处理
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    alert('请输入搜索关键词');
    return;
  }
  // 这里可以实现实际的搜索逻辑
  console.log('搜索:', searchQuery.value);
  alert(`搜索"${searchQuery.value}"的功能正在开发中...`);
};

// 切换FAQ显示
const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen;
};

// 滚动到指定区域
const scrollToSection = (targetId) => {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// 提交反馈
const submitFeedback = () => {
  if (!feedbackType.value || !feedbackContent.value.trim()) {
    alert('请填写完整的反馈信息');
    return;
  }

  // 这里可以实现实际的反馈提交逻辑
  console.log('反馈类型:', feedbackType.value);
  console.log('反馈内容:', feedbackContent.value);

  alert('感谢您的反馈！我们会尽快处理您的建议。');

  // 清空表单
  feedbackType.value = '';
  feedbackContent.value = '';
};

onMounted(() => {
  // 页面加载完成后的初始化逻辑
  console.log('帮助页面已加载');
});
</script>

<style scoped>
/* FAQ内容展开动画 */
.faq-content-enter-active,
.faq-content-leave-active {
  transition: all 0.3s ease;
}

.faq-content-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.faq-content-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.faq-content-enter-to,
.faq-content-leave-from {
  opacity: 1;
  max-height: 200px;
  transform: translateY(0);
}

/* 按钮旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}

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

/* 卡片悬浮效果 */
.card:hover {
  transform: translateY(-2px);
}

/* 按钮悬浮效果 */
.btn:hover:not(.btn-disabled) {
  transform: translateY(-1px);
}

/* 渐变文字效果 */
.bg-clip-text {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 搜索框焦点效果 */
.input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* 选择框和文本域焦点效果 */
.select:focus,
.textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* 步骤编号动画 */
.rounded-full:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* 装饰性背景动画增强 */
.group:hover .absolute {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(-8px) translateX(8px) scale(1);
  }
  50% {
    transform: translateY(-12px) translateX(12px) scale(1.1);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .text-4xl {
    font-size: 2.5rem;
  }

  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 禁用按钮样式 */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
}
</style>