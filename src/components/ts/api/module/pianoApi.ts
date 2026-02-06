import request from '../../utils/request'
import type { ReturnValue } from '../../type/ReturnValue'

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

export default {
  /**
   * 上传钢琴录音
   */
  uploadRecording(data: UploadRecordingRequest): Promise<ReturnValue<number>> {
    return request.post('/piano/uploadRecording', data)
  },

  /**
   * 获取榜单
   */
  getRecordingList(userId: string, limit: number = 20): Promise<ReturnValue<PianoRecordingItem[]>> {
    return request.get('/piano/getRecordingList', {
      params: { userId, limit }
    })
  },

  /**
   * 播放录音（获取数据并增加播放次数）
   */
  playRecording(recordingId: number): Promise<ReturnValue<any>> {
    return request.get('/piano/playRecording', {
      params: { recordingId }
    })
  },

  /**
   * 删除录音
   */
  deleteRecording(recordingId: number, userId: string): Promise<ReturnValue<string>> {
    return request.post('/piano/deleteRecording', {
      recordingId,
      userId
    })
  }
}
