import React from 'react'
import { PIECE } from '../../enums'
import { circleIcon, crossIcon } from '../../icons'

interface ILocalGameDetailsProps {
  activePiece: PIECE
}

class LocalGameDetails extends React.Component<ILocalGameDetailsProps> {
  render() {
    return (
      <div className="game-detail-container">
        <div className="game-turn-label">
          {this.props.activePiece == PIECE.CIRCLE? circleIcon : crossIcon} 
          <span style={{ fontWeight: 400, opacity: 0.8, marginLeft: 8}}>
            Turn
          </span>
        </div>
      </div>
    )
  }
}

export default LocalGameDetails