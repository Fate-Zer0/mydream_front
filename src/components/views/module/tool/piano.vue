<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 select-none">
    <!-- 标题栏 -->
    <div class="text-center mb-8">
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
        🎹 交互式钢琴
      </h1>
      <div class="text-xl text-purple-200 mb-4">
        当前音符: <span class="font-mono text-yellow-300">{{ currentNotes.join(', ') || '无' }}</span>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="max-w-6xl mx-auto mb-6">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
        <div class="flex flex-wrap gap-4 justify-center items-center">
          <!-- 录制控制 -->
          <button
              @click="toggleRecording"
              :class="[
              'px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg',
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-green-500 hover:bg-green-600'
            ]"
          >
            {{ isRecording ? '🔴 停止录制' : '🎤 开始录制' }}
          </button>

          <!-- 播放控制 -->
          <button
              @click="playRecording"
              :disabled="recordedNotes.length === 0 || isPlaying"
              class="px-6 py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
          >
            {{ isPlaying ? '▶️ 播放中...' : '▶️ 播放录音' }}
          </button>

          <!-- 清空录音 -->
          <button
              @click="clearRecording"
              :disabled="recordedNotes.length === 0"
              class="px-6 py-3 rounded-xl font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
          >
            🗑️ 清空录音
          </button>

          <!-- 键盘映射 -->
          <button
              @click="showKeyboardMap = !showKeyboardMap"
              class="px-6 py-3 rounded-xl font-semibold text-white bg-purple-500 hover:bg-purple-600 transition-all duration-300 shadow-lg"
          >
            {{ showKeyboardMap ? '❌ 隐藏映射' : '🎹 键盘映射' }}
          </button>

          <!-- 节拍器 -->
          <button
              @click="toggleMetronome"
              :class="[
              'px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg',
              metronomeActive
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-gray-600 hover:bg-gray-700'
            ]"
          >
            {{ metronomeActive ? '🥁 节拍器开' : '🥁 节拍器关' }}
          </button>
        </div>

        <!-- 文件操作 -->
        <div class="flex flex-wrap gap-4 justify-center items-center mt-4">
          <button
              @click="downloadRecording"
              :disabled="recordedNotes.length === 0"
              class="px-4 py-2 rounded-lg font-medium text-white bg-teal-500 hover:bg-teal-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300"
          >
            📥 下载录音
          </button>

          <label class="px-4 py-2 rounded-lg font-medium text-white bg-indigo-500 hover:bg-indigo-600 cursor-pointer transition-all duration-300">
            📤 上传录音
            <input
                type="file"
                accept=".json"
                @change="uploadRecording"
                class="hidden"
            >
          </label>

          <div class="text-sm text-purple-200">
            已录制: {{ recordedNotes.length }} 个音符
          </div>
        </div>
      </div>
    </div>

    <!-- 键盘映射提示 -->
    <div v-if="showKeyboardMap" class="max-w-4xl mx-auto mb-6">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4 text-center">键盘映射表</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-sm">
          <div v-for="(mapping, index) in keyboardMappings" :key="index"
               class="bg-white/20 rounded-lg p-2 text-center text-white">
            <div class="font-mono text-lg">{{ mapping.key }}</div>
            <div class="text-xs">{{ mapping.note }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 钢琴键盘 -->
    <div class="max-w-6xl mx-auto">
      <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <div class="piano-container relative mx-auto" style="width: fit-content;">
          <!-- 白键 -->
          <div class="flex">
            <div
                v-for="note in whiteKeys"
                :key="note.id"
                :class="[
                'piano-key white-key',
                'w-12 md:w-16 h-32 md:h-48 bg-white border-2 border-gray-300 rounded-b-lg shadow-lg',
                'cursor-pointer select-none transition-all duration-150',
                'hover:bg-gray-100 active:bg-gray-200',
                pressedKeys.has(note.id) ? 'bg-yellow-200 transform translate-y-1 shadow-inner' : ''
              ]"
                @mousedown="startDrag(note, $event)"
                @mouseenter="handleDragOver(note)"
                @touchstart="handleTouchStart(note, $event)"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
            >
              <div class="h-full flex items-end justify-center pb-4">
                <span class="text-xs md:text-sm font-semibold text-gray-700">
                  {{ note.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- 黑键 -->
          <div class="absolute top-0 left-0 flex">
            <div
                v-for="note in blackKeys"
                :key="note.id"
                :class="[
                'piano-key black-key',
                'w-8 md:w-10 h-20 md:h-32 bg-gray-800 rounded-b-lg shadow-lg',
                'cursor-pointer select-none transition-all duration-150',
                'hover:bg-gray-700 active:bg-gray-600',
                'flex items-end justify-center pb-2',
                pressedKeys.has(note.id) ? 'bg-yellow-600 transform translate-y-1 shadow-inner' : ''
              ]"
                :style="{ left: note.position + 'px' }"
                @mousedown="startDrag(note, $event)"
                @mouseenter="handleDragOver(note)"
                @touchstart="handleTouchStart(note, $event)"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
            >
              <span class="text-xs font-semibold text-white">
                {{ note.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="max-w-4xl mx-auto mt-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl text-white">
        <h3 class="text-xl font-bold mb-4 text-center">使用说明</h3>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 class="font-semibold mb-2">🖱️ 鼠标操作:</h4>
            <ul class="space-y-1 text-purple-200">
              <li>• 点击琴键播放音符</li>
              <li>• 按住并滑动可连续播放</li>
              <li>• 支持同时点击多个键</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-2">⌨️ 键盘操作:</h4>
            <ul class="space-y-1 text-purple-200">
              <li>• A-L键对应白键C4-E5</li>
              <li>• W,E,T,Y,U键对应黑键</li>
              <li>• 支持同时按多个键</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePianoAudio } from '../../../ts/process/tool/piano/usePianoAudio'
import { useRecording } from '../../../ts/process/tool/piano/useRecording'
import { useKeyboardHandler } from '../../../ts/process/tool/piano/useKeyboardHandler'

// 定义音符类型
interface PianoNote {
  id: string
  name: string
  frequency: number
  position?: number // 黑键的位置
  keyBinding?: string
}

// 响应式状态
const showKeyboardMap = ref(false)
const pressedKeys = ref(new Set<string>())
const currentNotes = ref<string[]>([])
const isDragging = ref(false)
const draggedNotes = ref(new Set<string>())
const metronomeActive = ref(false)

// 使用 composables
const { playNote, stopNote } = usePianoAudio()
const {
  isRecording,
  recordedNotes,
  isPlaying,
  startRecording,
  stopRecording,
  playRecording,
  clearRecording,
  downloadRecording,
  uploadRecording: uploadRec
} = useRecording()

// 定义钢琴键（C4到C6，25个键）
const notes: PianoNote[] = [
  // C4 八度
  { id: 'C4', name: 'C4', frequency: 261.63, keyBinding: 'a' },
  { id: 'C#4', name: 'C#4', frequency: 277.18, keyBinding: 'w' },
  { id: 'D4', name: 'D4', frequency: 293.66, keyBinding: 's' },
  { id: 'D#4', name: 'D#4', frequency: 311.13, keyBinding: 'e' },
  { id: 'E4', name: 'E4', frequency: 329.63, keyBinding: 'd' },
  { id: 'F4', name: 'F4', frequency: 349.23, keyBinding: 'f' },
  { id: 'F#4', name: 'F#4', frequency: 369.99, keyBinding: 't' },
  { id: 'G4', name: 'G4', frequency: 392.00, keyBinding: 'g' },
  { id: 'G#4', name: 'G#4', frequency: 415.30, keyBinding: 'y' },
  { id: 'A4', name: 'A4', frequency: 440.00, keyBinding: 'h' },
  { id: 'A#4', name: 'A#4', frequency: 466.16, keyBinding: 'u' },
  { id: 'B4', name: 'B4', frequency: 493.88, keyBinding: 'j' },

  // C5 八度
  { id: 'C5', name: 'C5', frequency: 523.25, keyBinding: 'k' },
  { id: 'C#5', name: 'C#5', frequency: 554.37, keyBinding: 'o' },
  { id: 'D5', name: 'D5', frequency: 587.33, keyBinding: 'l' },
  { id: 'D#5', name: 'D#5', frequency: 622.25, keyBinding: 'p' },
  { id: 'E5', name: 'E5', frequency: 659.25, keyBinding: ';' },
  { id: 'F5', name: 'F5', frequency: 698.46, keyBinding: '\'' },
  { id: 'F#5', name: 'F#5', frequency: 739.99 },
  { id: 'G5', name: 'G5', frequency: 783.99 },
  { id: 'G#5', name: 'G#5', frequency: 830.61 },
  { id: 'A5', name: 'A5', frequency: 880.00 },
  { id: 'A#5', name: 'A#5', frequency: 932.33 },
  { id: 'B5', name: 'B5', frequency: 987.77 },
  { id: 'C6', name: 'C6', frequency: 1046.50 }
]

// 计算白键和黑键
const whiteKeys = computed(() => notes.filter(note => !note.name.includes('#')))
const blackKeys = computed(() => {
  const blacks = notes.filter(note => note.name.includes('#'))
  const whiteKeyWidth = window.innerWidth > 768 ? 64 : 48 // md:w-16 : w-12

  // 黑键位置映射（基于白键位置）
  const positions = [
    whiteKeyWidth * 0.75,     // C#4
    whiteKeyWidth * 1.75,     // D#4
    whiteKeyWidth * 3.75,     // F#4
    whiteKeyWidth * 4.75,     // G#4
    whiteKeyWidth * 5.75,     // A#4
    whiteKeyWidth * 7.75,     // C#5
    whiteKeyWidth * 8.75,     // D#5
  ]

  return blacks.map((note, index) => ({
    ...note,
    position: positions[index] || 0
  })).filter(note => note.position !== undefined)
})

// 键盘映射表
const keyboardMappings = computed(() =>
    notes.filter(note => note.keyBinding).map(note => ({
      key: note.keyBinding!.toUpperCase(),
      note: note.name
    }))
)

// 播放音符
const handlePlayNote = (note: PianoNote, recordable = true) => {
  if (pressedKeys.value.has(note.id)) return

  pressedKeys.value.add(note.id)
  currentNotes.value.push(note.name)
  playNote(note.frequency)

  if (recordable && isRecording.value) {
    // 记录到录音中
  }
}

// 停止音符
const handleStopNote = (note: PianoNote) => {
  pressedKeys.value.delete(note.id)
  const index = currentNotes.value.indexOf(note.name)
  if (index > -1) {
    currentNotes.value.splice(index, 1)
  }
  stopNote(note.frequency)
}

// 鼠标拖拽处理
const startDrag = (note: PianoNote, event: MouseEvent) => {
  event.preventDefault()
  isDragging.value = true
  draggedNotes.value.clear()
  handlePlayNote(note)
  draggedNotes.value.add(note.id)
}

const handleDragOver = (note: PianoNote) => {
  if (isDragging.value && !draggedNotes.value.has(note.id)) {
    handlePlayNote(note)
    draggedNotes.value.add(note.id)
  }
}

const endDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    // 停止所有拖拽过程中播放的音符
    draggedNotes.value.forEach(noteId => {
      const note = notes.find(n => n.id === noteId)
      if (note) handleStopNote(note)
    })
    draggedNotes.value.clear()
  }
}

