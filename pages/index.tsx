import React from 'react'
import { _getFriendSession, _getNewSession, _postMove } from '../services'

import { PIECE } from './enums'

const BOARD_SIZE = 3

interface IHomeProps {}
interface IHomeState {
  board: Array<Array<PIECE>>,
  activePiece: PIECE,
  started: boolean,
  sessionId: string | null
}

function initBoard(){
  const board = [] as Array<Array<PIECE>>

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (!board[i]){
      board[i] = []
    }
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = PIECE.EMPTY
    }
  }
  
  return board
}

class Home extends React.Component<IHomeProps, IHomeState> {

  state = {
    board: initBoard(),
    activePiece: PIECE.CIRCLE,
    started: false,
    sessionId: null
  }
  
  render() {
    return (
      <div>
          {this.state.sessionId}
          {this.state.board.map( (row, rowIndex) => {
            return (
              <div>
                {row.map( (piece, colIndex) => {
                  return (
                    <span
                    key={`piece-${rowIndex}-${colIndex}`}
                    onClick={()=>this.handleMove({ rowIndex, colIndex })}
                    style={{
                      height: 100,
                      width: 100,
                      display: 'inline-block',
                      border: '1px solid #e8e8e8'
                    }}>
                      {piece}
                    </span>
                  )
                })}
              </div>
            )
          })}
          <input
            onChange={(e: any) => this.handleChangeSessionId(e.target.value)}
          />
          <button
            onClick={this.handleSubmitSessionId}
          >OK</button>
      </div>
    )
  }

  async componentDidMount(){
    try {
      const res = await _getNewSession(BOARD_SIZE)
      console.log(res)
      const { sessionId } = res.data
      this.setState({ sessionId })
    } catch(e) {console.log(e)}
  }

  handleChangeSessionId = (sessionId: string) => {
    this.setState({sessionId})
  }

  handleSubmitSessionId = async () => {
    try {
      const sessionId = this.state.sessionId as any as string
      const res = await _getFriendSession(sessionId)
      const { board } = res.data
      this.setState({ board })
    } catch(e) {console.log(e)}
  }

  handleMove = async ({ rowIndex, colIndex } : { rowIndex: number, colIndex: number }) => {
    const { board } = this.state
    board[rowIndex][colIndex] = this.state.activePiece

    const sessionId = this.state.sessionId as any as string
    
    await _postMove(sessionId, rowIndex, colIndex, this.state.activePiece)

    this.setState({ 
      started: true,
      board
    }, () => {
      this.checkWin(rowIndex, colIndex)
    })
  }

  toggleActivePiece = () => {
    this.setState({
      activePiece: this.state.activePiece === PIECE.CIRCLE ? PIECE.CROSS : PIECE.CIRCLE
    })
  }

  //logic, a win must contain the piece of the previous move
  checkWin = (rowIndex: number, colIndex: number) => {

    if (
      this.checkWinHorizontal(rowIndex)
      || this.checkWinVertical(colIndex)
      || this.checkWinLeftDiagonal(rowIndex, colIndex)
      || this.checkWinRightDiagonal(rowIndex, colIndex)
    ) {
      return this.win()
    }

    this.toggleActivePiece()

  }

  checkWinHorizontal = (rowIndex: number) => {
    const i = Math.floor(rowIndex / BOARD_SIZE)
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (this.state.board[i][j] != this.state.activePiece) {
        return false
      }
    }
    return true
  }

  checkWinVertical = (colIndex: number) => {
    const j = colIndex
    for (let i = 0; i < BOARD_SIZE; i++) {
      if(this.state.board[i][j] != this.state.activePiece) {
        return false
      }
    }
    return true
  }

  checkWinLeftDiagonal = (rowIndex: number, colIndex: number) => {
    if (rowIndex != colIndex) {
      return false
    }

    let i = 0;
    let j = 0;
    while (i < BOARD_SIZE && j < BOARD_SIZE) {
      if (this.state.board[i][j] != this.state.activePiece) {
        return false
      }
      i += 1
      j += 1
    }
    return true
  }

  checkWinRightDiagonal = (rowIndex: number, colIndex: number) => {
    if (rowIndex + colIndex != BOARD_SIZE - 1) {
      return false
    }
    let i = BOARD_SIZE - 1
    let j = 0;
    while (i >= 0 && j < BOARD_SIZE) {
      if (this.state.board[i][j] != this.state.activePiece) {
        return false
      }
      i -= 1
      j += 1
    }
    return true
  }

  win = () => {
    alert("YOU WON")
    this.setState({
      board: initBoard()
    })
  }

}

export default Home