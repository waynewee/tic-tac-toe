import React from 'react'

interface IOnlineGameDetailsProps {
  playerName: string,
  opponentName: string,
  sessionId: string
}

class OnlineGameDetails extends React.Component<IOnlineGameDetailsProps> {
  render() {
    return (
      <div>
        <div className="game-detail">
          <div className="game-label">Player:</div>
          <div className="game-value">{this.props.playerName}</div>
        </div>
        <div className="game-detail">
          <div className="game-label">Playing Against:</div>
          <div className="game-value">{this.props.opponentName || "..."}</div>
        </div>
        <div className="game-detail">
          <div className="game-label">Session ID:</div>
          <div className="game-value">{this.props.sessionId}</div>
        </div>
      </div>
    )
  }
}

export default OnlineGameDetails