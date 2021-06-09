import React from 'react'
import { _getSession, _getNewSession, _postMove } from '../services'

import { GAME_TYPE } from './enums'
import StartMenu from './peripherals/start-menu'
import OnlineGame from './game/online'
import LocalGame from './game/local'

interface IMainAppProps {}
interface IMainAppState {
  gameType: GAME_TYPE | null,
}

class MainApp extends React.Component<IMainAppProps, IMainAppState> {

  state = {
    gameType: null,
  }
  
  render() {

    if (!this.state.gameType) {
      return (
        <StartMenu
          onClickHost={this.handleInitOnlineHost}
          onClickJoin={this.handleInitOnlineJoin}
          onClickLocal={this.handleInitLocal}
        />
      )
    }

    if (this.state.gameType == GAME_TYPE.ONLINE_HOST || this.state.gameType == GAME_TYPE.ONLINE_JOIN) {
      return (
        <OnlineGame 
          onQuit={this.handleResetState}
          gameType={this.state.gameType as any as GAME_TYPE}
        />
      )
    }
    

    if (this.state.gameType == GAME_TYPE.LOCAL) {
      return (
        <LocalGame
          onQuit={this.handleResetState}
        />
      )
    }

  }


  handleInitLocal = () => {
    this.setState({ 
      gameType: GAME_TYPE.LOCAL
    })
  }

  handleInitOnlineHost = () => {
    this.setState({ 
      gameType: GAME_TYPE.ONLINE_HOST
    })
  }

  handleInitOnlineJoin = () => {
    this.setState({ 
      gameType: GAME_TYPE.ONLINE_JOIN
    })
  }

  handleResetState = () => {
    this.setState({ 
      gameType: null 
    })
  }

}

export default MainApp