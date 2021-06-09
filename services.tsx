import axios from 'axios'

import {PIECE} from './components/enums'

const production = process.env.NODE_ENV === 'production'

let API_URL = `http://localhost:8000`

if (production) {
  API_URL = `http://ec2-18-117-252-73.us-east-2.compute.amazonaws.com`
}

export const _getNewSession = (boardSize: number) => axios({
  method: 'get',
  withCredentials: true,
  url: `${API_URL}/new/${boardSize}`
})

export const _getSession = (sessionId: string, playerName?: string) => axios({
  method: 'get',
  withCredentials: true,
  url: `${API_URL}/${sessionId}${playerName?`?playerName=${playerName}`:''}`
})

export const _postMove = (sessionId: string, rowIndex: number, colIndex: number, piece: PIECE) => axios({
  method: 'post',
  withCredentials: true,
  url: `${API_URL}/${sessionId}?i=${rowIndex}&j=${colIndex}&piece=${piece}`
})

export const _deleteSession = (sessionId: string) => axios({
  method: 'delete',
  withCredentials: true,
  url: `${API_URL}/${sessionId}`
})