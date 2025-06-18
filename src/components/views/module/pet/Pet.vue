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
/* CSS平滑滚动优化 */
.pet-wrapper {
  touch-action: pan-y;
  overscroll-behavior: contain;
}

/* 抗锯齿优化 */
.pet-box {
  image-rendering: pixelated;
}

.pet-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
}

.pet-box {
  width: 80px;
  height: 80px;
  position: absolute;
  /* 初始位置设为0,0，通过JavaScript控制 */
  left: 0;
  top: 0;
  pointer-events: auto;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  /* 美化的外观 */
  background: linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcf7f, #4ecdc4, #45b7d1);
  background-size: 300% 300%;
  border-radius: 50%;
  box-shadow:
      0 8px 32px rgba(255, 107, 107, 0.3),
      inset 0 2px 8px rgba(255, 255, 255, 0.3);

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: gradient-shift 4s ease infinite, float 3s ease-in-out infinite;
}

.pet-box.hovering {
  transform: scale(1.1);
  box-shadow:
      0 12px 48px rgba(255, 107, 107, 0.4),
      0 0 0 4px rgba(255, 255, 255, 0.3),
      inset 0 2px 8px rgba(255, 255, 255, 0.4);
  animation-play-state: paused;
}

.pet-box.dragging {
  cursor: grabbing;
  transform: scale(1.15);
  box-shadow:
      0 16px 64px rgba(255, 107, 107, 0.5),
      0 0 0 6px rgba(255, 255, 255, 0.4),
      inset 0 2px 8px rgba(255, 255, 255, 0.5);
  z-index: 1001;
}

/* 宠物表情 */
.pet-face {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pet-eyes {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.eye {
  width: 8px;
  height: 8px;
  background: #333;
  border-radius: 50%;
  position: relative;
  animation: blink 4s ease-in-out infinite;
}

.eye::before {
  content: '';
  position: absolute;
  top: 1px;
  left: 1px;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
}

.pet-mouth {
  width: 12px;
  height: 6px;
  border: 2px solid #333;
  border-top: none;
  border-radius: 0 0 12px 12px;
  background: #ff69b4;
}

/* 拖拽粒子效果 */
.drag-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: particle-float 0.6s ease-out infinite;
}

.particle:nth-child(1) { animation-delay: 0s; top: -20px; left: -10px; }
.particle:nth-child(2) { animation-delay: 0.1s; top: -15px; left: 10px; }
.particle:nth-child(3) { animation-delay: 0.2s; top: -25px; left: 0px; }
.particle:nth-child(4) { animation-delay: 0.3s; top: -10px; left: -15px; }
.particle:nth-child(5) { animation-delay: 0.4s; top: -30px; left: 5px; }
.particle:nth-child(6) { animation-delay: 0.5s; top: -20px; left: 15px; }

/* 动画效果 */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@keyframes particle-float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.5);
  }
}

/* 悬浮时的光晕效果 */
.pet-box.hovering::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4ecdc4);
  border-radius: 50%;
  z-index: -1;
  opacity: 0.3;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .pet-box {
    width: 60px;
    height: 60px;
  }

  .pet-eyes {
    gap: 8px;
  }

  .eye {
    width: 6px;
    height: 6px;
  }

  .pet-mouth {
    width: 8px;
    height: 4px;
  }
}
</style>