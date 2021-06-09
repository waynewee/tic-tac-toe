import React, { MouseEventHandler } from 'react'

interface IWinOverlayProps {
  winnerName: string,
  onClickMenu: MouseEventHandler<HTMLDivElement>,
  isLoseState?: boolean
}

class WinOverlay extends React.Component<IWinOverlayProps> {
  render() {
    return (
      <>
        <div className={`win-overlay-background${this.props.isLoseState?' lose-overlay-background':''}`}/>
        <div className="win-overlay">
          <div>
            <div className="win-overlay-name">
              {this.props.winnerName.toLowerCase()} ({this.props.isLoseState? "not you": "you"}) won!
            </div>
            <div 
            onClick={this.props.onClickMenu}
            className="default-button default-button-solid">
              Go To Menu
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default WinOverlay