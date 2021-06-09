import React, { MouseEventHandler } from 'react'

interface IStartMenuProps {
  onClickLocal: MouseEventHandler<HTMLDivElement>,
  onClickHost: MouseEventHandler<HTMLDivElement>,
  onClickJoin: MouseEventHandler<HTMLDivElement>
}

class StartMenu extends React.Component<IStartMenuProps> {
  render(){
    return (
      <div>
        <div>
          <div className="default-button" onClick={this.props.onClickLocal}>Local Game</div>
        </div>
        <div>
          <div className="default-button" onClick={this.props.onClickHost}>Host Game</div>
        </div>
        <div>
          <div className="default-button" onClick={this.props.onClickJoin}>Join Game</div>
        </div>
      </div>
    )
  }
}

export default StartMenu