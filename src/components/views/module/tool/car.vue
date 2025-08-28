<template>
  <div class="racing-game">
    <div ref="gameContainer" class="game-container">
      <div v-if="loading" class="loading">
        🏎️ 游戏加载中...
      </div>

      <div v-if="!loading" class="ui-overlay">
        <div class="game-info">
          <div class="info-item">
            <span class="label">⏱️ 时间:</span>
            <span class="value">{{ Math.floor(gameTime) }}s</span>
          </div>
          <div class="info-item">
            <span class="label">🏁 圈数:</span>
            <span class="value">{{ lapCount }}/3</span>
          </div>
        </div>
      </div>

      <div v-if="!loading" class="speed-meter">
        <div class="speed-display">
          <div class="speed-number">{{ Math.floor(carSpeed) }}</div>
          <div class="speed-unit">km/h</div>
        </div>
        <div class="speed-bar">
          <div
              class="speed-fill"
              :style="{ width: Math.min(carSpeed / 2, 100) + '%' }"
          ></div>
        </div>
      </div>

      <div v-if="!loading" class="controls-info">
        <div class="controls-title">🎮 控制说明</div>
        <div class="controls-list">
          <div class="control-item">
            <kbd>W</kbd><kbd>↑</kbd> 加速
          </div>
          <div class="control-item">
            <kbd>S</kbd><kbd>↓</kbd> 减速/倒车
          </div>
          <div class="control-item">
            <kbd>A</kbd><kbd>←</kbd> 左转
          </div>
          <div class="control-item">
            <kbd>D</kbd><kbd>→</kbd> 右转
          </div>
          <div class="control-item">
            <kbd>Space</kbd> 手刹
          </div>
        </div>
      </div>

      <!-- 完成比赛提示 -->
      <div v-if="raceCompleted" class="race-complete-modal">
        <div class="modal-content">
          <h2>🏆 恭喜完成比赛！</h2>
          <p>用时: {{ Math.floor(gameTime) }} 秒</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// ========= 响应式数据 =========
const gameContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
const gameTime = ref(0)
const lapCount = ref(0)
const carSpeed = ref(0)
const raceCompleted = ref(false)

// ========= Three.js =========
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let car: THREE.Group
let track: THREE.Mesh

// ========= 游戏状态 =========
const keys: { [key: string]: boolean } = {}
let carVelocity = new THREE.Vector3()
let carRotationSpeed = 0
let startTime = Date.now()
let checkpoints: Array<{ position: THREE.Vector3; passed: boolean }> = []
let lastCheckpoint = -1

// ========= 配置 =========
const config = {
  carSpeed: 0.02,
  carRotationSpeed: 0.003,
  friction: 0.95,
  rotationFriction: 0.9
}

// ========= 联机部分 =========
let socket: WebSocket
const playerId = ref<string>("")
interface Player {
  id: string
  car: THREE.Group
  position: THREE.Vector3
  rotation: number
  speed: number
}
const players: Record<string, Player> = {} // 其他玩家

// 初始化 Three.js
const initThree = (): void => {
  if (!gameContainer.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB)

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 25, 15)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  gameContainer.value.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(20, 30, 10)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  createTrack()
  car = createCarModel(0xff0000) // 自己的小车是红色
  car.position.set(10, 0, 0)
  scene.add(car)

  createCheckpoints()

  loading.value = false
}

// 创建赛道
const createTrack = (): void => {
  const trackGroup = new THREE.Group()
  const trackGeometry = new THREE.RingGeometry(0, 20, 32)
  const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x333333, transparent: true, opacity: 0.8 })
  track = new THREE.Mesh(trackGeometry, trackMaterial)
  track.rotation.x = -Math.PI / 2
  track.receiveShadow = true
  trackGroup.add(track)

  const grassGeometry = new THREE.CircleGeometry(30, 32)
  const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 })
  const grass = new THREE.Mesh(grassGeometry, grassMaterial)
  grass.rotation.x = -Math.PI / 2
  grass.position.y = -0.01
  grass.receiveShadow = true
  trackGroup.add(grass)

  scene.add(trackGroup)
}

// 创建小车模型（可用于自己和其他玩家）
const createCarModel = (color = 0xff0000): THREE.Group => {
  const carGroup = new THREE.Group()
  const bodyGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.8)
  const bodyMaterial = new THREE.MeshLambertMaterial({ color })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.25
  carGroup.add(body)
  return carGroup
}

// 检查点
const createCheckpoints = (): void => {
  checkpoints = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    checkpoints.push({
      position: new THREE.Vector3(Math.cos(angle) * 10, 0, Math.sin(angle) * 10),
      passed: false
    })
  }
}

// ========= 键盘控制 =========
const handleKeyDown = (event: KeyboardEvent): void => {
  keys[event.code] = true
}
const handleKeyUp = (event: KeyboardEvent): void => {
  keys[event.code] = false
}

