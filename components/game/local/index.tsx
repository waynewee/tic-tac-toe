import React, { MouseEventHandler } from 'react'
import Board from '../../board'
import { DEFAULT_BOARD_SIZE } from '../../constants'
import { PIECE } from '../../enums'
import { circleIcon, crossIcon } from '../../icons'
import BoardSizeInput from '../../peripherals/board-size-input'
import WinOverlay from '../../peripherals/win-overlay'
import { checkWin, initBoard } from '../../utils'

interface ILocalGameProps {
  onQuit: MouseEventHandler<HTMLDivElement>
}

interface ILocalGameState {
  board: Array<Array<PIECE>>,
  boardSize: number,
  activePiece: PIECE,
  showWinState: boolean,
  showDrawState: boolean,
  started: boolean
}

class LocalGame extends React.Component<ILocalGameProps, ILocalGameState> {

  state = {
    board: initBoard(DEFAULT_BOARD_SIZE),
    boardSize: DEFAULT_BOARD_SIZE,
    activePiece: PIECE.CIRCLE,
    showWinState: false,
    showDrawState: false,
    started: false
  }

  render(){

    if (!this.state.started) {
      return (
        <BoardSizeInput
          onSubmit={this.handleSubmitBoardSize}
          onBack={this.props.onQuit}
        />
      )
    }

    const activePieceIcon = this.state.activePiece == PIECE.CIRCLE? circleIcon : crossIcon

    return (
      <>
        {(this.state.showWinState || this.state.showDrawState) &&
        <WinOverlay
          isDrawState={this.state.showDrawState}
          winner={this.state.activePiece}
          onClickMenu={this.props.onQuit}
        />
        }
        <>
          <div className="board-container">
            <div 
            style={{ marginBottom: 8}}
            className="turn-label">
              {activePieceIcon}
              <span>
                Turn
              </span>
            </div>
            <Board
              {...this.props}
              board={this.state.board}
              onMove={this.handleMove}
            />
            <div
              className="default-button"
              onClick={this.props.onQuit}
            >
              Quit
            </div>
          </div>
        </>
      </>
    )
  }

  handleSubmitBoardSize = (boardSize: number) => {
    this.setState({ 
      boardSize,
      board: initBoard(boardSize),
      started: true
    })
  }

  handleMove = (rowIndex: number, colIndex: number) => {
    
    const { board, boardSize } = this.state

    if (board[rowIndex][colIndex] != PIECE.EMPTY) {
      return 
    }
    board[rowIndex][colIndex] = this.state.activePiece
    
    this.setState({ 
      board
    }, () => {

      const { won, draw } = checkWin({
        rowIndex,
        colIndex,
        piece: this.state.activePiece,
        boardSize,
        board
      })

      if (won) {
        return this.setState({ showWinState: true })
      }

      if (draw) {
        return this.setState({ showDrawState: true })
      }

      this.toggleActivePiece()
    })

  }

  toggleActivePiece = () => {
    this.setState({
      activePiece: this.state.activePiece == PIECE.CIRCLE ? PIECE.CROSS : PIECE.CIRCLE
    })
  }
}

export default LocalGame