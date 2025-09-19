// composables/usePianoAudio.ts
import { ref } from 'vue'

interface AudioContext extends BaseAudioContext {
    createOscillator(): OscillatorNode
    createGain(): GainNode
    destination: AudioDestinationNode
}

export const usePianoAudio = () => {
    const audioContext = ref<AudioContext | null>(null)
    const activeOscillators = ref(new Map<number, { oscillator: OscillatorNode; gain: GainNode }>())

    // 初始化 Web Audio Context
    const initAudioContext = () => {
        if (!audioContext.value) {
            audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
    }

    // 播放音符
    const playNote = (frequency: number) => {
        initAudioContext()

        if (!audioContext.value) return

        // 如果音符已在播放，先停止
        if (activeOscillators.value.has(frequency)) {
            stopNote(frequency)
        }

        // 创建振荡器和增益节点
        const oscillator = audioContext.value.createOscillator()
        const gainNode = audioContext.value.createGain()

        // 设置钢琴音色（使用复合波形模拟钢琴音色）
        oscillator.type = 'triangle' // 基础音色
        oscillator.frequency.setValueAtTime(frequency, audioContext.value.currentTime)

        // 设置 ADSR 包络（攻击、衰减、持续、释放）
        const now = audioContext.value.currentTime
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01) // 攻击
        gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.1) // 衰减
        gainNode.gain.setValueAtTime(0.2, now + 0.1) // 持续

        // 连接节点
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.value.destination)

        // 启动振荡器
        oscillator.start(now)

        // 存储活跃的振荡器
        activeOscillators.value.set(frequency, { oscillator, gain: gainNode })

        // 添加泛音以增强音色真实感
        createHarmonic(frequency, 0.1, 2) // 二次谐波
        createHarmonic(frequency, 0.05, 3) // 三次谐波
        createHarmonic(frequency, 0.03, 4) // 四次谐波
    }

    // 创建谐波
    const createHarmonic = (baseFreq: number, amplitude: number, harmonic: number) => {
        if (!audioContext.value) return

        const oscillator = audioContext.value.createOscillator()
        const gainNode = audioContext.value.createGain()

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(baseFreq * harmonic, audioContext.value.currentTime)

        const now = audioContext.value.currentTime
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(amplitude, now + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(amplitude * 0.7, now + 0.1)

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.value.destination)

        oscillator.start(now)

        // 谐波持续时间稍短
        setTimeout(() => {
            if (gainNode.gain) {
                const stopTime = audioContext.value!.currentTime
                gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime + 0.3)
                oscillator.stop(stopTime + 0.3)
            }
        }, 100)
    }

    // 停止音符
    const stopNote = (frequency: number) => {
        const activeNote = activeOscillators.value.get(frequency)
        if (activeNote && audioContext.value) {
            const { oscillator, gain } = activeNote

            // 渐隐效果
            const now = audioContext.value.currentTime
            gain.gain.cancelScheduledValues(now)
            gain.gain.setValueAtTime(gain.gain.value, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

            // 延迟停止振荡器
            setTimeout(() => {
                try {
                    oscillator.stop()
                } catch (e) {
                    // 忽略已停止的振荡器错误
                }
            }, 300)

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

    // 创建简单的钢琴采样音（base64编码的短音频）
    const createPianoSample = (frequency: number): string => {
        // 这里返回一个基于频率生成的简单音频数据URL
        // 实际应用中可以使用真实的钢琴采样
        return `data:audio/wav;base64,${generateSimpleWaveform(frequency)}`
    }

    // 生成简单波形（用于演示）
    const generateSimpleWaveform = (frequency: number): string => {
        const sampleRate = 44100
        const duration = 1
        const samples = sampleRate * duration
        const buffer = new ArrayBuffer(44 + samples * 2)
        const view = new DataView(buffer)

        // WAV 文件头
        const writeString = (offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i))
            }
        }

        writeString(0, 'RIFF')
        view.setUint32(4, 36 + samples * 2, true)
        writeString(8, 'WAVE')
        writeString(12, 'fmt ')
        view.setUint32(16, 16, true)
        view.setUint16(20, 1, true)
        view.setUint16(22, 1, true)
        view.setUint32(24, sampleRate, true)
        view.setUint32(28, sampleRate * 2, true)
        view.setUint16(32, 2, true)
        view.setUint16(34, 16, true)
        writeString(36, 'data')
        view.setUint32(40, samples * 2, true)

        // 生成音频数据
        let offset = 44
        for (let i = 0; i < samples; i++) {
            const t = i / sampleRate
            let sample = Math.sin(2 * Math.PI * frequency * t) * 0.3

            // 添加包络
            const envelope = Math.exp(-t * 2)
            sample *= envelope

            // 添加一些谐波
            sample += Math.sin(2 * Math.PI * frequency * 2 * t) * 0.1 * envelope
            sample += Math.sin(2 * Math.PI * frequency * 3 * t) * 0.05 * envelope

            const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)))
            view.setInt16(offset, intSample, true)
            offset += 2
        }

        // 转换为 base64
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
    }

    return {
        playNote,
        stopNote,
        stopAllNotes,
        playChord,
        audioContext
    }
}