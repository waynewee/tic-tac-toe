import React, { MouseEventHandler } from 'react'
import { PIECE } from '../enums'
import Piece from './piece'

interface IBoardProps {
  board: Array<Array<PIECE>>,
  disabled?: boolean,
  onMove: Function,
  onQuit: MouseEventHandler<HTMLDivElement>,
  renderGameDetails: Function
}

class Board extends React.Component<IBoardProps> {
  render(){
    const boardSize = this.props.board.length

    return (
      <div className="board-container">
        {this.props.renderGameDetails()}
        <div className="board">
          {this.props.board.map( (row, rowIndex) => {
            return (
              <div 
              style={{ height: `${40/boardSize}vh`}}
              className="board-row">
                {row.map( (piece, colIndex) => {
                  return (
                    <span
                      className={`piece-container${rowIndex == 0 ? ' top-bordered':''}${colIndex == 0 ? ' left-bordered':''}`}
                      onClick={()=>this.handleMove(rowIndex, colIndex)}
                    >
                      <Piece
                        height={`${40/boardSize}vh`}
                        piece={piece}
                      />
                    </span>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div
          className="default-button"
          onClick={this.props.onQuit}
        >
          Quit
        </div>
      </div>
    )
  }
    
  handleMove = (rowIndex: number, colIndex: number) => {

    if (this.props.disabled) {
      return 
    }

    this.props.onMove(rowIndex, colIndex)

  }
      
}

export default Board