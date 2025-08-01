<template>
  <div id="app">
    <div class="vintage-frame">
      <div class="machine-header">
        <h1 class="title">MORSE TELEGRAPH</h1>
        <div class="subtitle">Model MT-2025 Vue Edition</div>
      </div>

      <div class="instructions">
        操作说明：短按发送点信号(·) | 长按发送划信号(−) | 自动识别有效摩斯密码组合 | 记录所有输入历史
      </div>

      <!-- 字母指示灯区域 - 放在最上方 -->
      <div class="bulbs-section">
        <h3 class="section-title">字母指示灯</h3>
        <div class="bulbs-container">
          <div class="bulb" v-for="item in morseMap" :key="item.letter">
            <div
                class="bulb-light"
                :class="{ active: activeBulbs.includes(item.letter) }"
            ></div>
            <div class="bulb-letter">{{ item.letter }}</div>
            <div class="morse-pattern">{{ item.morse }}</div>
          </div>
        </div>
      </div>

      <!-- 三列布局区域 -->
      <div class="machine-body">
        <!-- 左侧面板：输入控制 -->
        <div class="panel">
          <h3 class="panel-title">输入控制</h3>
          <div class="input-section">
            <input
                v-model="textInput"
                class="input-field"
                placeholder="输入文字转摩斯码"
                type="text"
            >
            <input
                v-model="morseInput"
                class="input-field"
                placeholder="输入摩斯码转文字"
                type="text"
            >
          </div>
          <div class="control-buttons">
            <button class="control-btn" @click="encodeToMorse">文字→摩斯</button>
            <button class="control-btn" @click="decodeFromMorse">摩斯→文字</button>
            <button class="control-btn" @click="clearAll">重置清空</button>
            <button
                class="control-btn"
                @click="playMorseSequence"
                :disabled="isPlaying || !morseInput"
            >
              {{ isPlaying ? '播放中...' : '播放序列' }}
            </button>
          </div>
        </div>

        <!-- 中间面板：主操作区 -->
        <div class="center-panel">
          <div class="status-lights">
            <div class="status-light power"></div>
            <div class="status-light" :class="{ transmit: isPressed || isPlaying }"></div>
          </div>

          <!-- 播放进度条 -->
          <div class="progress-container" :class="{ hidden: !isPlaying }">
            <div class="progress-bar" :style="{ width: playProgress + '%' }"></div>
            <div class="progress-text" v-if="isPlaying">
              播放进度: {{ Math.round(playProgress) }}% ({{ currentPlayIndex + 1 }}/{{ totalPlaySteps }})
            </div>
          </div>

          <button
              class="morse-button"
              :class="{ pressed: isPressed }"
              @mousedown="startPress"
              @mouseup="endPress"
              @mouseleave="endPress"
              @touchstart="startPress"
              @touchend="endPress"
              :disabled="isPlaying"
          >
            <div>电报按键</div>
            <div class="button-indicator"></div>
            <div>{{ isPressed ? (isLongPress ? '划' : '点') : '待机' }}</div>
          </button>

          <div class="current-sequence">
            {{ isPlaying && currentPlayingLetter ? `当前: ${currentPlayingLetter} | ${currentSequence}` : `当前序列: ${currentSequence}` }}
          </div>

          <div class="sequence-feedback" :class="feedbackClass">
            {{ feedbackText }}
          </div>
        </div>

        <!-- 右侧面板：输入记录 -->
        <div class="panel">
          <h3 class="panel-title">输入记录 ({{ inputRecords.length }})</h3>
          <div class="record-section">
            <div v-if="inputRecords.length === 0" class="no-records">
              暂无记录
            </div>
            <div
                v-for="(record, index) in inputRecords"
                :key="record.id"
                class="record-item"
            >
              <div class="record-header">
                <span>#{{ inputRecords.length - index }}</span>
                <span>{{ formatTime(record.timestamp) }}</span>
              </div>
              <div class="record-content">
                <div class="record-pair">
                  <span class="morse-code">{{ record.morse }}</span>
                  <span class="arrow">→</span>
                  <span class="letter">{{ record.letter || '无匹配' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 类型定义
interface MorseItem {
  letter: string
  morse: string
}

interface InputRecord {
  id: number
  timestamp: number
  morse: string
  letter: string
}

// 摩斯密码映射表
const morseMap: MorseItem[] = [
  { letter: 'A', morse: '·−' }, { letter: 'B', morse: '−···' }, { letter: 'C', morse: '−·−·' },
  { letter: 'D', morse: '−··' }, { letter: 'E', morse: '·' }, { letter: 'F', morse: '··−·' },
  { letter: 'G', morse: '−−·' }, { letter: 'H', morse: '····' }, { letter: 'I', morse: '··' },
  { letter: 'J', morse: '·−−−' }, { letter: 'K', morse: '−·−' }, { letter: 'L', morse: '·−··' },
  { letter: 'M', morse: '−−' }, { letter: 'N', morse: '−·' }, { letter: 'O', morse: '−−−' },
  { letter: 'P', morse: '·−−·' }, { letter: 'Q', morse: '−−·−' }, { letter: 'R', morse: '·−·' },
  { letter: 'S', morse: '···' }, { letter: 'T', morse: '−' }, { letter: 'U', morse: '··−' },
  { letter: 'V', morse: '···−' }, { letter: 'W', morse: '·−−' }, { letter: 'X', morse: '−··−' },
  { letter: 'Y', morse: '−·−−' }, { letter: 'Z', morse: '−−··' }
]

// 响应式数据
const currentSequence = ref<string>('')
const isPressed = ref<boolean>(false)
const isLongPress = ref<boolean>(false)
const activeBulbs = ref<string[]>([])
const textInput = ref<string>('')
const morseInput = ref<string>('')
const inputRecords = ref<InputRecord[]>([])
const isPlaying = ref<boolean>(false)
const playProgress = ref<number>(0)
const currentPlayIndex = ref<number>(0)
const totalPlaySteps = ref<number>(0)
const currentPlayingLetter = ref<string>('')

// 定时器
let pressTimer: ReturnType<typeof setTimeout> | null = null
let inputTimeout: ReturnType<typeof setTimeout> | null = null

// 创建映射对象
const morseToLetter = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  morseMap.forEach(item => {
    map[item.morse] = item.letter
  })
  return map
})

const letterToMorse = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  morseMap.forEach(item => {
    map[item.letter] = item.morse
  })
  return map
})

// 计算属性：反馈信息
const feedbackText = computed<string>(() => {
  if (!currentSequence.value) return ''

  const exactMatch = morseToLetter.value[currentSequence.value]
  if (exactMatch) {
    return `匹配字母: ${exactMatch}`
  }

  const possibleLetters = morseMap
      .filter(item => item.morse.startsWith(currentSequence.value))
      .map(item => item.letter)
      .join(', ')

  if (possibleLetters) {
    return `可能字母: ${possibleLetters}`
  }

  return '无效组合'
})

const feedbackClass = computed<string>(() => {
  if (!currentSequence.value) return ''

  const exactMatch = morseToLetter.value[currentSequence.value]
  if (exactMatch) return 'valid'

  const hasPrefix = morseMap.some(item => item.morse.startsWith(currentSequence.value))
  return hasPrefix ? '' : 'invalid'
})

// 工具函数
const isValidPrefix = (sequence: string): boolean => {
  return morseMap.some(item => item.morse.startsWith(sequence))
}

const resetInputTimeout = (): void => {
  if (inputTimeout) {
    clearTimeout(inputTimeout)
    inputTimeout = null
  }
}

const startInputTimeout = (): void => {
  resetInputTimeout()
  inputTimeout = setTimeout(() => {
    checkAndResetSequence()
  }, 1500)
}

const addInputRecord = (morse: string, letter: string = ''): void => {
  const record: InputRecord = {
    id: Date.now() + Math.random(),
    timestamp: Date.now(),
    morse: morse,
    letter: letter
  }
  inputRecords.value.unshift(record)

  // 限制记录数量
  if (inputRecords.value.length > 50) {
    inputRecords.value = inputRecords.value.slice(0, 50)
  }
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const lightBulb = (letter: string): void => {
  if (!activeBulbs.value.includes(letter)) {
    activeBulbs.value.push(letter)
  }
  setTimeout(() => {
    const index = activeBulbs.value.indexOf(letter)
    if (index > -1) {
      activeBulbs.value.splice(index, 1)
    }
  }, 2000)
}

const checkAndResetSequence = (): void => {
  if (!currentSequence.value) return

  const matchedLetter = morseToLetter.value[currentSequence.value]
  if (matchedLetter) {
    lightBulb(matchedLetter)
    addInputRecord(currentSequence.value, matchedLetter)
  }

  currentSequence.value = ''
}

// 按钮事件处理
const startPress = (event: Event): void => {
  if (isPlaying.value) return

  event.preventDefault()
  isPressed.value = true
  isLongPress.value = false

  pressTimer = setTimeout(() => {
    if (isPressed.value) {
      isLongPress.value = true

      const testSequence = currentSequence.value + '−'
      if (isValidPrefix(testSequence)) {
        currentSequence.value += '−'
        startInputTimeout()
      } else {
        if (navigator.vibrate) {
          navigator.vibrate(100)
        }
      }
    }
  }, 500)
}

const endPress = (event: Event): void => {
  if (isPlaying.value) return

  event.preventDefault()
  if (!isPressed.value) return

  if (pressTimer) {
    clearTimeout(pressTimer)
  }

  if (!isLongPress.value) {
    const testSequence = currentSequence.value + '·'
    if (isValidPrefix(testSequence)) {
      currentSequence.value += '·'
      startInputTimeout()
    } else {
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }
    }
  }

  isPressed.value = false
  isLongPress.value = false
}

// 模拟按钮按下
const simulateButtonPress = async (signal: string): Promise<void> => {
  isPressed.value = true

  if (signal === '·') {
    isLongPress.value = false
    await new Promise<void>(resolve => setTimeout(resolve, 200))
  } else {
    isLongPress.value = true
    await new Promise<void>(resolve => setTimeout(resolve, 600))
  }

  isPressed.value = false
  isLongPress.value = false
  await new Promise<void>(resolve => setTimeout(resolve, 100))
}

// 编码解码函数
const encodeToMorse = (): void => {
  const text = textInput.value.toUpperCase()
  if (!text) return

  const encoded = text.split('').map(char => letterToMorse.value[char] || char).join(' ')
  morseInput.value = encoded

  // 记录编码操作
  addInputRecord(`编码: ${encoded}`, text)

  // 点亮对应字母
  const letters = text.split('').filter(char => letterToMorse.value[char])
  letters.forEach((letter, index) => {
    setTimeout(() => lightBulb(letter), index * 300)
  })
}

const decodeFromMorse = (): void => {
  const morse = morseInput.value.trim()
  if (!morse) return

  const decoded = morse.split(' ').map(code => morseToLetter.value[code] || code).join('')
  textInput.value = decoded

  // 记录解码操作
  addInputRecord(`解码: ${morse}`, decoded)

  // 点亮对应字母
  const letters = decoded.split('')
  letters.forEach((letter, index) => {
    setTimeout(() => lightBulb(letter), index * 300)
  })
}

const clearAll = (): void => {
  textInput.value = ''
  morseInput.value = ''
  currentSequence.value = ''
  activeBulbs.value = []
  currentPlayingLetter.value = ''
  resetInputTimeout()

  addInputRecord('系统清空', '')
}

// 播放摩斯序列
const playMorseSequence = async (): Promise<void> => {
  const morse = morseInput.value.trim()
  if (!morse || isPlaying.value) return

  isPlaying.value = true
  playProgress.value = 0
  currentPlayIndex.value = 0

  const sequences = morse.split(' ').filter(seq => seq.trim())
  totalPlaySteps.value = sequences.reduce((total, seq) => total + seq.length, 0)

  let stepCount = 0

  try {
    for (let i = 0; i < sequences.length; i++) {
      const sequence = sequences[i]
      const letter = morseToLetter.value[sequence]

      if (letter) {
        currentPlayingLetter.value = letter
        lightBulb(letter)

        // 播放每个信号
        for (const signal of sequence) {
          currentSequence.value = sequence.substring(0, sequence.indexOf(signal) + 1)
          await simulateButtonPress(signal)
          stepCount++
          currentPlayIndex.value = stepCount
          playProgress.value = (stepCount / totalPlaySteps.value) * 100
        }

        // 字母间隔
        if (i < sequences.length - 1) {
          await new Promise<void>(resolve => setTimeout(resolve, 500))
        }
      }
    }

    // 记录播放操作
    const decodedText = sequences.map(seq => morseToLetter.value[seq] || '?').join('')
    addInputRecord(`播放: ${morse}`, decodedText)

  } catch (error) {
    console.error('播放过程中发生错误:', error)
  } finally {
    // 播放完成，重置状态
    setTimeout(() => {
      isPlaying.value = false
      playProgress.value = 0
      currentPlayIndex.value = 0
      totalPlaySteps.value = 0
      currentPlayingLetter.value = ''
      currentSequence.value = ''
    }, 500)
  }
}

// 生命周期
onMounted(() => {
  // 防止触摸时页面滚动
  const handleTouchStart = (e: TouchEvent): void => {
    if ((e.target as Element)?.closest('.morse-button')) {
      e.preventDefault()
    }
  }

  document.addEventListener('touchstart', handleTouchStart, { passive: false })

  // 添加初始记录
  addInputRecord('系统启动', '摩斯密码机已就绪')
})

onUnmounted(() => {
  if (pressTimer) clearTimeout(pressTimer)
  if (inputTimeout) clearTimeout(inputTimeout)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  background:
      radial-gradient(circle at 20% 20%, rgba(30, 60, 114, 0.8) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(42, 82, 152, 0.8) 0%, transparent 50%),
      linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
  font-family: 'Monaco', 'Courier New', monospace;
  color: #ffffff;
  padding: 20px;
  overflow-x: hidden;
}

.vintage-frame {
  max-width: 1400px;
  margin: 0 auto;
  background:
      linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);
  border: 4px solid #444;
  border-radius: 20px;
  padding: 30px;
  box-shadow:
      0 0 50px rgba(0, 245, 255, 0.1),
      inset 0 0 30px rgba(0, 0, 0, 0.5);
  position: relative;
}

.vintage-frame::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00f5ff, #0099ff, #667eea, #764ba2);
  border-radius: 22px;
  z-index: -1;
  opacity: 0.3;
  filter: blur(3px);
}

.machine-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 3rem;
  background: linear-gradient(45deg, #00f5ff, #ffffff, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 245, 255, 0.5);
  margin-bottom: 10px;
  font-weight: bold;
  letter-spacing: 3px;
}

