import React, { MouseEventHandler } from 'react'
import Board from '../../board'
import { DEFAULT_BOARD_SIZE } from '../../constants'
import { PIECE } from '../../enums'
import BoardSizeInput from '../../peripherals/board-size-input'
import WinOverlay from '../../peripherals/win-overlay'
import { checkWin, initBoard } from '../../utils'
import LocalGameDetails from './details'

interface ILocalGameProps {
  onQuit: MouseEventHandler<HTMLDivElement>
}

interface ILocalGameState {
  board: Array<Array<PIECE>>,
  boardSize: number,
  activePiece: PIECE,
  showWinState: boolean,
  started: boolean
}

class LocalGame extends React.Component<ILocalGameProps, ILocalGameState> {

  state = {
    board: initBoard(DEFAULT_BOARD_SIZE),
    boardSize: DEFAULT_BOARD_SIZE,
    activePiece: PIECE.CIRCLE,
    showWinState: false,
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

    return (
      <>
        {this.state.showWinState &&
        <WinOverlay
          winnerName={this.state.activePiece}
          onClickMenu={this.props.onQuit}
        />
        }
        <>
          <Board
            renderGameDetails={() => {
              return (
                <LocalGameDetails
                  activePiece={this.state.activePiece}
                />
              )
            }}
            {...this.props}
            board={this.state.board}
            onMove={this.handleMove}
          />
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

      const hasWon = checkWin({
        rowIndex,
        colIndex,
        piece: this.state.activePiece,
        boardSize,
        board
      })

      if (hasWon) {
        return this.setState({ showWinState: true })
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