<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <!-- 光晕效果 -->
    <div class="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500 opacity-20 mix-blend-multiply blur-xl filter"></div>
    <div class="absolute right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-xl filter" style="animation-delay: 2s;"></div>
    <div class="absolute bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-xl filter" style="animation-delay: 4s;"></div>

    <!-- 忘记密码面板 -->
    <div class="z-10 w-full max-w-md bg-base-100 rounded-2xl shadow-2xl border border-black/20">
      <div class="p-8 space-y-6">
        <!-- 标题 -->
        <div class="text-center">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
            <span class="text-yellow-400">🔐</span> 忘记密码
          </h2>
          <p class="text-gray-500 mt-2 text-sm">
            {{ getStepDescription() }}
          </p>
        </div>

        <!-- 用户名输入步骤 -->
        <div v-if="step === 'username'" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium ">
              <svg class="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              用户名
            </label>
            <input
                v-model="username"
                type="text"
                placeholder="请输入您的用户名"
                class="w-full px-4 py-3 bg-white/10 border border-black/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <button
              @click="handleUsernameSubmit"
              :disabled="loading"
              class="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <div v-if="loading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
              验证中...
            </div>
            <span v-else>下一步</span>
          </button>
        </div>

        <!-- 密保问题步骤 -->
        <div v-if="step === 'questions'" class="space-y-4">
          <!-- 卡片容器 -->
          <div class="relative h-48 perspective-1000">
            <div
                :class="[
                'absolute inset-0 transition-transform duration-300 transform-style-preserve-3d',
                { 'rotate-y-180': cardTransition }
              ]"
            >
              <!-- 当前问题卡片 -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-black/20 p-6 backface-hidden">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-blue-400 text-sm font-medium">
                    问题 {{ currentQuestionIndex + 1 }}
                  </span>
                  <span class="text-gray-400 text-sm">
                    {{ currentQuestionIndex + 1 }}/{{ userSecQuestions.length }}
                  </span>
                </div>
                <h3 class="text-lg font-medium mb-6 leading-relaxed">
                  {{ userSecQuestions[currentQuestionIndex]?.question }}
                </h3>
                <div class="mt-auto">
                  <div class="w-full bg-white/10 rounded-full h-2">
                    <div
                        class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${((currentQuestionIndex + 1) / userSecQuestions.length) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 答案输入 -->
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-500">
                您的答案
              </label>
              <input
                  v-model="userAnswer"
                  type="text"
                  placeholder="请输入答案"
                  class="w-full px-4 py-3 bg-white/10 border border-black/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <button
                @click="handleQuestionSubmit"
                class="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {{ currentQuestionIndex < userSecQuestions.length - 1 ? '下一题' : '验证完成' }}
            </button>
          </div>
        </div>

        <!-- 未设置密保问题步骤 -->
        <div v-if="step === 'no-security'" class="text-center space-y-4">
          <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="text-lg font-medium">未设置密保问题</h3>
            <p class="text-gray-500 text-sm leading-relaxed">
              当前用户没有设置密保问题，无法通过此方式重置密码。
            </p>
            <div class="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
              <p class="text-blue-300 text-sm">
                请联系客服邮箱：<br />
                <span class="font-mono text-blue-400">2661442527@qq.com</span>
              </p>
            </div>
          </div>
        </div>

        <!-- 重置密码步骤 -->
        <div v-if="step === 'reset-password'" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-500">
              <svg class="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              新密码
            </label>
            <div class="relative">
              <input
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入新密码"
                  class="w-full px-4 py-3 pr-12 bg-white/10 border border-black/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-500">
              <svg class="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              确认密码
            </label>
            <div class="relative">
              <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="请再次输入密码"
                  class="w-full px-4 py-3 pr-12 bg-white/10 border border-black/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <button
              @click="handlePasswordReset"
              :disabled="loading"
              class="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <div v-if="loading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
              重置中...
            </div>
            <span v-else>重置密码</span>
          </button>
        </div>

        <!-- 警告信息 -->
        <div v-if="showAlert" :class="['alert', alertType, 'animate-shake']">
          <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ alertMessage }}</span>
        </div>

        <!-- 返回登录按钮 -->
        <div class="text-center">
          <button
              onclick="location.href='/login'"
              class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
          >
            ← 返回登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, nextTick} from 'vue'
