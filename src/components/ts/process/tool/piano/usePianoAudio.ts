// composables/usePianoAudio.ts
import { ref } from 'vue'

interface AudioContext extends BaseAudioContext {
    createOscillator(): OscillatorNode
    createGain(): GainNode
    destination: AudioDestinationNode
}

export const usePianoAudio = () => {
    const audioContext = ref<AudioContext | null>(null)
    const activeOscillators = ref(new Map<number, { oscillators: OscillatorNode[]; gains: GainNode[] }>())
    const masterVolume = ref(0.6) // 主音量控制

    // 初始化 Web Audio Context
    const initAudioContext = () => {
        if (!audioContext.value) {
            audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
    }

    // ✅ 改进的播放音符 - 更真实的钢琴音色
    const playNote = (frequency: number) => {
        initAudioContext()

        if (!audioContext.value) return

        // 如果音符已在播放，先停止
        if (activeOscillators.value.has(frequency)) {
            stopNote(frequency)
        }

        const ctx = audioContext.value
        const now = ctx.currentTime
        
        // 存储所有振荡器和增益节点
        const oscillators: OscillatorNode[] = []
        const gains: GainNode[] = []

        // ✅ 创建复杂的钢琴音色（基础音 + 多个谐波）
        const harmonics = [
            { ratio: 1, amplitude: 1.0, type: 'triangle' as OscillatorType },      // 基频
            { ratio: 2, amplitude: 0.4, type: 'sine' as OscillatorType },         // 2次谐波
            { ratio: 3, amplitude: 0.25, type: 'sine' as OscillatorType },        // 3次谐波
            { ratio: 4, amplitude: 0.15, type: 'sine' as OscillatorType },        // 4次谐波
            { ratio: 5, amplitude: 0.1, type: 'sine' as OscillatorType },         // 5次谐波
            { ratio: 6, amplitude: 0.05, type: 'sine' as OscillatorType },        // 6次谐波
        ]

        harmonics.forEach(({ ratio, amplitude, type }) => {
            const oscillator = ctx.createOscillator()
            const gainNode = ctx.createGain()
            const filter = ctx.createBiquadFilter()

            oscillator.type = type
            oscillator.frequency.setValueAtTime(frequency * ratio, now)

            // ✅ 添加低通滤波器，让高频更柔和
            filter.type = 'lowpass'
            filter.frequency.setValueAtTime(frequency * ratio * 2, now)
            filter.Q.setValueAtTime(1, now)

            // ✅ 更真实的 ADSR 包络
            const finalAmplitude = amplitude * masterVolume.value * 0.3
            gainNode.gain.setValueAtTime(0, now)
            gainNode.gain.linearRampToValueAtTime(finalAmplitude, now + 0.005) // 快速攻击
            gainNode.gain.exponentialRampToValueAtTime(finalAmplitude * 0.7, now + 0.08) // 衰减
            gainNode.gain.setValueAtTime(finalAmplitude * 0.6, now + 0.08) // 持续

            // 连接：振荡器 -> 滤波器 -> 增益 -> 目标
            oscillator.connect(filter)
            filter.connect(gainNode)
            gainNode.connect(ctx.destination)

            oscillator.start(now)

            oscillators.push(oscillator)
            gains.push(gainNode)
        })

        // ✅ 添加轻微的噪音来模拟锤击弦的声音
        createHammerNoise(ctx, now)

        // 存储活跃的振荡器组
        activeOscillators.value.set(frequency, { oscillators, gains })
    }

    // ✅ 创建锤击声音（模拟琴锤敲击琴弦的噪音）
    const createHammerNoise = (ctx: AudioContext, startTime: number) => {
        const bufferSize = ctx.sampleRate * 0.05 // 50ms 的噪音
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)

        // 生成白噪音并应用快速衰减包络
        for (let i = 0; i < bufferSize; i++) {
            const envelope = Math.exp(-i / (bufferSize * 0.1)) // 快速衰减
            data[i] = (Math.random() * 2 - 1) * envelope * 0.03 // 很小的音量
        }

        const noise = ctx.createBufferSource()
        const noiseGain = ctx.createGain()
        const noiseFilter = ctx.createBiquadFilter()

        noise.buffer = buffer
        noiseFilter.type = 'highpass'
        noiseFilter.frequency.setValueAtTime(2000, startTime) // 只保留高频

        noiseGain.gain.setValueAtTime(masterVolume.value * 0.3, startTime)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02)

        noise.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(ctx.destination)

        noise.start(startTime)
        noise.stop(startTime + 0.05)
    }

    // ✅ 改进的停止音符 - 处理多个振荡器
    const stopNote = (frequency: number) => {
        const activeNote = activeOscillators.value.get(frequency)
        if (activeNote && audioContext.value) {
            const { oscillators, gains } = activeNote
            const now = audioContext.value.currentTime

            // 对所有增益节点应用释放包络
            gains.forEach(gain => {
                try {
                    gain.gain.cancelScheduledValues(now)
                    gain.gain.setValueAtTime(gain.gain.value, now)
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4) // 较长的释放时间
                } catch (e) {
                    // 忽略错误
                }
            })

            // 延迟停止所有振荡器
            setTimeout(() => {
                oscillators.forEach(oscillator => {
                    try {
                        oscillator.stop()
                    } catch (e) {
                        // 忽略已停止的振荡器错误
                    }
                })
            }, 400)

            activeOscillators.value.delete(frequency)
        }
    }

    // 停止所有音符
    const stopAllNotes = () => {
        activeOscillators.value.forEach((_, frequency) => {
            stopNote(frequency)
        })
    }

    // 播放和弦
    const playChord = (frequencies: number[]) => {
        frequencies.forEach(freq => playNote(freq))
    }

    // ✅ 设置主音量
    const setVolume = (volume: number) => {
        masterVolume.value = Math.max(0, Math.min(1, volume)) // 限制在 0-1 之间
    }

    // ✅ 获取当前音量
    const getVolume = () => {
        return masterVolume.value
    }

    // ✅ 创建混响效果（可选）
    const createReverb = (ctx: AudioContext): ConvolverNode => {
        const convolver = ctx.createConvolver()
        const reverbTime = 2 // 混响时间（秒）
        const sampleRate = ctx.sampleRate
        const length = sampleRate * reverbTime
        const impulse = ctx.createBuffer(2, length, sampleRate)

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel)
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.5))
            }
        }

        convolver.buffer = impulse
        return convolver
    }

    return {
        playNote,
        stopNote,
        stopAllNotes,
        playChord,
        setVolume,
        getVolume,
        audioContext
    }
}