// ========= 更新小车 =========
const updateCar = (): void => {
  const acceleration = new THREE.Vector3()

  if (keys['KeyW'] || keys['ArrowUp']) acceleration.x = config.carSpeed
  if (keys['KeyS'] || keys['ArrowDown']) acceleration.x = -config.carSpeed * 0.7
  if (keys['KeyA'] || keys['ArrowLeft']) carRotationSpeed += config.carRotationSpeed
  if (keys['KeyD'] || keys['ArrowRight']) carRotationSpeed -= config.carRotationSpeed
  if (keys['Space']) { carVelocity.multiplyScalar(0.9); carRotationSpeed *= 0.8 }

  car.rotation.y += carRotationSpeed
  carRotationSpeed *= config.rotationFriction

  const forward = new THREE.Vector3(1, 0, 0).applyQuaternion(car.quaternion).multiplyScalar(acceleration.x)
  carVelocity.add(forward)
  carVelocity.multiplyScalar(config.friction)
  car.position.add(carVelocity)

  const distanceFromCenter = car.position.length()
  if (distanceFromCenter > 20 || distanceFromCenter < 0) {
    carVelocity.multiplyScalar(-0.25)
    car.position.add(carVelocity)
  }

  carSpeed.value = carVelocity.length() * 300
  checkLapProgress()

  // === 把自己位置发给服务器 ===
  sendPlayerState()
}

// 检查圈数
const checkLapProgress = (): void => {
  checkpoints.forEach((checkpoint, index) => {
    if (car.position.distanceTo(checkpoint.position) < 2 && !checkpoint.passed) {
      if (index === (lastCheckpoint + 1) % checkpoints.length) {
        checkpoint.passed = true
        lastCheckpoint = index
        if (index === 0 && lastCheckpoint >= 0) {
          lapCount.value++
          checkpoints.forEach(cp => cp.passed = false)
          lastCheckpoint = 0
          checkpoints[0].passed = true
          if (lapCount.value >= 3) raceCompleted.value = true
        }
      }
    }
  })
}

// 更新相机
const updateCamera = (): void => {
  const offset = new THREE.Vector3(0, 25, 15)
  camera.position.lerp(car.position.clone().add(offset), 0.05)
  camera.lookAt(car.position.x, car.position.y + 2, car.position.z)
}

// ========= 游戏循环 =========
const gameLoop = (): void => {
  if (!loading.value && !raceCompleted.value) {
    updateCar()
    updateCamera()

    // 更新远程玩家位置
    Object.values(players).forEach(p => {
      p.car.position.copy(p.position)
      p.car.rotation.y = p.rotation
    })

    gameTime.value = (Date.now() - startTime) / 1000
    renderer.render(scene, camera)
  }
  requestAnimationFrame(gameLoop)
}

// ========= WebSocket =========
const initSocket = () => {
  socket = new WebSocket("ws://localhost:8080")

  socket.onopen = () => console.log("✅ 已连接服务器")
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    handleServerMessage(data)
  }
  socket.onclose = () => console.log("❌ 连接断开")
}

const sendPlayerState = () => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return
  socket.send(JSON.stringify({
    type: "update",
    id: playerId.value,
    x: car.position.x,
    z: car.position.z,
    rotation: car.rotation.y,
    speed: carSpeed.value
  }))
}

const handleServerMessage = (data: any) => {
  switch (data.type) {
    case "welcome":
      playerId.value = data.id
      break
    case "state":
      data.players.forEach((p: any) => {
        if (p.id === playerId.value) return
        if (!players[p.id]) {
          players[p.id] = {
            id: p.id,
            car: createCarModel(0x00ff00),
            position: new THREE.Vector3(),
            rotation: 0,
            speed: 0
          }
          scene.add(players[p.id].car)
        }
        players[p.id].position.set(p.x, 0, p.z)
        players[p.id].rotation = p.rotation
      })
      break
    case "leave":
      if (players[data.id]) {
        scene.remove(players[data.id].car)
        delete players[data.id]
      }
      break
  }
}

// ========= 生命周期 =========
onMounted(() => {
  initThree()
  initSocket()
  gameLoop()

  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('resize', handleResize)
})
const handleResize = (): void => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
</script>
<style scoped>
.racing-game {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.game-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 28px;
  font-weight: bold;
  z-index: 200;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.ui-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.game-info {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  margin-right: 10px;
  min-width: 80px;
}

.value {
  color: #00ff88;
  font-family: 'Courier New', monospace;
}

.speed-meter {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  min-width: 150px;
}

.speed-display {
  text-align: center;
  margin-bottom: 15px;
}

.speed-number {
  font-size: 32px;
  font-weight: bold;
  color: #ff6b6b;
  font-family: 'Courier New', monospace;
  line-height: 1;
}

.speed-unit {
  font-size: 14px;
  color: #ccc;
  margin-top: 5px;
}

.speed-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.speed-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88 0%, #ff6b6b 70%, #ff0000 100%);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.controls-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.controls-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #00ff88;
}

.controls-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

kbd {
  background: #333;
  border: 1px solid #666;
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #fff;
  min-width: 24px;
  text-align: center;
}

.race-complete-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  backdrop-filter: blur(10px);
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.modal-content h2 {
  margin: 0 0 20px 0;
  font-size: 32px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.modal-content p {
  margin: 0 0 30px 0;
  font-size: 18px;
  color: #00ff88;
}

.reset-btn {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.reset-btn:active {
  transform: translateY(0);
}
</style>