import axios from 'axios'

import {PIECE} from './enums'

export const _getNewSession = (boardSize: number) => axios({
  method: 'get',
  withCredentials: true,
  url: `http://localhost:8000/new/${boardSize}`
})

export const _getSession = (sessionId: string, playerName?: string) => axios({
  method: 'get',
  withCredentials: true,
  url: `http://localhost:8000/${sessionId}${playerName?`?playerName=${playerName}`:''}`
})

export const _postMove = (sessionId: string, rowIndex: number, colIndex: number, piece: PIECE) => axios({
  method: 'post',
  withCredentials: true,
  url: `http://localhost:8000/${sessionId}?i=${rowIndex}&j=${colIndex}&piece=${piece}`
})