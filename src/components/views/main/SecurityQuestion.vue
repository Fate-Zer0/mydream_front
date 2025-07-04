<template>
  <div class="drawer drawer-mobile min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- 抽屉开关 -->
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- 顶部导航栏 -->
      <Header />

      <!-- 主体内容 -->
      <div class="container mx-auto mt-8 px-4 pb-8">
        <!-- 页面标题 -->
        <div class="mb-8 text-center">
          <h1 class="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            设置密保
          </h1>
          <p class="text-gray-600">设置密保问题和答案，保护您的账户安全</p>
        </div>

        <!-- 主要内容区域 -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <!-- 左侧安全等级展示 -->
          <div class="lg:col-span-1">
            <div class="card sticky top-8 border border-white/20 bg-gradient-to-br from-white to-indigo-50/50 shadow-xl backdrop-blur-sm">
              <div class="card-body items-center p-6 text-center">
                <!-- 安全等级图标 -->
                <div class="mb-4">
                  <div
                      class="mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300"
                      :class="securityLevelStyle"
                  >
                    <span class="text-3xl">{{ securityLevelIcon }}</span>
                  </div>
                </div>

                <!-- 安全等级文字 -->
                <h3 class="mb-2 text-xl font-bold text-gray-800">密保安全等级</h3>
                <div
                    class="mb-4 rounded-xl px-4 py-2 text-sm font-semibold"
                    :class="securityLevelBadgeStyle"
                >
                  {{ securityLevelText }}
                </div>

                <!-- 安全进度条 -->
                <div class="mb-4 w-full">
                  <div class="mb-2 text-sm text-gray-600">密保完成度</div>
                  <div class="w-full rounded-full bg-gray-200">
                    <div
                        class="h-2 rounded-full transition-all duration-500"
                        :class="securityProgressStyle"
                        :style="{ width: securityProgress + '%' }"
                    ></div>
                  </div>
                  <div class="mt-1 text-xs text-gray-500">{{ securityProgress }}%</div>
                </div>

                <!-- 密保统计 -->
                <div class="w-full rounded-xl bg-gray-50 p-4">
                  <h4 class="mb-3 text-sm font-semibold text-gray-700">📊 密保统计</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">已设置问题</span>
                      <span class="font-semibold text-indigo-600">{{ completedQuestions }}/3</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">安全等级</span>
                      <span class="font-semibold" :class="securityLevelColor">{{ securityLevelText }}</span>
                    </div>
                  </div>
                </div>

                <!-- 安全提示 -->
                <div class="mt-4 w-full text-left">
                  <h4 class="mb-2 text-sm font-semibold text-gray-700">💡 安全提示</h4>
                  <div class="space-y-1 text-xs text-gray-600">
                    <p v-if="completedQuestions === 0" class="text-red-600">
                      ⚠️ 请至少设置一个密保问题
                    </p>
                    <p v-else-if="completedQuestions < 3" class="text-yellow-600">
                      🔸 建议设置全部3个密保问题
                    </p>
                    <p v-else class="text-green-600">
                      ✅ 密保设置完善，账户安全
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧设置表单 -->
          <div class="lg:col-span-3">
            <!-- 当前密保状态 -->
            <div class="card mb-6 border border-white/20 bg-gradient-to-br from-white to-gray-50/50 shadow-xl backdrop-blur-sm">
              <div class="card-body p-6">
                <h3 class="mb-4 flex items-center gap-3 text-xl font-bold text-gray-800">
                  <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                    🛡️
                  </span>
                  当前密保状态
                </h3>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div
                      v-for="(question, index) in securityQuestions"
                      :key="index"
                      class="rounded-xl border-2 p-4 transition-all duration-200"
                      :class="getQuestionStatusStyle(question)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">密保问题 {{ index + 1 }}</h4>
                        <p class="mt-1 text-sm text-gray-600 truncate">
                          {{ getDisplayQuestion(question) || '未设置' }}
                        </p>
                      </div>
                      <div>
                        <span
                            class="rounded-full px-2 py-1 text-xs font-semibold"
                            :class="getStatusBadgeStyle(question)"
                        >
                          {{ isQuestionComplete(question) ? '已设置' : '未设置' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 设置密保问题 -->
            <div class="card border border-white/20 bg-gradient-to-br from-white to-gray-50/50 shadow-xl backdrop-blur-sm">
              <div class="card-body p-8">
                <h3 class="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-800">
                  <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100">
                    🔐
                  </span>
                  设置密保问题
                </h3>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                  <!-- 密保问题设置 -->
                  <div
                      v-for="(question, index) in securityQuestions"
                      :key="index"
                      class="space-y-4"
                  >
                    <div class="rounded-2xl border-2 border-dashed border-gray-200 p-6 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/20">
                      <h4 class="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          {{ index + 1 }}
                        </span>
                        密保问题 {{ index + 1 }}
                        <span v-if="isQuestionComplete(question)" class="ml-2 text-green-500">✅</span>
                      </h4>

                      <!-- 问题选择 -->
                      <div class="form-control mb-4">
                        <label class="label">
                          <span class="label-text flex items-center gap-2 text-base font-semibold text-gray-700">
                            <span>❓</span> 选择问题
                          </span>
                        </label>
                        <select
                            v-model="question.question"
                            class="select select-bordered w-full rounded-xl transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            :class="getInputErrorStyle(!question.question && showValidation)"
                        >
                          <option value="">请选择一个密保问题</option>
                          <option
                              v-for="presetQuestion in presetQuestions"
                              :key="presetQuestion"
                              :value="presetQuestion"
                              :disabled="isQuestionUsed(presetQuestion, index)"
                          >
                            {{ presetQuestion }}
                            {{ isQuestionUsed(presetQuestion, index) ? '(已使用)' : '' }}
                          </option>
                        </select>
                      </div>

                      <!-- 答案输入 -->
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text flex items-center gap-2 text-base font-semibold text-gray-700">
                            <span>🔑</span> 答案
                          </span>
                        </label>
                        <input
                            type="text"
                            v-model="question.answer"
                            placeholder="请输入答案"
                            class="input input-bordered w-full rounded-xl transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            :class="getInputErrorStyle(!question.answer && question.question && showValidation)"
                            maxlength="30"
                        />
                        <label class="label">
                          <span class="label-text-alt text-gray-500">
                            {{ (question?.answer?.length || 0) }}/30
                          </span>
                          <span class="label-text-alt text-gray-500">
                            答案区分大小写，请牢记
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- 安全提示 -->
                  <div class="rounded-2xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                    <h4 class="mb-3 flex items-center gap-2 text-lg font-semibold text-yellow-800">
                      <span>⚠️</span> 安全提示
                    </h4>
                    <ul class="space-y-2 text-sm text-yellow-700">
                      <li class="flex items-start gap-2">
                        <span class="mt-0.5">•</span>
                        <span>请选择只有您知道答案的问题，避免他人猜测</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="mt-0.5">•</span>
                        <span>答案区分大小写，请确保记忆准确</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="mt-0.5">•</span>
                        <span>建议设置全部3个密保问题以提高安全等级</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="mt-0.5">•</span>
                        <span>不要将密保答案设置为与密码相同</span>
                      </li>
                    </ul>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex gap-4 pt-6">
                    <button
                        type="submit"
                        :disabled="isSaving"
                        class="btn flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl disabled:opacity-50"
                    >
                      <span :class="{ 'loading loading-spinner': isSaving }">
                        {{ isSaving ? "保存中..." : "🔒 保存密保设置" }}
                      </span>
                    </button>
                    <button
                        type="button"
                        @click="resetForm"
                        :disabled="isSaving"
                        class="btn btn-outline btn-primary flex-1 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                    >
                      🔄 重置
                    </button>
                  </div>
                </form>
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
import { ref, reactive, computed, onMounted } from "vue";
import Header from "../components/homeHead.vue";
import SideDrawer from "../components/homeSideDrawer.vue";
import { useUserStore } from "../../ts/stores/user";
import { useAlertStore } from "../../ts/stores/alert";
import { withRequest } from "../../ts/composables/useRequest";
import api from "../../ts/api/api";
import type {UserSerQuestion} from "../../ts/type/UserSerQuestion";

const userStore = useUserStore();
const alertStore = useAlertStore();

let userSerQuestions = ref<UserSerQuestion[]>([]);

// 菜单项
const menuItems = [
  { title: "首页", href: "/home", icon: "🏠" },
  { title: "留言板", href: "/messageBoard", icon: "📊" },
  { title: "系统设置", href: "/settings", icon: "⚙️" },
  { title: "帮助支持", href: "/help", icon: "❓" },
];

// 预设问题
const presetQuestions = [
  "您的小学班主任姓什么？",
  "您最喜欢的电影是什么？",
  "您最喜欢的书籍是什么？",
  "您的第一个宠物是什么？",
  "您的第一个宠物叫什么名字？",
  "您最喜欢的城市是什么？",
  "您最喜欢的食物是什么？",
  "您最好的朋友叫什么名字？",
  "您第一份工作是什么？",
  "您最喜欢的游戏是什么？",
];

// 表单数据
const securityQuestions = reactive<UserSerQuestion[]>([
  {
    user: userStore.getUser(),
    secq_id: "",
    question: "",
    answer: "",
    createtime: "",
    state: ""
  },{
    user: userStore.getUser(),
    secq_id: "",
    question: "",
    answer: "",
    createtime: "",
    state: ""
  },{
    user: userStore.getUser(),
    secq_id: "",
    question: "",
    answer: "",
    createtime: "",
    state: ""
  }
]);

// 原始数据备份
const originalQuestions = reactive<UserSerQuestion[]>([
  { user: userStore.getUser(),
    secq_id: "",
    question: "",
    answer: "",
    createtime: "",
    state: ""
  },{
    user: userStore.getUser(),
    secq_id: "",
    question: "",
    answer: "",
    createtime: "",
    state: ""
  },{
    user: userStore.getUser(),
    secq_id: "",
    question: "",
    answer: "",
    createtime: "",
    state: ""
  }
]);

// 状态管理
const isSaving = ref(false);
const showValidation = ref(false);

// 计算已完成的密保问题数量
const completedQuestions = computed(() => {
  return securityQuestions.filter(q => isQuestionComplete(q)).length;
});

// 计算安全进度（基于完成的问题数量）
const securityProgress = computed(() => {
  return Math.round((completedQuestions.value / 3) * 100);
});

// 安全等级样式
const securityLevelStyle = computed(() => {
  const count = completedQuestions.value;
  if (count === 3) return "bg-gradient-to-br from-green-100 to-emerald-100 text-green-600";
  if (count === 2) return "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600";
  if (count === 1) return "bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-600";
  return "bg-gradient-to-br from-red-100 to-pink-100 text-red-600";
});

const securityLevelIcon = computed(() => {
  const count = completedQuestions.value;
  if (count === 3) return "🛡️";
  if (count === 2) return "🔒";
  if (count === 1) return "⚠️";
  return "🚨";
});

const securityLevelText = computed(() => {
  const count = completedQuestions.value;
  if (count === 3) return "高级";
  if (count === 2) return "中级";
  if (count === 1) return "初级";
  return "未设置";
});

const securityLevelBadgeStyle = computed(() => {
  const count = completedQuestions.value;
  if (count === 3) return "bg-green-100 text-green-800";
  if (count === 2) return "bg-blue-100 text-blue-800";
  if (count === 1) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
});

const securityLevelColor = computed(() => {
  const count = completedQuestions.value;
  if (count === 3) return "text-green-600";
  if (count === 2) return "text-blue-600";
  if (count === 1) return "text-yellow-600";
  return "text-red-600";
});

const securityProgressStyle = computed(() => {
  const count = completedQuestions.value;
  if (count === 3) return "bg-gradient-to-r from-green-400 to-emerald-500";
  if (count === 2) return "bg-gradient-to-r from-blue-400 to-indigo-500";
  if (count === 1) return "bg-gradient-to-r from-yellow-400 to-orange-500";
  return "bg-gradient-to-r from-red-400 to-pink-500";
});

// 初始化数据
onMounted(() => {
  loadSecurityQuestions();
});

// 加载密保问题
const loadSecurityQuestions = async (): Promise<void> => {
  try {

    const res = await withRequest(() => api.account.user.getUserSecQuestion(userStore.getUserid()));
    if (res.retCode === "0000" && Array.isArray(res.retValue)) {
      // 接口返回的是 List<UserSerQuestion>，对应 TS 中的 UserSerQuestion[]
      Object.assign(securityQuestions, res.retValue);
      // 如果数量不足 3 条，补足
      while (securityQuestions.value.length < 3) {
        securityQuestions.value.push({
          user: userStore.getUser(), // 当前用户对象
          secq_id: "",
          question: "",
          answer: "",
          createtime: "",
          state: ""
        });
      }

    } else {
      // 接口无数据时，默认填充 3 个空对象
      securityQuestions.value = Array(3).fill({
        user: userStore.getUser(),
        secq_id: "",
        question: "",
        answer: "",
        createtime: "",
        state: ""
      });
    }
  } catch (error) {
    console.error("获取密保问题失败", error);
    // 出现异常也填充默认值
    securityQuestions.value = Array(3).fill({
      user: userStore.getUser(),
      secq_id: "",
      question: "",
      answer: "",
      createtime: "",
      state: ""
    });
  }
   Object.assign(originalQuestions, securityQuestions);
};

// 检查问题是否完整
const isQuestionComplete = (question: UserSerQuestion): boolean => {
  const hasQuestion = question.question?.trim();
  return !!(hasQuestion && question.answer?.trim());
};

// 获取显示的问题文本
const getDisplayQuestion = (question: UserSerQuestion): string => {
  if (!question.question) return "";
  return question.question;
};

// 检查问题是否已被使用
const isQuestionUsed = (question: string, currentIndex: number): boolean => {
  return securityQuestions.some((q, index) =>
      index !== currentIndex && q.question === question
  );
};

// 获取问题状态样式
const getQuestionStatusStyle = (question: UserSerQuestion): string => {
  return isQuestionComplete(question)
      ? "border-green-200 bg-green-50"
      : "border-gray-200 bg-gray-50";
};

// 获取状态徽章样式
const getStatusBadgeStyle = (question: UserSerQuestion): string => {
  return isQuestionComplete(question)
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
};

// 获取输入框错误样式
const getInputErrorStyle = (hasError: boolean): string => {
  return hasError ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";
};

// 表单验证
const validateForm = (): boolean => {
  showValidation.value = true;

  // 检查是否至少设置了一个密保问题
  if (completedQuestions.value === 0) {
    alertStore.showAlertWithAutoHide("alert-warning", "请至少设置一个完整的密保问题");
    return false;
  }

  // 检查每个已选择问题的完整性
  for (let i = 0; i < securityQuestions.length; i++) {
    const q = securityQuestions[i];
    if (q.question) {
      if (!q.answer?.trim()) {
        alertStore.showAlertWithAutoHide("alert-warning", `密保问题 ${i + 1} 的答案不能为空`);
        return false;
      }
    }
  }

  // 检查问题是否重复
  const questions = securityQuestions
      .filter(q => q.question)
      .map(q => q.question);

  const uniqueQuestions = new Set(questions);
  if (questions.length !== uniqueQuestions.size) {
    alertStore.showAlertWithAutoHide("alert-warning", "密保问题不能重复");
    return false;
  }

  return true;
};

// 提交表单
const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return;

  isSaving.value = true;

  try {
    // 准备提交数据
    const submitData = securityQuestions
        .filter(q => isQuestionComplete(q))
        .map(q => ({
          question: q.question,
          answer: q.answer,
        }));

    const res = await withRequest(() => api.account.user.updateUserSecQuestion(securityQuestions));
    // 更新原始数据
    loadSecurityQuestions();

    alertStore.showAlertWithAutoHide("alert-success", `密保设置保存成功！已设置${completedQuestions.value}个密保问题`);
    showValidation.value = false;

  } catch (error) {
    console.error("保存密保问题失败:", error);
    alertStore.showAlertWithAutoHide("alert-warning", "保存失败，请稍后重试");
  } finally {
    isSaving.value = false;
  }
};

// 重置表单
const resetForm = (): void => {
  Object.assign(securityQuestions, JSON.parse(JSON.stringify(originalQuestions)));
  showValidation.value = false;
};
</script>

<style scoped>
/* 减少不必要的动画和效果 */
.transition-all {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
}

/* 优化加载状态 */
.loading {
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

/* 移除之前的复杂动画 */
.alert-top-fixed {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}
</style>