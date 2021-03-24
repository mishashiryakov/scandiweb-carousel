import React, { useRef } from 'react';

const SLIDE_CLASSNAME = 'slide';

const Slide = ({ data }) => {
  const videoTag = useRef(null);
  
  const styles = {
    backgroundImage: `url('${data.src}')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }

  const hideControls = (event) => {
    event = event || window.event;
    event.preventDefault();
    videoTag.current.removeAttribute('controls');
  }

  const showControls = (event) => {
    event = event || window.event;
    event.preventDefault();
    setTimeout(() => videoTag.current.setAttribute('controls', true));
  }

  return (
      <>
        {data.type === 'img/gif' && 
          <div className={SLIDE_CLASSNAME} style={styles}></div>
        }

        {data.type === 'video' && 
          <video 
            src={data.src}
            ref={videoTag}
            className={SLIDE_CLASSNAME} 
            controls 
            onMouseDown={hideControls}
            onMouseUp={showControls}
          />          
        }

        {data.type === 'text' &&
          <div className={SLIDE_CLASSNAME}>
            <span>{data.src.title}</span>
            <span>{data.src.text}</span>
          </div>
        }
      </>
    )
}

export default Slide;