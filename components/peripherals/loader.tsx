import React from 'react'

interface ILoaderProps {}
interface ILoaderState {
  message: string,
  intervalId: number | null
}

class Loader extends React.Component {

  state = {
    message: "Loading",
    intervalId: null
  }

  render(){
    return (
      <div className="loader">
        {this.state.message}
      </div>
    )
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId as any as number)
  }

  componentDidMount() {
    const intervalId = setInterval(() => {
      if (this.state.message == "Loading...") {
        this.setState({ message: "Loading"})
      } else {
        this.setState({ message: `${this.state.message}.`})
      }
    }, 300)

    this.setState({ intervalId })
  }

}

export default Loader