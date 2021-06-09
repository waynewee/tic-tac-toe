import React, { MouseEventHandler } from 'react'
import { DEFAULT_BOARD_SIZE } from '../constants'

interface IBoardSizeInputProps {
  onSubmit: (value: number) => void,
  onBack: MouseEventHandler<HTMLDivElement>
}

interface IBoardSizeInputState {
  value: number,
  showError: boolean,
}

class BoardSizeInput extends React.Component<IBoardSizeInputProps, IBoardSizeInputState> {

  state = {
    value: DEFAULT_BOARD_SIZE,
    showError: false
  }

  render(){
    return (
      <div>
        <div className="input-label">
          Board Size: 
          <div className='input-label-more'>
            Input an odd number (1-19)
          </div>
        </div>
        <input
          className={`${this.state.showError?'error':''}`}
          value={this.state.value}
          onChange={this.handleChange}
        />
        <div 
        onClick={this.handleSubmit}
        className={`default-button${this.state.showError?' disabled':''}`}>
          OK
        </div>
        <div className="default-button" onClick={this.props.onBack}>
          Back
        </div>
      </div>
    )
  }

  handleChange = (e: any) => {

    const { value } = e.target

    if (!isNaN(value)) {
      this.setState({ 
        value,
        showError: value % 2 == 0 || value < 1 || value > 19
      })
    }

  }

  handleSubmit = () => {
    if (this.state.showError){
      return
    }
    this.props.onSubmit(this.state.value as any as number)
  }


}

export default BoardSizeInput