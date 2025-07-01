<template>
  <div
      ref="petWrapperRef"
      class="pet-wrapper">
    <div
        ref="pet"
        class="pet-box"
        :class="{ dragging: isDragging, hovering: isHovering }"
        @mousedown="handleMouseDown"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
    >
      <div class="pet-face">
        <div class="pet-eyes">
          <div class="eye left-eye"></div>
          <div class="eye right-eye"></div>
        </div>
        <div class="pet-mouth"></div>
      </div>
      <div v-if="isDragging" class="drag-particles">
        <div class="particle" v-for="i in 6" :key="i"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, onUnmounted, onBeforeUnmount , onUpdated } from 'vue'
import Matter from 'matter-js'

const petWrapperRef = ref<HTMLDivElement | null>(null)
const pet = ref<HTMLDivElement | null>(null)
let engine: Matter.Engine | null = null
let runner: Matter.Runner | null = null
let petBody: Matter.Body | null = null
let boundaries: Matter.Body[] = []

const isDragging = ref(false)
const isHovering = ref(false)
let dragOffset = { x: 0, y: 0 }
let lastMousePosition = { x: 0, y: 0 }
let animationFrame: number | null = null

const handleMouseDown = (e: MouseEvent) => {
  if (!petBody) return

  isDragging.value = true
  const rect = pet.value!.getBoundingClientRect()
  dragOffset.x = e.clientX - rect.left - 40
  dragOffset.y = e.clientY - rect.top - 40
  lastMousePosition = { x: e.clientX, y: e.clientY }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !petBody) return

  // 计算物理体位置
  const newX = e.clientX - dragOffset.x
  const newY = e.clientY - dragOffset.y

  // 边界检查
  const clampedX = Math.max(40, Math.min(window.innerWidth - 40, newX))
  const clampedY = Math.max(40, Math.min(window.innerHeight - 40, newY))

  // 更新物理体位置
  Matter.Body.setPosition(petBody, { x: clampedX, y: clampedY })
  lastMousePosition = { x: e.clientX, y: e.clientY }
}

const handleMouseUp = (e: MouseEvent) => {
  if (!isDragging.value || !petBody) return

  // 计算释放时的速度
  const deltaX = e.clientX - lastMousePosition.x
  const deltaY = e.clientY - lastMousePosition.y
  const velocity = Math.sqrt(deltaX**2 + deltaY**2)
  const angle = Math.atan2(deltaY, deltaX)

  // 应用惯性力
  Matter.Body.setVelocity(petBody, {
    x: velocity * Math.cos(angle) * 0.05,
    y: velocity * Math.sin(angle) * 0.05
  })
  Matter.Body.setAngularVelocity(petBody, angle * 0.02)

  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const createBoundaries = () => {
  return [
    Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, {
      isStatic: true,
      render: { visible: false }
    }),
    Matter.Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, {
      isStatic: true,
      render: { visible: false }
    }),
    Matter.Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, {
      isStatic: true,
      render: { visible: false }
    }),
    Matter.Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, {
      isStatic: true,
      render: { visible: false }
    })
  ]
}

const updatePetPosition = () => {
  if (petBody && pet.value) {
    const pos = petBody.position
    const angle = petBody.angle

    // 应用边界限制
    const clampedX = Math.max(40, Math.min(window.innerWidth - 40, pos.x))
    const clampedY = Math.max(40, Math.min(window.innerHeight - 40, pos.y))

    // 如果超出边界，应用弹性碰撞
    if (pos.x !== clampedX) {
      Matter.Body.applyForce(petBody, { x: pos.x, y: pos.y }, {
        x: (clampedX - pos.x) * 0.1,
        y: 0
      })
    }
    if (pos.y !== clampedY) {
      Matter.Body.applyForce(petBody, { x: pos.x, y: pos.y }, {
        x: 0,
        y: (clampedY - pos.y) * 0.1
      })
    }

    // 更新DOM位置
    pet.value.style.left = `${clampedX - 40}px`
    pet.value.style.top = `${clampedY - 40}px`
    pet.value.style.transform = `rotate(${angle}rad)`
  }

  animationFrame = requestAnimationFrame(updatePetPosition)
}

// 窗口大小改变处理函数
const handleResize = () => {
  // 获取新的视口尺寸
  const { innerWidth, innerHeight } = window

  // 更新物理引擎边界
  Matter.World.clear(engine.world, false)
  Matter.Engine.clear(engine)
  Matter.World.add(engine.world, [
    // 重新创建边界刚体
    Matter.Bodies.rectangle(innerWidth/2, -10, innerWidth + 20, 20, { isStatic: true }),
    Matter.Bodies.rectangle(innerWidth/2, innerHeight + 10, innerWidth + 20, 20, { isStatic: true }),
    Matter.Bodies.rectangle(-10, innerHeight/2, 20, innerHeight + 20, { isStatic: true }),
    Matter.Bodies.rectangle(innerWidth + 10, innerHeight/2, 20, innerHeight + 20, { isStatic: true })
  ])

  // 调整宠物位置保持在视口内
  if (petBody) {
    const bounds = petWrapperRef.value.getBoundingClientRect()
    Matter.Body.setPosition(petBody, {
      x: Math.max(10, Math.min(innerWidth - 10, bounds.left + bounds.width/2)),
      y: Math.max(10, Math.min(innerHeight - 10, bounds.top + bounds.height/2))
    })
  }
}


onMounted(() => {
  if (!pet.value) return

  engine = Matter.Engine.create()
  const world = engine.world
  world.gravity.y = 0.8

  boundaries = createBoundaries()
  petBody = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      200,
      80,
      80,
      {
        restitution: 0.6,
        friction: 0.05,
        frictionAir: 0.02,
        inertia: Infinity * 0.1,
        render: { visible: false }
      }
  )

  Matter.World.add(world, [petBody, ...boundaries])
  runner = Matter.Runner.create()
  Matter.Runner.run(runner, engine)
  updatePetPosition()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('resize', handleResize)
  if (runner) Matter.Runner.stop(runner)
  if (engine) Matter.Engine.clear(engine)
})
</script>

<style scoped>
@import "../../../css/module/pet/Pet.css";
</style>