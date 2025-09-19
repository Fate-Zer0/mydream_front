// composables/useKeyboardHandler.ts
import { ref } from 'vue'

interface PianoNote {
    id: string
    name: string
    frequency: number
    keyBinding?: string
}

export const useKeyboardHandler = (
    notes: PianoNote[],
    playNote: (note: PianoNote, recordable?: boolean) => void,
    stopNote: (note: PianoNote) => void
) => {
    const pressedKeysMap = ref(new Map<string, PianoNote>())
    const keyRepeatTimeout = ref(new Map<string, ReturnType<typeof setTimeout>>())
    // 创建键盘映射表
    const keyboardMap = new Map<string, PianoNote>()
    notes.forEach(note => {
        if (note.keyBinding) {
            keyboardMap.set(note.keyBinding.toLowerCase(), note)
        }
    })

    // 处理键盘按下
    const handleKeyDown = (event: KeyboardEvent) => {
        // 忽略修饰键和功能键
        if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
            return
        }

        // 防止浏览器默认行为
        if (keyboardMap.has(event.key.toLowerCase())) {
            event.preventDefault()
        }

        const key = event.key.toLowerCase()
        const note = keyboardMap.get(key)

        if (!note) return

        // 防止按键重复触发
        if (pressedKeysMap.value.has(key)) {
            return
        }

        // 清除可能存在的重复按键超时
        const existingTimeout = keyRepeatTimeout.value.get(key)
        if (existingTimeout) {
            clearTimeout(existingTimeout)
            keyRepeatTimeout.value.delete(key)
        }

        // 标记按键为已按下
        pressedKeysMap.value.set(key, note)

        // 播放音符
        playNote(note, true)

        // 添加视觉反馈的类名
        addKeyVisualFeedback(key, true)
    }

    // 处理键盘释放
    const handleKeyUp = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase()
        const note = pressedKeysMap.value.get(key)

        if (!note) return

        // 防止浏览器默认行为
        event.preventDefault()

        // 添加短暂延迟以避免快速按键导致的音符中断
        const timeout = setTimeout(() => {
            // 移除按键标记
            pressedKeysMap.value.delete(key)

            // 停止音符
            stopNote(note)

            // 移除视觉反馈
            addKeyVisualFeedback(key, false)

            // 清除超时引用
            keyRepeatTimeout.value.delete(key)
        }, 50) // 50ms 延迟

        keyRepeatTimeout.value.set(key, timeout)
    }

    // 添加键盘可视化反馈
    const addKeyVisualFeedback = (key: string, isPressed: boolean) => {
        const note = keyboardMap.get(key)
        if (!note) return

        // 查找对应的钢琴键元素
        const pianoKeys = document.querySelectorAll('.piano-key')
        pianoKeys.forEach(keyElement => {
            const keyText = keyElement.textContent?.trim()
            if (keyText === note.name) {
                if (isPressed) {
                    keyElement.classList.add('keyboard-pressed')
                } else {
                    keyElement.classList.remove('keyboard-pressed')
                }
            }
        })
    }

    // 处理特殊键位组合
    const handleSpecialCombinations = (event: KeyboardEvent) => {
        // 空格键：紧急停止所有音符
        if (event.code === 'Space') {
            event.preventDefault()
            stopAllNotes()
            return
        }

        // Escape键：停止录制/播放
        if (event.code === 'Escape') {
            event.preventDefault()
            // 这里可以添加停止录制或播放的逻辑
            window.dispatchEvent(new CustomEvent('piano-escape-pressed'))
            return
        }
    }

    // 停止所有音符
    const stopAllNotes = () => {
        pressedKeysMap.value.forEach((note, key) => {
            stopNote(note)
            addKeyVisualFeedback(key, false)
        })
        pressedKeysMap.value.clear()

        // 清除所有超时
        keyRepeatTimeout.value.forEach(timeout => clearTimeout(timeout))
        keyRepeatTimeout.value.clear()
    }

    // 获取当前按下的键
    const getCurrentlyPressedKeys = () => {
        return Array.from(pressedKeysMap.value.keys())
    }

    // 获取当前按下的音符
    const getCurrentlyPressedNotes = () => {
        return Array.from(pressedKeysMap.value.values())
    }

    // 模拟按键（程序化触发）
    const simulateKeyPress = (key: string, duration = 500) => {
        const note = keyboardMap.get(key.toLowerCase())
        if (!note) return

        // 模拟按下
        pressedKeysMap.value.set(key, note)
        playNote(note, false) // 模拟按键不录制
        addKeyVisualFeedback(key, true)

        // 模拟释放
        setTimeout(() => {
            pressedKeysMap.value.delete(key)
            stopNote(note)
            addKeyVisualFeedback(key, false)
        }, duration)
    }

    // 检查键是否被按下
    const isKeyPressed = (key: string): boolean => {
        return pressedKeysMap.value.has(key.toLowerCase())
    }

    // 获取键盘映射信息
    const getKeyboardMappings = () => {
        return Array.from(keyboardMap.entries()).map(([key, note]) => ({
            key: key.toUpperCase(),
            note: note.name,
            frequency: note.frequency
        }))
    }

    // 扩展的键盘处理（包含特殊组合）
    const extendedHandleKeyDown = (event: KeyboardEvent) => {
        handleSpecialCombinations(event)
        handleKeyDown(event)
    }

    // 清理函数
    const cleanup = () => {
        stopAllNotes()
    }

    // 设置键盘灵敏度
    const setSensitivity = (level: 'low' | 'medium' | 'high') => {
        const delays = {
            low: 100,
            medium: 50,
            high: 20
        }

        // 这里可以调整按键响应的延迟
        console.log(`⌨️ 键盘灵敏度设置为: ${level} (${delays[level]}ms)`)
    }

    // 启用/禁用键盘输入
    const setKeyboardEnabled = (enabled: boolean) => {
        if (!enabled) {
            stopAllNotes()
        }
        console.log(`⌨️ 键盘输入 ${enabled ? '启用' : '禁用'}`)
    }

    // 获取按键建议（基于音乐理论）
    const getKeySuggestions = (currentKeys: string[]): string[] => {
        // 简单的和弦建议逻辑
        const suggestions: string[] = []

        if (currentKeys.includes('a')) { // C大调
            suggestions.push('d', 'f') // 加入E和G构成C大三和弦
        } else if (currentKeys.includes('s')) { // D
            suggestions.push('f', 'h') // D-F#-A
        }

        return suggestions.filter(key => !currentKeys.includes(key))
    }

    return {
        // 核心处理函数
        handleKeyDown: extendedHandleKeyDown,
        handleKeyUp,

        // 状态查询
        getCurrentlyPressedKeys,
        getCurrentlyPressedNotes,
        isKeyPressed,
        getKeyboardMappings,

        // 控制函数
        stopAllNotes,
        simulateKeyPress,
        cleanup,

        // 设置函数
        setSensitivity,
        setKeyboardEnabled,

        // 辅助功能
        getKeySuggestions
    }
}