import React, { MouseEventHandler } from 'react'

interface ISessionIdInputProps {
  onChange: Function,
  onBack: MouseEventHandler<HTMLDivElement>,
  onSubmit: MouseEventHandler<HTMLDivElement>
}

class SessionIdInput extends React.Component<ISessionIdInputProps> {
  render(){
    return (
      <div>
        <div className="input-label">
          Session ID: 
        </div>
        <input
          placeholder="123456"
          onChange={(e: any) => this.props.onChange(e.target.value)}
        />
        <div 
        className="default-button"
        onClick={this.props.onSubmit}>
          OK
        </div>
        <div 
        className="default-button"
        onClick={this.props.onBack}>
          Back
        </div>
      </div>
    )
  }
}

export default SessionIdInput