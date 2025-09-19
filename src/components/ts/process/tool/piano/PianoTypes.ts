// types.ts - TypeScript 类型定义

// 音符接口
export interface PianoNote {
    id: string
    name: string
    frequency: number
    octave?: number
    position?: number // 黑键的相对位置
    keyBinding?: string // 键盘映射
    color?: 'white' | 'black'
}

// 录制事件类型
export interface RecordedEvent {
    id: string
    note: string
    frequency: number
    timestamp: number // 相对于录制开始的时间戳（毫秒）
    duration?: number // 音符持续时间（毫秒）
    type: 'press' | 'release'
    velocity?: number // 力度（0-127，MIDI标准）
    source?: 'mouse' | 'keyboard' | 'touch' // 触发源
}

// 录制文件格式
export interface Recording {
    name: string
    version: string
    createdAt: string
    duration: number // 总时长（毫秒）
    events: RecordedEvent[]
    tempo: number // BPM
    timeSignature: [number, number] // 拍号 [分子, 分母]
    keySignature?: string // 调号
    metadata?: {
        composer?: string
        description?: string
        tags?: string[]
    }
}

// 音频上下文配置
export interface AudioConfig {
    sampleRate: number
    bufferSize: number
    volume: number
    reverb?: boolean
    reverbLevel?: number
    attack: number // ADSR包络参数
    decay: number
    sustain: number
    release: number
}

// 键盘映射配置
export interface KeyboardMapping {
    key: string
    note: PianoNote
    octave: number
    description?: string
}

// 节拍器配置
export interface MetronomeConfig {
    bpm: number
    beatCount: number // 每小节拍数
    accent: boolean // 强拍重音
    sound: 'click' | 'beep' | 'wood' | 'digital'
    volume: number
}

// 演奏统计
export interface PlayingStats {
    totalNotes: number
    uniqueNotes: number
    averageNoteDuration: number
    longestNote: number
    shortestNote: number
    mostPlayedNote: string
    playingTime: number // 总演奏时间（毫秒）
    accuracy?: number // 如果有参考，计算准确度
}

// 触控事件数据
export interface TouchEventData {
    id: number
    x: number
    y: number
    pressure?: number
    note?: PianoNote
}

// 拖拽状态
export interface DragState {
    isDragging: boolean
    startNote?: PianoNote
    currentNote?: PianoNote
    draggedNotes: Set<string>
    startTime: number
}

// 可视化配置
export interface VisualConfig {
    showNoteNames: boolean
    showKeyboardHints: boolean
    highlightPressedKeys: boolean
    animateKeyPress: boolean
    keyPressAnimation: 'bounce' | 'glow' | 'scale' | 'none'
    theme: 'classic' | 'modern' | 'neon' | 'minimal'
    colorScheme: 'light' | 'dark' | 'auto'
}

// 钢琴键盘配置
export interface PianoConfig {
    startNote: string // 起始音符，如 'C4'
    endNote: string // 结束音符，如 'C6'
    octaves: number // 八度数量
    showLabels: boolean
    keyWidth: number // 白键宽度（像素）
    keyHeight: number // 白键高度（像素）
    blackKeyRatio: number // 黑键相对白键的尺寸比例
    spacing: number // 键间距
}

// 错误类型
export interface PianoError {
    code: string
    message: string
    details?: any
    timestamp: number
}

// 事件监听器类型
export type EventListener<T = any> = (data: T) => void

// 钢琴应用状态
export interface PianoAppState {
    isInitialized: boolean
    audioContext?: AudioContext
    currentMode: 'playing' | 'recording' | 'playing-back'
    activeNotes: Set<string>
    pressedKeys: Set<string>
    config: {
        audio: AudioConfig
        keyboard: KeyboardMapping[]
        visual: VisualConfig
        piano: PianoConfig
        metronome: MetronomeConfig
    }
    stats: PlayingStats
    errors: PianoError[]
}

