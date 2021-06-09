import React from 'react'
import { PIECE } from '../enums'
import { circleIcon, crossIcon, emptyIcon } from '../icons'

interface IPieceProps {
  piece: PIECE,
  height: string
}

class Piece extends React.Component<IPieceProps> {
  render(){
    return (
      <div 
      style={{
        width: this.props.height,
        height: this.props.height
      }}
      className="piece">
        {this.getIcon()}
      </div>
    )
  }

  getIcon = () => {
    switch(this.props.piece) {
      case PIECE.CIRCLE: 
        return circleIcon
      case PIECE.CROSS:
        return crossIcon
      default:
        return emptyIcon
    }
  }
}

export default Piece