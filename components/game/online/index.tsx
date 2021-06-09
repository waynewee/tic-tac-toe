import React, { MouseEventHandler } from 'react'
import { _getNewSession, _getSession, _postMove } from '../../../services'
import Board from '../../board'
import { DEFAULT_BOARD_SIZE } from '../../constants'
import { GAME_TYPE, PIECE } from '../../enums'
import BoardSizeInput from '../../peripherals/board-size-input'
import SessionIdInput from '../../peripherals/session-id-input'
import WinOverlay from '../../peripherals/win-overlay'
import { checkWin, initBoard } from '../../utils'
import OnlineGameDetails from './details'

interface IOnlineGameProps {
  gameType: GAME_TYPE,
  onQuit: MouseEventHandler<HTMLDivElement>
}

interface IOnlineGameState {
  playerName: string | null,
  opponentName: string | null,
  sessionId: string | null,
  started: boolean,
  boardSize: number,
  disabled: boolean,
  board: Array<Array<PIECE>>,
  pollId: string | null,
  showWinState: boolean,
  showLoseState: boolean
}

class OnlineGame extends React.Component<IOnlineGameProps, IOnlineGameState> {

  state = {
    playerName: null,
    opponentName: null,
    sessionId: null,
    started: false,
    boardSize: DEFAULT_BOARD_SIZE,
    disabled: false,
    board: initBoard(DEFAULT_BOARD_SIZE),
    pollId: null,
    showWinState: false,
    showLoseState: false
  }

  render(){

    if (!this.state.started) {
      
      if (this.props.gameType == GAME_TYPE.ONLINE_HOST) {
        return (
          <BoardSizeInput
            onBack={this.props.onQuit}
            onSubmit={this.handleSubmitBoardSize}
          />
        )
      } else {
        return (
          <SessionIdInput
            onBack={this.props.onQuit}
            onChange={this.handleChangeSessionId}
            onSubmit={this.handleSubmitSessionId}
          />
        )
      }

    }

    const playerName = this.state.playerName as any as string
    const opponentName = this.state.opponentName as any as string
    const sessionId = this.state.sessionId as any as string

    return (
      <>
        {this.state.showWinState && 
        <WinOverlay
          winnerName={playerName}
          onClickMenu={this.props.onQuit}
        />
        }
        {this.state.showLoseState &&
        <WinOverlay
          isLoseState
          winnerName={opponentName}
          onClickMenu={this.props.onQuit}
        />
        }
        <>
          <Board
            renderGameDetails={() => {
              return (
                <OnlineGameDetails
                  playerName={playerName}
                  opponentName={opponentName}
                  sessionId={sessionId}
                />
              )
            }}
            {...this.props}
            disabled={this.state.disabled}
            board={this.state.board}
            onMove={this.handleMove}
          />
        </>
      </>
    )
  }

  getMyPiece = () => {
    if (this.props.gameType == GAME_TYPE.ONLINE_HOST) {
      return PIECE.CIRCLE
    }
    return PIECE.CROSS
  }

  getOpponentPiece = () => {
    if (this.props.gameType == GAME_TYPE.ONLINE_HOST) {
      return PIECE.CROSS
    }
    return PIECE.CIRCLE
  }

  getOpponentName = (session: any) => {
    if (this.props.gameType == GAME_TYPE.ONLINE_HOST) {
      return session.awayPlayerName
    }
    return session.homePlayerName
  }

  handleSubmitBoardSize = async (boardSize: number) => {
    const res = await _getNewSession(boardSize)
    const { session, playerName } = res.data
    this.startSession(session, playerName)
  }

  handleChangeSessionId = (sessionId: string) => {
    this.setState({sessionId})
  }

  handleSubmitSessionId = async () => {
    try {
      const sessionId = this.state.sessionId as any as string
      const res = await _getSession(sessionId)
      const { session, playerName } = res.data
      this.startSession(session, playerName)

    } catch(e) {
      if (e.response.status == 403) {
        return alert("Sorry, but you're not part of that session :(")
      }

      if (e.response.status == 404) {
        return alert("Sorry, but we couldn't find that session :(")
      }
    }
  }

  handleMove = async (rowIndex: number, colIndex: number) => {
    
    const { board, boardSize } = this.state

    if (board[rowIndex][colIndex] != PIECE.EMPTY) {
      return 
    }

    const sessionId = this.state.sessionId as any as string
    
    const piece = this.getMyPiece()
    await _postMove(sessionId, rowIndex, colIndex, piece)
  
    board[rowIndex][colIndex] = piece
  
    this.setState({ 
      board
    }, () => {
      const hasWon = checkWin({
        rowIndex, 
        colIndex, 
        piece, 
        boardSize, 
        board
      })

      if (hasWon) {
        this.doWinRoutine()
      } else {
        this.startPoll()
        this.setState({ disabled: true })
      }
    })
  
  }

  startSession = (session: any, playerName: string) => {
    this.setState({ 
      playerName,
      board: session.board,
      boardSize: session.boardSize,
      sessionId: session.id,
      started: true
    })
    
    if (this.props.gameType == GAME_TYPE.ONLINE_JOIN) {
      this.startPoll()
    }
  }

  startPoll = () => {
    const pollId = setInterval(async () => {

      this.setState({ pollId: pollId as any as string })

      const res = await _getSession(this.state.sessionId as any as string, this.state.playerName as any as string)
      const { session } = res.data
      
      if (JSON.stringify(session.board) != JSON.stringify(this.state.board)) {
        this.setState({
          disabled: false
        }, () => {
          this._clearInterval()

          const piece = this.getOpponentPiece()
          const opponentName = this.getOpponentName(session)
          
          this.setState({
            board: session.board,
            opponentName
          }, () => {
            const hasLost = checkWin({
              rowIndex: session.latestMove.i, 
              colIndex: session.latestMove.j, 
              piece, 
              boardSize: session.boardSize, 
              board: session.board
            })
  
            if (hasLost) {
              this.doLoseRoutine()
            }
          })
        })
      }

    }, 2000)
  }

  doWinRoutine() {
    this._clearInterval()
    this.setState({ showWinState: true })
  }
  
  doLoseRoutine() {
    this._clearInterval()
    this.setState({ showLoseState: true })
  }

  _clearInterval() {
    clearInterval(this.state.pollId as any as number)
    this.setState({ pollId: null })
  }

}

export default OnlineGame