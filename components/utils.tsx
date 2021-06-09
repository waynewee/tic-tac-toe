import { PIECE } from "./enums"

export function initBoard(boardSize: number){
  const board = [] as Array<Array<PIECE>>

  for (let i = 0; i < boardSize; i++) {
    if (!board[i]){
      board[i] = []
    }
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = PIECE.EMPTY
    }
  }
  
  return board
}

export function checkWin({
  rowIndex,
  colIndex,
  piece,
  board,
  boardSize
}:{
  rowIndex: number,
  colIndex: number,
  piece: PIECE,
  board: Array<Array<PIECE>>,
  boardSize: number
}){

  const won = checkWinHorizontal()
    || checkWinVertical()
    || checkWinLeftDiagonal()
    || checkWinRightDiagonal()

  const draw = !won && checkCompleted()

  return {
    won,
    draw
  }

  function checkWinHorizontal(){
    const i = rowIndex
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] != piece) {
        return false
      }
    }
    return true
  }

  function checkWinVertical(){
    const j = colIndex
    for (let i = 0; i < boardSize; i++) {
      if(board[i][j] != piece) {
        return false
      }
    }
    return true
  }

  function checkWinLeftDiagonal(){
    if (rowIndex != colIndex) {
      return false
    }
  
    let i = 0;
    let j = 0;
    while (i < boardSize && j < boardSize) {
      if (board[i][j] != piece) {
        return false
      }
      i += 1
      j += 1
    }
    return true
  }

  function checkWinRightDiagonal(){
    if (rowIndex + colIndex != boardSize - 1) {
      return false
    }
    let i = boardSize - 1
    let j = 0;
    while (i >= 0 && j < boardSize) {
      if (board[i][j] != piece) {
        return false
      }
      i -= 1
      j += 1
    }
    return true
  }

  function checkCompleted(){
    for (let i = 0; i < boardSize; i++){
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] ==  PIECE.EMPTY) {
          return false
        }
      }
    }
    return true
  }

}