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

          <!-- ✅ 录音统计信息 -->
          <div class="text-sm text-purple-200 space-y-1">
            <div>已录制: <span class="font-bold text-yellow-300">{{ recordedNotes.length }}</span> 个事件</div>
            <div v-if="recordedNotes.length > 0" class="text-xs">
              时长: {{ recordingStats.duration }}s | 
              音符: {{ recordingStats.uniqueNotes }} 个
            </div>
          </div>

          <!-- 分享上传按钮 -->
          <button
              @click="showShareDialog = true"
              :disabled="recordedNotes.length === 0"
              class="px-4 py-2 rounded-lg font-medium text-white bg-pink-500 hover:bg-pink-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300"
          >
            🎵 分享录音
          </button>

          <!-- 查看榜单按钮 -->
          <button
              @click="toggleRankingList"
              class="px-4 py-2 rounded-lg font-medium text-white bg-violet-500 hover:bg-violet-600 transition-all duration-300"
          >
            🏆 {{ showRankingList ? '隐藏榜单' : '查看榜单' }}
          </button>
        </div>

        <!-- ✅ 音量控制 -->
        <div class="flex items-center justify-center gap-4 mt-4 text-white">
          <label class="flex items-center gap-2">
            <span class="text-sm font-medium">🔊 音量:</span>
            <input
              type="range"
              min="0"
              max="100"
              :value="currentVolume * 100"
              @input="handleVolumeChange"
              class="w-32 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            >
            <span class="text-sm font-mono w-12">{{ Math.round(currentVolume * 100) }}%</span>
          </label>
          
          <label class="flex items-center gap-2">
            <span class="text-sm font-medium">🥁 BPM:</span>
            <input
              type="number"
              v-model.number="metronomeBPM"
              min="40"
              max="240"
              class="w-20 px-2 py-1 bg-white/20 rounded-lg text-center border border-white/30 focus:outline-none focus:border-white/60"
            >
          </label>
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

    <!-- 音乐榜单 -->
    <div v-if="showRankingList" class="max-w-6xl mx-auto mt-6">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold text-white">🏆 音乐榜单</h3>
          <button
              @click="loadRankingList"
              class="px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
          >
            🔄 刷新
          </button>
        </div>

        <div v-if="isLoadingRanking" class="text-center text-white py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p class="mt-4">加载中...</p>
        </div>

        <div v-else-if="rankingList.length === 0" class="text-center text-purple-200 py-8">
          <p class="text-xl">暂无录音分享</p>
        </div>

        <div v-else class="space-y-3">
          <div
              v-for="(item, index) in rankingList"
              :key="item.recordingId"
              class="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
          >
            <div class="flex items-center gap-4">
              <!-- 排名 -->
              <div class="text-3xl font-bold text-yellow-300 w-12 text-center">
                {{ index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1 }}
              </div>

              <!-- 用户头像 -->
              <div class="w-12 h-12 rounded-full ring-2 ring-white/30 overflow-hidden flex-shrink-0">
                <img
                    :src="item.avatar || '/default-avatar.png'"
                    :alt="item.username"
                    class="w-full h-full object-cover"
                />
              </div>

              <!-- 录音信息 -->
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-semibold text-white truncate">{{ item.recordingName }}</h4>
                <p class="text-sm text-purple-200">
                  by {{ item.username }} • 
                  时长 {{ item.duration }}s • 
                  {{ item.noteCount }} 个音符 • 
                  播放 {{ item.playCount }} 次
                </p>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                    @click="playSharedRecording(item.recordingId)"
                    :disabled="isPlayingShared"
                    class="px-4 py-2 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300"
                >
                  ▶️ 播放
                </button>

                <button
                    @click="toggleLike(item.recordingId, item.isLiked)"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 flex items-center gap-1',
                      item.isLiked
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gray-600 hover:bg-gray-700'
                    ]"
                >
                  {{ item.isLiked ? '❤️' : '🤍' }}
                  <span>{{ item.likeCount }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="max-w-4xl mx-auto mt-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl text-white">
        <h3 class="text-xl font-bold mb-4 text-center">使用说明</h3>
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 class="font-semibold mb-2">🖱️ 鼠标操作:</h4>
            <ul class="space-y-1 text-purple-200">
              <li>• 点击琴键播放音符</li>
              <li>• 按住并滑动可连续播放</li>
              <li>• 支持同时点击多个键</li>
              <li>• 触控屏完全支持</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-2">⌨️ 键盘操作:</h4>
            <ul class="space-y-1 text-purple-200">
              <li>• A-L键对应白键C4-E5</li>
              <li>• W,E,T,Y,U键对应黑键</li>
              <li>• 支持同时按多个键</li>
              <li>• 空格键停止所有音符</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-2">⚡ 快捷键:</h4>
            <ul class="space-y-1 text-purple-200">
              <li>• <kbd class="kbd-style">Ctrl+R</kbd> 开始/停止录制</li>
              <li>• <kbd class="kbd-style">Ctrl+P</kbd> 播放录音</li>
              <li>• <kbd class="kbd-style">Space</kbd> 停止所有音符</li>
              <li>• 调整音量和BPM实时生效</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享对话框 -->
    <div
        v-if="showShareDialog"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="showShareDialog = false"
    >
      <div class="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold text-white mb-4">🎵 分享录音</h3>

        <div class="space-y-4">
          <div>
            <label class="text-white font-medium mb-2 block">录音名称:</label>
            <input
                v-model="shareRecordingName"
                type="text"
                maxlength="50"
                placeholder="给你的作品起个名字..."
                class="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-white/60"
            />
          </div>

          <div>
            <label class="text-white font-medium mb-2 block">是否公开:</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    v-model="shareIsPublic"
                    type="radio"
                    :value="1"
                    class="w-4 h-4"
                />
                <span class="text-white">公开</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    v-model="shareIsPublic"
                    type="radio"
                    :value="0"
                    class="w-4 h-4"
                />
                <span class="text-white">私密</span>
              </label>
            </div>
          </div>

          <div class="text-sm text-purple-200">
            <p>时长: {{ recordingStats.duration }}s</p>
            <p>音符: {{ recordingStats.uniqueNotes }} 个</p>
          </div>

          <div class="flex gap-4">
            <button
                @click="submitShare"
                :disabled="!shareRecordingName.trim() || isUploading"
                class="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300"
            >
              {{ isUploading ? '上传中...' : '✅ 确认分享' }}
            </button>
            <button
                @click="showShareDialog = false"
                class="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-all duration-300"
            >
              ❌ 取消
            </button>
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
import { useUserStore } from '../../../ts/stores/user'
import { useAlertStore } from '../../../ts/stores/alert'
import api from '../../../ts/api/api'
import type { PianoRecordingItem } from '../../../ts/api/module/pianoApi'

const userStore = useUserStore()
const alertStore = useAlertStore()

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

// 分享相关
const showShareDialog = ref(false)
const shareRecordingName = ref('')
const shareIsPublic = ref(1)
const isUploading = ref(false)

// 榜单相关
const showRankingList = ref(false)
const rankingList = ref<PianoRecordingItem[]>([])
const isLoadingRanking = ref(false)
const isPlayingShared = ref(false)

// 使用 composables
const { playNote, stopNote, setVolume, getVolume } = usePianoAudio()
const currentVolume = ref(0.6) // 当前音量
const {
  isRecording,
  recordedNotes,
  isPlaying,
  startRecording,
  stopRecording,
  playRecording,
  clearRecording,
  downloadRecording,
  uploadRecording: uploadRec,
  recordNotePress,
  recordNoteRelease,
  recordingStats
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

  // ✅ 完整的黑键位置映射（基于白键位置，遵循钢琴布局规律）
  // 钢琴黑键模式：C#-D# (跳过) F#-G#-A# (重复)
  const positions: number[] = []
  let whiteKeyIndex = 0
  
  blacks.forEach((note) => {
    const noteName = note.name.replace(/[0-9]/g, '') // 去掉数字，只保留音名
    
    // 根据音名确定位置
    switch (noteName) {
      case 'C#':
        positions.push(whiteKeyWidth * (whiteKeyIndex + 0.75))
        whiteKeyIndex += 2 // C -> D
        break
      case 'D#':
        positions.push(whiteKeyWidth * (whiteKeyIndex + 0.75))
        whiteKeyIndex += 2 // D -> F (跳过E)
        break
      case 'F#':
        positions.push(whiteKeyWidth * (whiteKeyIndex + 0.75))
        whiteKeyIndex += 1 // F -> G
        break
      case 'G#':
        positions.push(whiteKeyWidth * (whiteKeyIndex + 0.75))
        whiteKeyIndex += 1 // G -> A
        break
      case 'A#':
        positions.push(whiteKeyWidth * (whiteKeyIndex + 0.75))
        whiteKeyIndex += 2 // A -> C (下一个八度)
        break
    }
  })

  return blacks.map((note, index) => ({
    ...note,
    position: positions[index] || 0
  }))
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

  // ✅ 连接录制功能
  if (recordable && isRecording.value) {
    recordNotePress(note.id, note.name, note.frequency)
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

  // ✅ 连接录制功能
  if (isRecording.value) {
    recordNoteRelease(note.id)
  }
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

// ✅ 节拍器实现
let metronomeInterval: ReturnType<typeof setInterval> | null = null
const metronomeBPM = ref(120) // 每分钟节拍数
const metronomeAudioContext = ref<AudioContext | null>(null)

const playMetronomeClick = (isAccent = false) => {
  if (!metronomeAudioContext.value) {
    metronomeAudioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  
  const ctx = metronomeAudioContext.value
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  
  // 重音使用较低频率，普通拍使用较高频率
  oscillator.frequency.value = isAccent ? 800 : 1200
  oscillator.type = 'sine'
  
  const now = ctx.currentTime
  gainNode.gain.setValueAtTime(isAccent ? 0.3 : 0.2, now)
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
  
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  
  oscillator.start(now)
  oscillator.stop(now + 0.05)
}

const toggleMetronome = () => {
  metronomeActive.value = !metronomeActive.value
  
  if (metronomeActive.value) {
    // 启动节拍器
    let beatCount = 0
    const intervalTime = 60000 / metronomeBPM.value // 转换为毫秒
    
    // 立即播放第一拍
    playMetronomeClick(true)
    beatCount++
    
    metronomeInterval = setInterval(() => {
      const isAccent = beatCount % 4 === 0 // 每4拍一个重音
      playMetronomeClick(isAccent)
      beatCount++
    }, intervalTime)
    
    console.log(`🥁 节拍器启动 (${metronomeBPM.value} BPM)`)
  } else {
    // 停止节拍器
    if (metronomeInterval) {
      clearInterval(metronomeInterval)
      metronomeInterval = null
    }
    console.log('🥁 节拍器停止')
  }
}

// 文件上传
const uploadRecording = (event: Event) => {
  uploadRec(event)
}

// ✅ 音量调节处理
const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const volume = parseInt(target.value) / 100
  currentVolume.value = volume
  setVolume(volume)
}

// 键盘处理
const { handleKeyDown, handleKeyUp, stopAllNotes: stopAllKeyboardNotes } = useKeyboardHandler(
    notes,
    handlePlayNote,
    handleStopNote
)

// ✅ 扩展键盘处理 - 添加快捷键
const extendedKeyDown = (event: KeyboardEvent) => {
  // 空格键：停止所有音符
  if (event.code === 'Space' && !event.ctrlKey) {
    event.preventDefault()
    stopAllKeyboardNotes()
    return
  }
  
  // Ctrl/Cmd + R: 开始/停止录制
  if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
    event.preventDefault()
    toggleRecording()
    return
  }
  
  // Ctrl/Cmd + P: 播放录音
  if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
    event.preventDefault()
    if (recordedNotes.value.length > 0 && !isPlaying.value) {
      playRecording()
    }
    return
  }
  
  // 否则使用正常的键盘处理
  handleKeyDown(event)
}

// ✅ 监听播放录音的自定义事件
const handlePlaybackNote = (event: CustomEvent) => {
  const { frequency } = event.detail
  playNote(frequency)
}

const handleStopbackNote = (event: CustomEvent) => {
  const { frequency } = event.detail
  stopNote(frequency)
}

// ✅ 监听录制达到最大时长的事件
const handleMaxDuration = () => {
  alertStore.showAlertWithAutoHide('alert-warning', '录制已达到最大时长（120秒），已自动停止')
}

// 提示消息函数
const showSuccessToast = (message: string): void => {
  alertStore.showAlertWithAutoHide('alert-success', message)
}

const showErrorToast = (message: string): void => {
  alertStore.showAlertWithAutoHide('alert-danger', message)
}

// 分享上传功能
const submitShare = async () => {
  if (!shareRecordingName.value.trim()) {
    showErrorToast('请输入录音名称')
    return
  }

  const userId = userStore.getUserid()
  if (!userId) {
    showErrorToast('请先登录')
    return
  }

  // 检查时长限制
  if (recordingStats.value.duration > 120) {
    showErrorToast('录音时长超过限制（最长120秒）')
    return
  }

  try {
    isUploading.value = true

    const recordingName = shareRecordingName.value.trim()
    
    const response = await api.module.piano.uploadRecording({
      userId,
      recordingName,
      recordingData: recordedNotes.value,
      isPublic: shareIsPublic.value
    })

    if (response.retCode === '0000' && response.retValue) {
      showSuccessToast('分享成功！')
      showShareDialog.value = false
      shareRecordingName.value = ''
      shareIsPublic.value = 1

      // 创建动态
      await api.activity.createActivity({
        userId,
        activityType: 'PIANO',
        activityTitle: '分享了钢琴作品',
        activityDesc: `分享了钢琴作品《${recordingName}》`,
        activityContent: `时长${recordingStats.value.duration}秒，${recordingStats.value.uniqueNotes}个音符`,
        relatedId: response.retValue.toString(),
        isPublic: shareIsPublic.value
      })

      // 刷新榜单
      if (showRankingList.value) {
        loadRankingList()
      }
    } else {
      showErrorToast(response.retDesc || '分享失败')
    }
  } catch (error: any) {
    console.error('分享失败:', error)
    showErrorToast(error.message || '分享失败')
  } finally {
    isUploading.value = false
  }
}

// 切换榜单显示
const toggleRankingList = () => {
  showRankingList.value = !showRankingList.value
  if (showRankingList.value && rankingList.value.length === 0) {
    loadRankingList()
  }
}

// 加载榜单
const loadRankingList = async () => {
  const userId = userStore.getUserid() || ''
  
  try {
    isLoadingRanking.value = true
    const response = await api.module.piano.getRecordingList(userId, 20)
    
    if (response.retCode === '0000' && response.retValue) {
      rankingList.value = response.retValue
    } else {
      console.error('加载榜单失败:', response.retDesc)
      // 静默失败，不显示提示
    }
  } catch (error: any) {
    console.error('加载榜单失败:', error)
    // 静默失败，不显示提示
  } finally {
    isLoadingRanking.value = false
  }
}

// 播放分享的录音
const playSharedRecording = async (recordingId: number) => {
  try {
    isPlayingShared.value = true
    const response = await api.module.piano.playRecording(recordingId)
    
    if (response.retCode === '0000' && response.retValue && response.retValue.recordingData) {
      const data = JSON.parse(response.retValue.recordingData)
      
      // 使用现有的播放功能播放
      let currentIndex = 0
      const playNext = () => {
        if (currentIndex >= data.length) {
          isPlayingShared.value = false
          return
        }

        const event = data[currentIndex]
        const delay = currentIndex === 0 ? 0 : data[currentIndex].timestamp - data[currentIndex - 1].timestamp

        setTimeout(() => {
          if (event.type === 'press') {
            playNote(event.frequency)
          } else {
            stopNote(event.frequency)
          }
          
          currentIndex++
          playNext()
        }, delay)
      }

      playNext()
      // 不再显示"开始播放"提示，播放开始即可
    } else {
      showErrorToast(response.retDesc || '播放失败')
      isPlayingShared.value = false
    }
  } catch (error: any) {
    console.error('播放失败:', error)
    showErrorToast('播放失败')
    isPlayingShared.value = false
  }
}

// 点赞/取消点赞
const toggleLike = async (recordingId: number, isLiked: boolean) => {
  const userId = userStore.getUserid()
  if (!userId) {
    showErrorToast('请先登录')
    return
  }

  try {
    // 找到录音作者
    const recording = rankingList.value.find(item => item.recordingId === recordingId)
    if (!recording) return

    // addRecord会自动切换点赞状态
    await api.module.record.addRecord(userId, recording.userId, '61002', recordingId)
    // 点赞操作成功，不再显示提示，直接刷新榜单

    // 刷新榜单
    loadRankingList()
  } catch (error: any) {
    console.error('点赞操作失败:', error)
    showErrorToast('点赞操作失败')
  }
}

// 生命周期
onMounted(() => {
  // 从storage恢复用户信息（用于新标签页）
  userStore.getStorageUser()
  
  // 添加全局事件监听
  document.addEventListener('mouseup', endDrag)
  document.addEventListener('mouseleave', endDrag)
  document.addEventListener('keydown', extendedKeyDown) // ✅ 使用扩展的键盘处理
  document.addEventListener('keyup', handleKeyUp)
  
  // ✅ 监听播放录音事件
  window.addEventListener('piano-play-note', handlePlaybackNote as EventListener)
  window.addEventListener('piano-stop-note', handleStopbackNote as EventListener)
  
  // ✅ 监听录制达到最大时长事件
  window.addEventListener('recording-max-duration', handleMaxDuration as EventListener)
  
  console.log('🎹 钢琴模拟器已加载')
  console.log('💡 快捷键: 空格=停止所有音符 | Ctrl+R=录制 | Ctrl+P=播放')
  console.log('⏱️ 录制时长限制: 120秒')
})

onUnmounted(() => {
  // ✅ 清理节拍器
  if (metronomeInterval) {
    clearInterval(metronomeInterval)
  }
  
  // 清理事件监听
  document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('mouseleave', endDrag)
  document.removeEventListener('keydown', extendedKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
  
  // ✅ 清理播放录音事件
  window.removeEventListener('piano-play-note', handlePlaybackNote as EventListener)
  window.removeEventListener('piano-stop-note', handleStopbackNote as EventListener)
  
  // ✅ 清理录制最大时长事件
  window.removeEventListener('recording-max-duration', handleMaxDuration as EventListener)
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

/* ✅ 音量滑块样式 */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
}

/* 输入框样式 */
input[type="number"] {
  font-size: 0.875rem;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}

/* ✅ 快捷键样式 */
.kbd-style {
  display: inline-block;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>