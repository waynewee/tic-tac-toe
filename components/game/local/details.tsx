import React from 'react'
import { PIECE } from '../../enums'

interface ILocalGameDetailsProps {
  activePiece: PIECE
}

class LocalGameDetails extends React.Component<ILocalGameDetailsProps> {
  render() {
    return (
      <div>
        <div className="game-detail">
          <div className="game-label">Your Turn:</div>
          <div className="game-value">{this.props.activePiece}</div>
        </div>
      </div>
    )
  }
}

export default LocalGameDetails