import React, { useEffect, useRef } from 'react';
import Slide from './Slide';

const NAV_DOT_CLASSNAME = '.nav-dot';
const ACTIVE_DOT_CLASSNAME = 'active-dot';
const MOVING_CLASSNAME = 'moving';

const Carousel = ({ data = [], thresholdWidth = 0.5, thresholdTime = 300 }) => {

  const slidesContainer = useRef(null);
  const isMoving = useRef(false);
  const index = useRef(0);
  const initialPosition = useRef();
  const finalPosition = useRef();
  const positionOnDragStart = useRef(0);  
  const directionOfDrag = useRef(0);
  const slideWidth = useRef();
  const timeInterval = useRef(true);
  const timeIntervalDebounce = useRef();
  const directions = useRef({right: 1, left: -1});
  const navDotsContainer = useRef(null);

  useEffect(() => {
    const firstSlide = slidesContainer.current.children[0];
    const lastSlide = slidesContainer.current.children[data.length - 1];

    const cloneFirst = firstSlide.cloneNode(true);
    const cloneLast = lastSlide.cloneNode(true);

    slidesContainer.current.appendChild(cloneFirst);
    slidesContainer.current.insertBefore(cloneLast, firstSlide);
    
    slideWidth.current = firstSlide.offsetWidth;

    slidesContainer.current.addEventListener('touchstart', dragStart);
    slidesContainer.current.addEventListener('touchmove', dragAction); 
    slidesContainer.current.addEventListener('touchend', dragEnd);
       
    navDotsContainer.current.children[0].classList.add(ACTIVE_DOT_CLASSNAME);
  }, []);

  const moveSlide = (amountOfSlides, isDragged) => {
    if (isMoving.current || amountOfSlides === 0) { return };
    if (!isDragged) { initialPosition.current = slidesContainer.current.offsetLeft };

    slidesContainer.current.style.left = (initialPosition.current - amountOfSlides * slideWidth.current) + "px";
    index.current += amountOfSlides;  
    isMoving.current = true;
  }

  const dragStart = (event) => {
    if (isMoving.current) { return };

    event = event || window.event;
    event.preventDefault();

    timeIntervalDebounce.current = setTimeout(() => {
      return timeInterval.current = false
    }, thresholdTime);
      
    slidesContainer.current.classList.remove(MOVING_CLASSNAME);
    initialPosition.current = slidesContainer.current.offsetLeft;
    
    if (event.type === 'touchstart') {
      positionOnDragStart.current = event.touches[0].clientX;
    } else {
      positionOnDragStart.current = event.clientX;
      
      document.onmousemove = dragAction;
      document.onmouseup = dragEnd;
    }
  }
  
  const dragAction = (event) => {
    if (isMoving.current) { return };

    event = event || window.event;
    event.preventDefault();
    
    if (event.type === 'touchmove') {
      directionOfDrag.current = positionOnDragStart.current - event.touches[0].clientX;
      positionOnDragStart.current = event.touches[0].clientX;
    } else {
      directionOfDrag.current = positionOnDragStart.current - event.clientX;
      positionOnDragStart.current = event.clientX;
    }

    slidesContainer.current.style.left = (slidesContainer.current.offsetLeft - directionOfDrag.current) + "px";
  }
    
  const dragEnd = (event) => {

    if (isMoving.current) { return };

    event = event || window.event;
    event.preventDefault();

    finalPosition.current = slidesContainer.current.offsetLeft;
    let quantityOfSkippedSlides = Math.round((initialPosition.current - finalPosition.current) / slideWidth.current);
    const dragOffset = finalPosition.current - initialPosition.current;
    clearTimeout(timeIntervalDebounce.current);
    
    if (timeInterval.current) {
      (dragOffset < 0) && moveSlide(directions.current.right, true);
      (dragOffset > 0) && moveSlide(directions.current.left, true);
    } else {
      const shouldMove = Math.abs(dragOffset) > (thresholdWidth * slideWidth.current);
      shouldMove 
        ? moveSlide(quantityOfSkippedSlides, true)
        : slidesContainer.current.style.left = initialPosition.current + "px";
    }
    
    timeInterval.current = true;
    document.onmouseup = null;
    document.onmousemove = null;
    slidesContainer.current.classList.add(MOVING_CLASSNAME);
    isMoving.current = false;
  }

  const transitionEndHandler = () => {
    if (index.current < 0 || index.current >= data.length) {
      isMoving.current = true;
      slidesContainer.current.classList.remove(MOVING_CLASSNAME);
      
      if (index.current < 0) {
        slidesContainer.current.style.left = -(slideWidth.current * (data.length + 1 - Math.abs(index.current))) + "px";
        index.current = data.length - Math.abs(index.current);
      } else {
        slidesContainer.current.style.left = -(slideWidth.current * ((Math.abs(index.current)) - data.length + 1)) + "px";
        index.current = Math.abs(index.current) - data.length;
      }

      setTimeout(() => slidesContainer.current.classList.add(MOVING_CLASSNAME), 0);
    }
    
    for(let key of navDotsContainer.current.children) {
      key.classList.remove(ACTIVE_DOT_CLASSNAME)
    }
    navDotsContainer.current.children[index.current].classList.add(ACTIVE_DOT_CLASSNAME);
    isMoving.current = false;
  }

  const calcAmountOfSlides = (indexOfClickedDot) => {
    const indexOfActiveDot = index.current;

    return indexOfClickedDot - indexOfActiveDot;
  }

  return (
    <div className="carousel">
        <div className="wrapper">
          <div 
            className={`slidesContainer ${MOVING_CLASSNAME}`} 
            ref={slidesContainer} 
            onTransitionEnd={transitionEndHandler}
            onMouseDown={dragStart}
          >
            {data.map((el, index) => (
              <Slide key={index} data={el} />
            ))}
          </div>
        </div>
        <button className="control prevButton" onClick={() => moveSlide(directions.current.left, false)}></button>
        <button className="control nextButton" onClick={() => moveSlide(directions.current.right, false)}></button>
        <div className="dots" ref={navDotsContainer}>
          {data.map((el, index) => (
            <span
              className="nav-dot" 
              key={index}
              id={`${index}-dot`}
              onClick={() => moveSlide(calcAmountOfSlides(index), false)}
            >
            </span>
          ))}
        </div>
      </div>
  )
}

export default Carousel;