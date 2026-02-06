import request from '../request'

export interface PianoRecordingItem {
  recordingId: number
  userId: string
  username: string
  avatar: string
  recordingName: string
  duration: number
  noteCount: number
  createTime: string
  playCount: number
  likeCount: number
  isLiked: boolean
}

export interface UploadRecordingRequest {
  userId: string
  recordingName: string
  recordingData: any[]
  isPublic: number
}

export const pianoApi = {
  /**
   * 上传钢琴录音
   */
  uploadRecording: (data: UploadRecordingRequest) => {
    return request.post<number>('/api/piano/uploadRecording', data)
  },

  /**
   * 获取榜单
   */
  getRecordingList: (userId: string, limit: number = 20) => {
    return request.get<PianoRecordingItem[]>('/api/piano/getRecordingList', {
      params: { userId, limit }
    })
  },

  /**
   * 播放录音（获取数据并增加播放次数）
   */
  playRecording: (recordingId: number) => {
    return request.get<any>('/api/piano/playRecording', {
      params: { recordingId }
    })
  },

  /**
   * 删除录音
   */
  deleteRecording: (recordingId: number, userId: string) => {
    return request.post<string>('/api/piano/deleteRecording', {
      recordingId,
      userId
    })
  }
}
