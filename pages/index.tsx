import React from 'react'
import { _getSession, _getNewSession, _postMove } from '../services'

import { GAME_TYPE, PIECE } from './enums'

const DEFAULT_BOARD_SIZE = 3

interface IHomeProps {}
interface IHomeState {
  board: Array<Array<PIECE>>,
  pieceType: PIECE,
  started: boolean,
  sessionId: string | null,
  gameType: GAME_TYPE | null,
  boardSize: number,
  joined: boolean,
  playerName: string | null,
  poll: any,
  awaitingMove: boolean
}

function initBoard(){
  const board = [] as Array<Array<PIECE>>

  for (let i = 0; i < DEFAULT_BOARD_SIZE; i++) {
    if (!board[i]){
      board[i] = []
    }
    for (let j = 0; j < DEFAULT_BOARD_SIZE; j++) {
      board[i][j] = PIECE.EMPTY
    }
  }
  
  return board
}

class Home extends React.Component<IHomeProps, IHomeState> {

  state = {
    boardSize: DEFAULT_BOARD_SIZE,
    board: initBoard(),
    pieceType: PIECE.CIRCLE,
    started: false,
    sessionId: null,
    gameType: null,
    joined: false,
    playerName: null,
    poll: null,
    awaitingMove: false
  }
  
  render() {

    if (!this.state.gameType) {
      return (
        <div>
          <button onClick={this.handleInitLocal}>Local</button>
          <button onClick={this.handleInitOnlineHost}>Start Online</button>
          <button onClick={this.handleInitOnlineJoin}>Join Online</button>
        </div>
      )
    }

    if (this.state.gameType == GAME_TYPE.ONLINE_HOST) {

      if (this.state.awaitingMove) {
        return (
          <div>
            Please wait for ur opponent
          </div>
        )
      }

      if (this.state.sessionId) {
        return (
          <div>
            {this.state.playerName}
            <br/>
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
          </div>
        )
      }

      return (
        <div>
          <input
            onChange={(e:any) => this.handleChangeBoardSize(e.target.value)}
          />
          <button
            onClick={this.handleSubmitBoardSize}
          >OK</button>
        </div>
      )
    }
    
    if (this.state.gameType == GAME_TYPE.ONLINE_JOIN) {

      if (this.state.awaitingMove) {
        return (
          <div>
            Please wait for ur opponent
          </div>
        )
      }

      if (this.state.joined) {
        return (
          <div>
            {this.state.playerName}
            <br/>
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
          </div>
        )
      }

      return (
        <div>
          <input
            onChange={(e: any) => this.handleChangeSessionId(e.target.value)}
          />
          <button
            onClick={this.handleSubmitSessionId}
          >OK</button>
        </div>
      )
    }

    if (this.state.gameType == GAME_TYPE.LOCAL) {
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
        </div>
      )
    }

  }

  // componentWillUnmount() {
  //   if (this.state.poll) {
  //     clearInterval(this.state.poll as any)
  //   }
  // }


  handleInitLocal = () => {
    this.setState({ gameType: GAME_TYPE.LOCAL})
  }

  handleInitOnlineHost = () => {
    this.setState({ 
      gameType: GAME_TYPE.ONLINE_HOST,
      pieceType: PIECE.CIRCLE
    })
  }

  handleInitOnlineJoin = () => {
    this.setState({ 
      gameType: GAME_TYPE.ONLINE_JOIN,
      pieceType: PIECE.CROSS
    })
  }

  handleChangeSessionId = (sessionId: string) => {
    this.setState({sessionId})
  }

  handleChangeBoardSize = (boardSize: number) => {
    this.setState({ boardSize })
  }

  handleSubmitBoardSize = async () => {
    const res = await _getNewSession(this.state.boardSize)
    const { session, playerName } = res.data
    this.setState({ 
      playerName,
      board: session.board,
      sessionId: session.id
    })

    this.startPoll()
  }

  handleSubmitSessionId = async () => {
    try {
      const sessionId = this.state.sessionId as any as string
      const res = await _getSession(sessionId)
      const { session, playerName } = res.data
      this.setState({ board: session.board, joined: true, playerName })

      this.startPoll()

    } catch(e) {console.log(e)}
  }

  handleMove = async ({ rowIndex, colIndex } : { rowIndex: number, colIndex: number }) => {
    const { board } = this.state
    board[rowIndex][colIndex] = this.state.pieceType

    const sessionId = this.state.sessionId as any as string
    
    if (this.state.gameType != GAME_TYPE.LOCAL) {
      await _postMove(sessionId, rowIndex, colIndex, this.state.pieceType)
      this.setState({ awaitingMove: true })
    }

    this.setState({ 
      started: true,
      board
    }, () => {
      this.checkWin(rowIndex, colIndex)
    })
  }

  startPoll = () => {
    const poll = setInterval(async () => {
      const res = await _getSession(this.state.sessionId as any as string, this.state.playerName as any as string)
      const { session } = res.data
      
      if (JSON.stringify(session.board) != JSON.stringify(this.state.board)) {
        this.setState({
          awaitingMove: false
        })
      }

      this.setState({
        board: session.board
      })

    }, 3000)

    if (!this.state.poll) {
      this.setState({ poll })
    }
  }

  toggleActivePiece = () => {
    if (this.state.gameType != GAME_TYPE.LOCAL) {
      return
    }
    this.setState({
      pieceType: this.state.pieceType === PIECE.CIRCLE ? PIECE.CROSS : PIECE.CIRCLE
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
    const i = Math.floor(rowIndex / this.state.boardSize)
    for (let j = 0; j < this.state.boardSize; j++) {
      if (this.state.board[i][j] != this.state.pieceType) {
        return false
      }
    }
    return true
  }

  checkWinVertical = (colIndex: number) => {
    const j = colIndex
    for (let i = 0; i < this.state.boardSize; i++) {
      if(this.state.board[i][j] != this.state.pieceType) {
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
    while (i < this.state.boardSize && j < this.state.boardSize) {
      if (this.state.board[i][j] != this.state.pieceType) {
        return false
      }
      i += 1
      j += 1
    }
    return true
  }

  checkWinRightDiagonal = (rowIndex: number, colIndex: number) => {
    if (rowIndex + colIndex != this.state.boardSize - 1) {
      return false
    }
    let i = this.state.boardSize - 1
    let j = 0;
    while (i >= 0 && j < this.state.boardSize) {
      if (this.state.board[i][j] != this.state.pieceType) {
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