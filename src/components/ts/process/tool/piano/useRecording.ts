// composables/useRecording.ts
import { ref, computed } from 'vue'

export interface RecordedEvent {
    id: string
    note: string
    frequency: number
    timestamp: number
    duration?: number
    type: 'press' | 'release'
}

export interface Recording {
    name: string
    createdAt: string
    events: RecordedEvent[]
    tempo: number
}

export const useRecording = () => {
    const isRecording = ref(false)
    const recordedNotes = ref<RecordedEvent[]>([])
    const isPlaying = ref(false)
    const recordingStartTime = ref<number>(0)
    const activeNotes = ref(new Map<string, RecordedEvent>())
    let recordingTimer: ReturnType<typeof setTimeout> | null = null

    const MAX_RECORDING_DURATION = 120000 // 120秒 = 120000毫秒

    // 开始录制
    const startRecording = () => {
        if (isPlaying.value) return

        isRecording.value = true
        recordedNotes.value = []
        recordingStartTime.value = Date.now()
        activeNotes.value.clear()
        console.log('🎤 开始录制...')

        // 设置120秒自动停止
        recordingTimer = setTimeout(() => {
            if (isRecording.value) {
                stopRecording()
                console.log('⚠️ 录制已达到最大时长（120秒），自动停止')
                window.dispatchEvent(new CustomEvent('recording-max-duration'))
            }
        }, MAX_RECORDING_DURATION)
    }

    // 停止录制
    const stopRecording = () => {
        if (!isRecording.value) return

        isRecording.value = false

        // 清除定时器
        if (recordingTimer) {
            clearTimeout(recordingTimer)
            recordingTimer = null
        }

        // 结束所有未完成的音符
        activeNotes.value.forEach((event, noteId) => {
            const duration = Date.now() - recordingStartTime.value - event.timestamp
            const releaseEvent: RecordedEvent = {
                ...event,
                id: generateId(),
                type: 'release',
                timestamp: Date.now() - recordingStartTime.value,
                duration
            }
            recordedNotes.value.push(releaseEvent)
        })

        activeNotes.value.clear()
        console.log(`🎵 录制完成，共记录 ${recordedNotes.value.length} 个事件`)
    }

    // 记录音符按下事件
    const recordNotePress = (noteId: string, noteName: string, frequency: number) => {
        if (!isRecording.value) return

        const timestamp = Date.now() - recordingStartTime.value
        const event: RecordedEvent = {
            id: generateId(),
            note: noteName,
            frequency,
            timestamp,
            type: 'press'
        }

        recordedNotes.value.push(event)
        activeNotes.value.set(noteId, event)
    }

    // 记录音符释放事件
    const recordNoteRelease = (noteId: string) => {
        if (!isRecording.value) return

        const pressEvent = activeNotes.value.get(noteId)
        if (!pressEvent) return

        const timestamp = Date.now() - recordingStartTime.value
        const duration = timestamp - pressEvent.timestamp

        const releaseEvent: RecordedEvent = {
            ...pressEvent,
            id: generateId(),
            type: 'release',
            timestamp,
            duration
        }

        recordedNotes.value.push(releaseEvent)
        activeNotes.value.delete(noteId)
    }

    // 播放录制的音乐
    const playRecording = async () => {
        if (recordedNotes.value.length === 0 || isPlaying.value || isRecording.value) {
            return
        }

        isPlaying.value = true
        console.log('▶️ 开始播放录音...')

        // 按时间排序事件
        const sortedEvents = [...recordedNotes.value].sort((a, b) => a.timestamp - b.timestamp)

        const startTime = Date.now()
        let eventIndex = 0

        const playNextEvent = () => {
            if (eventIndex >= sortedEvents.length || !isPlaying.value) {
                isPlaying.value = false
                console.log('⏹️ 播放完成')
                return
            }

            const event = sortedEvents[eventIndex]
            const currentTime = Date.now() - startTime

            if (currentTime >= event.timestamp) {
                // 触发事件
                if (event.type === 'press') {
                    // 这里需要调用音频播放函数
                    // 由于是在 composable 中，我们通过事件系统通知外部
                    window.dispatchEvent(new CustomEvent('piano-play-note', {
                        detail: { frequency: event.frequency, note: event.note }
                    }))
                } else if (event.type === 'release') {
                    window.dispatchEvent(new CustomEvent('piano-stop-note', {
                        detail: { frequency: event.frequency, note: event.note }
                    }))
                }

                eventIndex++
            }

            if (isPlaying.value) {
                requestAnimationFrame(playNextEvent)
            }
        }

        playNextEvent()
    }

    // 停止播放
    const stopPlayback = () => {
        isPlaying.value = false
    }

    // 清空录制
    const clearRecording = () => {
        if (isRecording.value || isPlaying.value) return

        recordedNotes.value = []
        activeNotes.value.clear()
        console.log('🗑️ 已清空录音')
    }

    // 下载录制文件
    const downloadRecording = () => {
        if (recordedNotes.value.length === 0) return

        const recording: Recording = {
            name: `Piano Recording ${new Date().toISOString().slice(0, 19)}`,
            createdAt: new Date().toISOString(),
            events: recordedNotes.value,
            tempo: 120 // 默认节拍
        }

        const dataStr = JSON.stringify(recording, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)

        const link = document.createElement('a')
        link.href = url
        link.download = `piano-recording-${Date.now()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        console.log('📥 录音文件已下载')
    }

    // 上传并导入录制文件
    const uploadRecording = (event: Event) => {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0]

        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string
                const recording: Recording = JSON.parse(content)

                if (recording.events && Array.isArray(recording.events)) {
                    recordedNotes.value = recording.events
                    console.log(`📤 已导入录音，共 ${recording.events.length} 个事件`)
                } else {
                    throw new Error('Invalid recording format')
                }
            } catch (error) {
                console.error('❌ 导入录音失败:', error)
                alert('导入失败，请确保文件格式正确')
            }
        }

        reader.readAsText(file)
        input.value = '' // 清空input，允许重复上传同一文件
    }

    // 获取录制统计信息
    const recordingStats = computed(() => {
        const events = recordedNotes.value
        const duration = events.length > 0
            ? Math.max(...events.map(e => e.timestamp))
            : 0

        const pressEvents = events.filter(e => e.type === 'press')
        const uniqueNotes = new Set(pressEvents.map(e => e.note))

        return {
            totalEvents: events.length,
            duration: Math.round(duration / 1000), // 转换为秒
            uniqueNotes: uniqueNotes.size,
            averageNoteDuration: pressEvents.length > 0
                ? Math.round(pressEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / pressEvents.length)
                : 0
        }
    })

    // 生成唯一ID
    const generateId = (): string => {
        return Math.random().toString(36).substr(2, 9)
    }

    // 导出录制为MIDI格式（简化版）
    const exportToMIDI = () => {
        // 这里可以实现MIDI导出功能
        // 由于篇幅限制，这里提供一个基础框架
        console.log('🎼 MIDI导出功能开发中...')
    }

    // 设置录制质量
    const setRecordingQuality = (quality: 'low' | 'medium' | 'high') => {
        // 可以根据质量调整录制精度
        console.log(`🎚️ 录制质量设置为: ${quality}`)
    }

    return {
        // 状态
        isRecording,
        recordedNotes,
        isPlaying,
        recordingStats,

        // 录制控制
        startRecording,
        stopRecording,
        recordNotePress,
        recordNoteRelease,

        // 播放控制
        playRecording,
        stopPlayback,

        // 文件操作
        clearRecording,
        downloadRecording,
        uploadRecording,
        exportToMIDI,

        // 设置
        setRecordingQuality
    }
}