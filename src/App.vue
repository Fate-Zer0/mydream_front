qweqweeasdasdasasdasdasdazxccafeethnh<template>
  <div class="min-h-screen overflow-hidden relative bg-black flex items-center justify-center p-4">
    <!-- 登录/注册面板 -->
    <div class="card w-full max-w-md shadow-xl bg-base-100 z-10">
      <div class="card-body p-8 space-y-6">
        <!-- 标题 -->
        <h2 class="text-2xl font-bold text-center text-primary mb-6">
          📘 日积月累
        </h2>
他git跟我去二231231青蛙大5
        <!-- 登录/注册切换标签 -->
        <div class="tabs tabs-boxed mx-auto">
          <a class="tab" :class="{ 'tab-active': isLogin }" @click="isLogin = true;showAlert = false">登录</a>
          <a class="tab" :class="{ 'tab-active': !isLogin }" @click="isLogin = false;showAlert = false">注册</a>
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 用户名 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">用户名</span>
            </label>
            <input
                type="text"
                placeholder="请输入用户名"
                v-model="username"
                class="input input-bordered w-full"
            />
          </div>

          <!-- 密码 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">密码</span>
            </label>
            <input
                type="password"
                placeholder="请输入密码"
                v-model="password"
                class="input input-bordered w-full"
                @input="showAlert=false"
            />
          </div>

          <!-- 注册时显示确认密码 -->
          <div v-if="!isLogin" class="form-control">
            <label class="label">
              <span class="label-text font-medium">确认密码</span>
            </label>
            <input
                type="password"
                placeholder="请再次输入密码"
                v-model="confirmPassword"
                class="input input-bordered w-full"
                @input="showAlert=false"
            />
          </div>

          <!-- 警告信息 -->
          <div v-if="showAlert" :class="[ 'alert', alertType, 'mt-4' ]" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ alertMessage }}</span>
          </div>

          <!-- 记住我 & 忘记密码 -->
          <div v-if="isLogin" class="flex justify-between items-center text-sm">
            <label class="cursor-pointer label gap-2">
              <input type="checkbox" class="checkbox checkbox-primary checkbox-xs" v-model="rememberMe"/>
              <span class="label-text">记住我</span>
            </label>
            <a href="#" class="link link-hover link-primary">忘记密码？</a>
          </div>

          <!-- 提交按钮 -->
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary btn-block normal-case">
              {{ isLogin ? '立即登录' : '立即注册' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLogin: true,
      username: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
      showAlert: false,
      alertType: 'alert-warning', // 默认警告类型
      alertMessage: 'Warning: Invalid email address!'
    }
  },
  methods: {
    handleSubmit() {
      if (this.isLogin) {
        this.alertType = 'alert-success'
        this.alertMessage = '成功: 登陆成功,即将跳转到首页!'
        this.showAlert = true
      } else {
        if (this.password !== this.confirmPassword) {
          this.alertType = 'alert-warning'
          this.alertMessage = '警告: 两次输入的密码不一致!'
          this.showAlert = true
          return;
        }
        this.password = ''
        this.isLogin = true
        this.alertType = 'alert-success'
        this.alertMessage = '成功: 注册成功,请重新输入账号密码登陆!'
        this.showAlert = true
      }
    }
  }
}
</script>

<style scoped>

</style>