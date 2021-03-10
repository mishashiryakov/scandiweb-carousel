import Post from './Post'
import './styles/styles.css'
import React, { useState } from 'react'
import { render } from 'react-dom'

const post = new Post('Test title')

console.log('POST to string', post.toString())

const App = () => {

  const [test, setTest] = useState('Desk')
  use
  return (
    <div className="container">
      <h1>{test}</h1>

      <hr/>
      <div className="logo"></div>
    </div>
  )
}

render(<App />, document.getElementById('app'))