// 触控处理
const handleTouchStart = (note: PianoNote, event: TouchEvent) => {
  event.preventDefault()
  handlePlayNote(note)
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  const touch = event.touches[0]
  const element = document.elementFromPoint(touch.clientX, touch.clientY)
  const noteElement = element?.closest('.piano-key')
  if (noteElement) {
    const noteId = Array.from(notes).find(note =>
        noteElement.textContent?.includes(note.name)
    )?.id
    if (noteId && !draggedNotes.value.has(noteId)) {
      const note = notes.find(n => n.id === noteId)
      if (note) {
        handlePlayNote(note)
        draggedNotes.value.add(noteId)
      }
    }
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  event.preventDefault()
  // 延迟停止音符，给予更好的触控体验
  setTimeout(() => {
    draggedNotes.value.forEach(noteId => {
      const note = notes.find(n => n.id === noteId)
      if (note) handleStopNote(note)
    })
    draggedNotes.value.clear()
  }, 100)
}

// 录制控制
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

// 节拍器
const toggleMetronome = () => {
  metronomeActive.value = !metronomeActive.value
  // 这里可以添加节拍器逻辑
}

// 文件上传
const uploadRecording = (event: Event) => {
  uploadRec(event)
}

// 键盘处理
const { handleKeyDown, handleKeyUp } = useKeyboardHandler(
    notes,
    handlePlayNote,
    handleStopNote
)

// 生命周期
onMounted(() => {
  // 添加全局事件监听
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('mouseleave', endDrag)
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('mouseleave', endDrag)
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
.piano-container {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.piano-key {
  touch-action: none;
}

.white-key {
  z-index: 1;
}

.black-key {
  position: absolute;
  z-index: 2;
}

/* 防止文本选择 */
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 键盘按下时的额外样式 */
.keyboard-pressed {
  background: linear-gradient(135deg, #ffd700, #ffed4e) !important;
  transform: translateY(2px) !important;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6) !important;
}

.black-key.keyboard-pressed {
  background: linear-gradient(135deg, #ff6b35, #f7931e) !important;
}

/* 钢琴键动画效果 */
.piano-key {
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.piano-key:active {
  transform: translateY(2px);
}

.white-key:hover {
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
  transform: translateY(-1px);
}

.black-key:hover {
  background: linear-gradient(to bottom, #495057, #343a40);
  transform: translateY(-1px);
}

/* 录制指示器动画 */
@keyframes pulse-recording {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.animate-pulse {
  animation: pulse-recording 1.5s ease-in-out infinite;
}

/* 按钮悬停效果 */
button {
  transform: translateY(0);
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .piano-key {
    font-size: 0.75rem;
  }

  .white-key {
    height: 8rem !important;
  }

  .black-key {
    height: 5rem !important;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>