import React  from 'react';
import data from './data';
import Carousel from './components/Carousel.jsx';

const THRESHOLD_WIDTH = 0.5;
const THRESHOLD_TIME = 300;

const App = () => {
  return (
    <div className="container">

      <header>
        <h3>Test task "Carousel" for Scandiweb</h3>
        <h4>By Michael Shiryakov</h4>
      </header>

      <Carousel 
        data={data} 
        thresholdWidth={THRESHOLD_WIDTH}
        thresholdTime={THRESHOLD_TIME}
      />

    </div>
  )
}

export default App;