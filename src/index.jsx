
import './styles/styles.css'
import React from 'react'
import { render } from 'react-dom'

import Slider from './components/Slider.jsx'

const App = () => {

  return (
    <div className="container">
      <Slider />
    </div>
  )
}

render(<App />, document.getElementById('app'))