import {withRequest} from "../../ts/composables/useRequest";
import api from "../../ts/api/api";
import {useUserStore} from "../../ts/stores/user";
import {UserSerQuestion} from "../../ts/type/UserSerQuestion";

interface SecurityQuestion {
  id: number
  question: string
  answer: string
}

// 响应式状态
const step = ref<'username' | 'questions' | 'no-security' | 'reset-password'>('username')
const username = ref('')
const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'alert-error' | 'alert-success' | 'alert-info'>('alert-error')
const cardTransition = ref(false)

const userStore = useUserStore();

const userSecQuestions = reactive<UserSerQuestion[]>([]);

// 方法
const getStepDescription = () => {
  switch (step.value) {
    case 'username':
      return '请输入您的用户名'
    case 'questions':
      return `密保问题 ${currentQuestionIndex.value + 1}/${userSecQuestions.length}`
    case 'no-security':
      return '未设置密保问题'
    case 'reset-password':
      return '设置新密码'
    default:
      return ''
  }
}

const showAlertMessage = (message: string, type: 'alert-error' | 'alert-success' | 'alert-info') => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 3000)
}

const handleUsernameSubmit = async () => {
  if (!username.value.trim()) {
    showAlertMessage('请输入用户名', 'alert-error')
    return
  }

  loading.value = true

  const res0 = await withRequest(() => api.account.auth.chickUsernameIsHave(username.value));
  if(res0.retCode=="0000"){
    if(res0?.retValue && res0.retValue){
      const res1 = await withRequest(() => api.account.user.getUserSecQuestionNoAnswer(username.value));
      if(res1?.retValue){
        Object.assign(userSecQuestions, res1.retValue);
        step.value = 'questions'
      }else{
        step.value = 'no-security'
      }
      loading.value = false
      return;
    }
  }

  showAlertMessage('用户不存在', 'alert-error')
  loading.value = false
  return;
}

const handleQuestionSubmit = async () => {
  if (!userAnswer.value.trim()) {
    showAlertMessage('请输入答案', 'alert-error')
    return
  }

  const currentQuestion = userSecQuestions[currentQuestionIndex.value]

  const res0 = await withRequest(() => api.account.user.checkAnswer(currentQuestion.secq_id,userAnswer.value.trim()));
  if(res0.retValue){
    // 答案正确，切换到下一题
    if (currentQuestionIndex.value < userSecQuestions.length - 1) {
      cardTransition.value = true
      setTimeout(() => {
        currentQuestionIndex.value++
        userAnswer.value = ''
        cardTransition.value = false
      }, 300)
    } else {
      // 所有问题都回答正确
      showAlertMessage('验证成功！', 'alert-success')
      setTimeout(() => {
        step.value = 'reset-password'
      }, 500)
    }
  }else{
    showAlertMessage('答案错误，请重新输入', 'alert-error')
    return
  }
}

const handlePasswordReset = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    showAlertMessage('请填写完整信息', 'alert-error')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    showAlertMessage('两次输入的密码不一致', 'alert-error')
    return
  }

  loading.value = true

  const res = await withRequest(() => api.account.user.updateUserPassword(username.value,newPassword.value));
  if(res.retValue){
    showAlertMessage('密码重置成功！', 'alert-success')
    loading.value = false

    step.value = 'username'
    username.value = ''
    currentQuestionIndex.value = 0
    userAnswer.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    location.href='/login'
  }
}

function handleBackToLogin() {
  step.value = 'username'
  username.value = ''
  currentQuestionIndex.value = 0
  userAnswer.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showAlert.value = false
}

onMounted(async () => {
  handleBackToLogin();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 10%;
  animation-delay: 1s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 5%;
  animation-delay: 2s;
}

.shape-4 {
  width: 40px;
  height: 40px;
  top: 60%;
  right: 20%;
  animation-delay: 3s;
}

.shape-5 {
  width: 70px;
  height: 70px;
  bottom: 10%;
  right: 40%;
  animation-delay: 4s;
}

.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.backface-hidden {
  backface-visibility: hidden;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.alert-success {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
}

.alert-info {
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #93c5fd;
}

button {
  cursor: pointer;
}
</style>