import React from 'react'

enum PIECE {
  CIRCLE = "CIRCLE",
  CROSS = "CROSS",
  EMPTY = "EMPTY"
}

const NUM_ROWS = 3
const NUM_COLS = NUM_ROWS

interface IHomeProps {}
interface IHomeState {
  board: Array<Array<PIECE>>,
  activePiece: PIECE,
  started: boolean
}

function initBoard(){
  const board = [] as Array<Array<PIECE>>

  for (let i = 0; i < NUM_ROWS; i++) {
    if (!board[i]){
      board[i] = []
    }
    for (let j = 0; j < NUM_COLS; j++) {
      board[i][j] = PIECE.EMPTY
    }
  }
  
  return board
}

class Home extends React.Component<IHomeProps, IHomeState> {

  state = {
    board: initBoard(),
    activePiece: PIECE.CIRCLE,
    started: false
  }
  
  render() {
    return (
      <div>
          {this.state.board.map( (row, rowIndex) => {
            return (
              <div>
                {row.map( (piece, colIndex) => {
                  return (
                    <span
                    onClick={()=>this.handleClick({ rowIndex, colIndex })}
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

  handleClick = ({ rowIndex, colIndex } : { rowIndex: number, colIndex: number }) => {
    const { board } = this.state
    board[rowIndex][colIndex] = this.state.activePiece
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
    const i = Math.floor(rowIndex / NUM_ROWS)
    for (let j = 0; j < NUM_COLS; j++) {
      if (this.state.board[i][j] != this.state.activePiece) {
        return false
      }
    }
    return true
  }

  checkWinVertical = (colIndex: number) => {
    const j = colIndex
    for (let i = 0; i < NUM_ROWS; i++) {
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
    while (i < NUM_ROWS && j < NUM_COLS) {
      if (this.state.board[i][j] != this.state.activePiece) {
        return false
      }
      i += 1
      j += 1
    }
    return true
  }

  checkWinRightDiagonal = (rowIndex: number, colIndex: number) => {
    if (rowIndex + colIndex != NUM_ROWS - 1) {
      return false
    }
    let i = NUM_ROWS - 1
    let j = 0;
    while (i >= 0 && j < NUM_COLS) {
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