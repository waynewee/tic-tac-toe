import React from 'react'
import MainApp from '../components/_app'
import Head from 'next/head'

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Head>
          <title>Tic Tac Toe</title>
        </Head>
        <div className="container">
          <MainApp/>
          <div style={{
            position: 'fixed',
            bottom: 10,
            right: 24,
            fontWeight: 600
          }}>
            © 2021 Wayne Wee
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage