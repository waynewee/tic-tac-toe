import axios from 'axios'

import {PIECE} from './pages/enums'

export const _getNewSession = (boardSize: number) => axios({
  method: 'get',
  withCredentials: true,
  url: `http://localhost:8000/${boardSize}`
})

export const _getFriendSession = (sessionId: string) => axios({
  method: 'get',
  withCredentials: true,
  url: `http://localhost:8000/session/${sessionId}`
})

export const _postMove = (sessionId: string, rowIndex: number, colIndex: number, piece: PIECE) => axios({
  method: 'post',
  withCredentials: true,
  url: `http://localhost:8000/${sessionId}?i=${rowIndex}&j=${colIndex}&piece=${piece}`
})