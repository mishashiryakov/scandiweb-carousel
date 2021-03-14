import './styles/styles.css';
import React, { useState } from 'react';
import { render } from 'react-dom';
import images from './data';

import Carousel from './components/Carousel.jsx'

const App = () => {

  const [thresholdWidth, setThresholdWidth] = useState(0.5);
  const [thresholdTime, setThresholdTime] = useState(300);

  return (
    <div className="container">

      <header>
        <h3>Test task "Scandiweb" for Scandiweb</h3>
        <h4>By Michael Shiryakov</h4>
      </header>

      <Carousel 
        images={images} 
        thresholdWidth={thresholdWidth}
        thresholdTime={thresholdTime}
      />
    </div>
  )
}

render(<App />, document.getElementById('app'))
