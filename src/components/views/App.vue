<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from "/src/components/stores/user";

const router = useRouter()
const userStore = useUserStore()

const savedUser = localStorage.getItem('user')
if (savedUser) {
  const user = JSON.parse(savedUser)
  userStore.setUserid(user.id)
  userStore.setUsername(user.name)

  router.push({ name: 'Home' })
}else{
  router.push({ name: 'Login' })
}

</script>