.subtitle {
  color: #aaa;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.instructions {
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  margin-bottom: 30px;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* 字母灯泡区域 - 最上方 */
.bulbs-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.section-title {
  color: #00f5ff;
  font-size: 1.1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.bulbs-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 12px;
}

.bulb {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.bulb-light {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background:
      radial-gradient(circle at 30% 30%, #444, #222),
      linear-gradient(145deg, #333, #111);
  position: relative;
  margin-bottom: 6px;
  transition: all 0.3s ease;
  border: 2px solid #555;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
}

.bulb-light.active {
  background:
      radial-gradient(circle at 30% 30%, #ffeb3b, #ffc107),
      linear-gradient(145deg, #fff176, #ffb300);
  border-color: #ff9800;
  box-shadow:
      0 0 20px rgba(255, 235, 59, 0.9),
      0 0 40px rgba(255, 235, 59, 0.5),
      inset 0 0 10px rgba(255, 193, 7, 0.3);
  animation: bulb-glow 2s infinite alternate;
}

@keyframes bulb-glow {
  0% {
    box-shadow:
        0 0 20px rgba(255, 235, 59, 0.9),
        0 0 40px rgba(255, 235, 59, 0.5);
  }
  100% {
    box-shadow:
        0 0 30px rgba(255, 235, 59, 1),
        0 0 60px rgba(255, 235, 59, 0.7);
  }
}

.bulb-light::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), transparent);
}

.bulb-letter {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 2px;
}

.morse-pattern {
  font-size: 0.6rem;
  color: #888;
  font-family: 'Courier New', monospace;
}

/* 三列布局 */
.machine-body {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 30px;
  align-items: start;
}

.panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.panel-title {
  margin-bottom: 15px;
  color: #00f5ff;
  font-size: 1.1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 中间面板 */
.center-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.status-lights {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.status-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #333;
  border: 1px solid #555;
  transition: all 0.3s ease;
}

.status-light.power {
  background: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
}

.status-light.transmit {
  background: #ff9800;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.6);
}

.progress-container {
  width: 100%;
  height: 12px;
  background: #222;
  border-radius: 6px;
  border: 2px solid #444;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.progress-container.hidden {
  opacity: 0;
  transform: scaleY(0);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #00f5ff, #00d4ff, #0099ff);
  border-radius: 4px;
  position: relative;
  transition: width 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.8);
}

.progress-text {
  text-align: center;
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 5px;
}

.morse-button {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background:
      radial-gradient(circle at 30% 30%, #555, #333),
      linear-gradient(145deg, #444 0%, #222 100%);
  border: 6px solid #666;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  box-shadow:
      0 15px 30px rgba(0, 0, 0, 0.5),
      inset 0 -3px 6px rgba(0, 0, 0, 0.3),
      inset 0 3px 6px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.morse-button:active,
.morse-button.pressed {
  transform: scale(0.95) translateY(3px);
  background:
      radial-gradient(circle at 30% 30%, #ff6b6b, #ee5a24),
      linear-gradient(145deg, #ff4757 0%, #c44569 100%);
  border-color: #ff3838;
  box-shadow:
      0 8px 15px rgba(0, 0, 0, 0.6),
      inset 0 3px 6px rgba(0, 0, 0, 0.4),
      0 0 25px rgba(255, 107, 107, 0.6);
}

.button-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #333;
  border: 2px solid #555;
  transition: all 0.2s ease;
}

.morse-button.pressed .button-indicator {
  background: #ff6b6b;
  border-color: #ff3838;
  box-shadow: 0 0 15px rgba(255, 107, 107, 0.8);
}

.current-sequence {
  font-size: 1.5rem;
  min-height: 50px;
  text-align: center;
  letter-spacing: 4px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 10px;
  font-family: 'Courier New', monospace;
  margin: 20px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sequence-feedback {
  font-size: 1rem;
  text-align: center;
  min-height: 30px;
  color: #aaa;
  margin-bottom: 20px;
}

.sequence-feedback.valid {
  color: #4CAF50;
}

.sequence-feedback.invalid {
  color: #f44336;
}

/* 输入控制面板 */
.input-section {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-field {
  padding: 12px 15px;
  border: 2px solid rgba(0, 245, 255, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 0.9rem;
  font-family: 'Courier New', monospace;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #00f5ff;
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.4);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.control-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.control-btn {
  padding: 10px 15px;
  border: 2px solid rgba(0, 245, 255, 0.3);
  border-radius: 6px;
  background: rgba(0, 245, 255, 0.1);
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-btn:hover {
  background: rgba(0, 245, 255, 0.2);
  border-color: #00f5ff;
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.3);
  transform: translateY(-2px);
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 记录面板 */
.record-section {
  max-height: 400px;
  overflow-y: auto;
}

.no-records {
  text-align: center;
  color: #666;
  margin: 20px 0;
  font-style: italic;
}

.record-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.record-item:hover {
  border-color: rgba(0, 245, 255, 0.4);
  background: rgba(0, 0, 0, 0.4);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.8rem;
  color: #aaa;
}

.record-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-pair {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Courier New', monospace;
}

.morse-code {
  background: rgba(0, 245, 255, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(0, 245, 255, 0.3);
  color: #00f5ff;
  font-size: 0.9rem;
  letter-spacing: 2px;
  min-width: 80px;
  text-align: center;
}

.arrow {
  color: #888;
  font-size: 1.2rem;
}

.letter {
  background: rgba(76, 175, 80, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: #4CAF50;
  font-size: 1rem;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .machine-body {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .title {
    font-size: 2rem;
  }

  .morse-button {
    width: 150px;
    height: 150px;
  }

  .bulbs-container {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 8px;
  }

  .bulb-light {
    width: 35px;
    height: 35px;
  }

  .record-pair {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .morse-code,
  .letter {
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  .control-buttons {
    grid-template-columns: 1fr;
  }

  .current-sequence {
    font-size: 1.2rem;
  }

  .bulbs-container {
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    gap: 6px;
  }

  .bulb-light {
    width: 30px;
    height: 30px;
  }

  .bulb-letter {
    font-size: 0.8rem;
  }

  .morse-pattern {
    font-size: 0.5rem;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 245, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 245, 255, 0.5);
}
</style>