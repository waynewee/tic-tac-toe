import React from 'react'

interface IOnlineGameDetailsProps {
  playerName: string,
  opponentName: string,
  sessionId: string,
  isOwnTurn: boolean
}

class OnlineGameDetails extends React.Component<IOnlineGameDetailsProps> {
  render() {
    return (
      <div className="row game-detail-container">
        <div className="column">
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
        <div 
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
        className="column">
          <div className="game-turn-label">
            {this.props.isOwnTurn?<span>Your Turn</span>:<span>Enemy Turn</span>}
          </div>
        </div>
      </div>
    )
  }
}

export default OnlineGameDetails