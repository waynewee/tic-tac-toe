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
        <div className={`win-overlay${this.props.isLoseState?' lose-overlay':''}`}>
          <div className="win-overlay-content">
            <div>
              <div className="win-overlay-name">
                {this.props.winnerName.toLowerCase()} won!
              </div>
              <div 
              onClick={this.props.onClickMenu}
              className="default-button default-button-solid">
                Go To Menu
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default WinOverlay