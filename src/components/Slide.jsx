import React, { useRef } from 'react';

const Slide = ({ data }) => {

  const videoTag = useRef(null);
  
  const styles = {
      backgroundImage: `url('${data.src}')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
  }

  const hideControls = (event) => {
    event.preventDefault();
    videoTag.current.removeAttribute('controls');
  }

  const showControls = (event) => {
    event.preventDefault();
    setTimeout(() => videoTag.current.setAttribute('controls', true));
  }


  return (
      <>
        {data.type === 'img/gif' && <div className="slide" style={styles}></div>}

        {data.type === 'video' && 
          <video 
            ref={videoTag}
            className="slide" 
            controls 
            onMouseDown={hideControls}
            onMouseUp={showControls}
            src={data.src}
          />          
        }

        {data.type === 'text' &&
          <div className="slide">
            <span>{data.src.title}</span>
            <span>{data.src.text}</span>
          </div>
        }
        </>
    )
}

export default Slide;