// 音符频率映射（标准A4=440Hz）
export const NOTE_FREQUENCIES: { [key: string]: number } = {
    'C0': 16.35, 'C#0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'E0': 20.60,
    'F0': 21.83, 'F#0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'A0': 27.50,
    'A#0': 29.14, 'B0': 30.87,

    'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20,
    'F1': 43.65, 'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00,
    'A#1': 58.27, 'B1': 61.74,

    'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41,
    'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00,
    'A#2': 116.54, 'B2': 123.47,

    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
    'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00,
    'A#3': 233.08, 'B3': 246.94,

    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
    'A#4': 466.16, 'B4': 493.88,

    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
    'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00,
    'A#5': 932.33, 'B5': 987.77,

    'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51,
    'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00,
    'A#6': 1864.66, 'B6': 1975.53,

    'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02,
    'F7': 2793.83, 'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00,
    'A#7': 3729.31, 'B7': 3951.07,

    'C8': 4186.01
}

// 默认键盘映射
export const DEFAULT_KEYBOARD_MAPPING: { [key: string]: string } = {
    // 第一排（数字键）- 高八度
    '1': 'C5', '2': 'C#5', '3': 'D5', '4': 'D#5', '5': 'E5', '6': 'F5',
    '7': 'F#5', '8': 'G5', '9': 'G#5', '0': 'A5', '-': 'A#5', '=': 'B5',

    // 第二排（QWERTY）- 中高八度
    'q': 'C4', 'w': 'C#4', 'e': 'D4', 'r': 'D#4', 't': 'E4', 'y': 'F4',
    'u': 'F#4', 'i': 'G4', 'o': 'G#4', 'p': 'A4', '[': 'A#4', ']': 'B4',

    // 第三排（ASDF）- 中八度
    'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4',
    'j': 'B4', 'k': 'C5', 'l': 'D5', ';': 'E5', '\'': 'F5',

    // 第四排（ZXCV）- 低八度
    'z': 'C3', 'x': 'D3', 'c': 'E3', 'v': 'F3', 'b': 'G3', 'n': 'A3', 'm': 'B3'
}

// 音程关系定义
export const INTERVALS: { [key: string]: number } = {
    'unison': 0,
    'minor2nd': 1,
    'major2nd': 2,
    'minor3rd': 3,
    'major3rd': 4,
    'perfect4th': 5,
    'tritone': 6,
    'perfect5th': 7,
    'minor6th': 8,
    'major6th': 9,
    'minor7th': 10,
    'major7th': 11,
    'octave': 12
}

// 和弦类型定义
export interface ChordType {
    name: string
    intervals: number[]
    description: string
}

// 常用和弦
export const COMMON_CHORDS: { [key: string]: ChordType } = {
    'major': { name: '大三和弦', intervals: [0, 4, 7], description: 'Major triad' },
    'minor': { name: '小三和弦', intervals: [0, 3, 7], description: 'Minor triad' },
    'dim': { name: '减三和弦', intervals: [0, 3, 6], description: 'Diminished triad' },
    'aug': { name: '增三和弦', intervals: [0, 4, 8], description: 'Augmented triad' },
    'maj7': { name: '大七和弦', intervals: [0, 4, 7, 11], description: 'Major seventh' },
    'min7': { name: '小七和弦', intervals: [0, 3, 7, 10], description: 'Minor seventh' },
    'dom7': { name: '属七和弦', intervals: [0, 4, 7, 10], description: 'Dominant seventh' }
}

// 调性定义
export interface KeySignature {
    name: string
    sharps: number
    flats: number
    notes: string[]
}

// 常用调性
export const KEY_SIGNATURES: { [key: string]: KeySignature } = {
    'C': { name: 'C Major', sharps: 0, flats: 0, notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
    'G': { name: 'G Major', sharps: 1, flats: 0, notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
    'D': { name: 'D Major', sharps: 2, flats: 0, notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
    'A': { name: 'A Major', sharps: 3, flats: 0, notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
    'E': { name: 'E Major', sharps: 4, flats: 0, notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
    'F': { name: 'F Major', sharps: 0, flats: 1, notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'] },
    'Bb': { name: 'Bb Major', sharps: 0, flats: 2, notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'] }
}

export default {
    NOTE_FREQUENCIES,
    DEFAULT_KEYBOARD_MAPPING,
    INTERVALS,
    COMMON_CHORDS,
    KEY_SIGNATURES
}