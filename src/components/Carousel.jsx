import React, { useEffect, useRef } from 'react';

import Slide from './Slide';

const Carousel = ({ images, thresholdWidth, thresholdTime }) => {

  const slidesContainer = useRef(null);
  const isMoving = useRef(false);
  const index = useRef(0);
  const initialPosition = useRef();
  const finalPosition = useRef();
  const positionOnDragStart = useRef(0);  
  const distanceOfDrag = useRef(0);
  const slideWidth = useRef();
  const timeInterval = useRef(true);
  const timerForDrag = useRef()


  useEffect(() => {
    const firstSlide = slidesContainer.current.children[0];
    const cloneFirst = slidesContainer.current.children[0].cloneNode(true);
    const cloneLast = slidesContainer.current.children[images.length - 1].cloneNode(true);

    slidesContainer.current.appendChild(cloneFirst);
    slidesContainer.current.insertBefore(cloneLast, firstSlide);
    
    slideWidth.current = slidesContainer.current.children[0].offsetWidth;

    slidesContainer.current.addEventListener('touchstart', dragStart);
    slidesContainer.current.addEventListener('touchend', dragEnd);
    slidesContainer.current.addEventListener('touchmove', dragAction);    
  }, [])

  const moveSlide = (direction, isDragged) => {
    if (isMoving.current) { return }

    if (!isDragged) { 
      initialPosition.current = slidesContainer.current.offsetLeft 
    }

    if (direction > 0) {
      slidesContainer.current.style.left = (initialPosition.current - direction * slideWidth.current) + "px";
      index.current += direction;
    } else if (direction < 0) {
      slidesContainer.current.style.left = (initialPosition.current + Math.abs(direction) * slideWidth.current) + "px";
      index.current--;  
    }
    
    isMoving.current = true;
  }

  const dragStart = (event) => {
    timerForDrag.current = setTimeout(() => {
      console.log('НЕ УСПЕЛ')
      return timeInterval.current = false}, thresholdTime)
    slidesContainer.current.classList.remove('moving');

    event = event || window.event;
    event.preventDefault();
    initialPosition.current = slidesContainer.current.offsetLeft;
    
    if (event.type === 'touchstart') {
      positionOnDragStart.current = event.touches[0].clientX;
    } else {
      positionOnDragStart.current = event.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }
  
  const dragAction = (event) => {
    event = event || window.event;
    event.preventDefault();
    
    if (event.type === 'touchmove') {
      distanceOfDrag.current = positionOnDragStart.current - event.touches[0].clientX;
      positionOnDragStart.current = event.touches[0].clientX;
    } else {
      distanceOfDrag.current = positionOnDragStart.current - event.clientX;
      positionOnDragStart.current = event.clientX;

    }
    slidesContainer.current.style.left = (slidesContainer.current.offsetLeft - distanceOfDrag.current) + "px";
  }
    
  const dragEnd = () => {
    finalPosition.current = slidesContainer.current.offsetLeft;

    let quantityOfSkippedSlides = Math.round((initialPosition.current - finalPosition.current) / slideWidth.current);
    if (timeInterval.current) {
      if (finalPosition.current < initialPosition.current) {
        moveSlide(1, true);
      } else if (finalPosition.current > initialPosition.current) {
        moveSlide(-1, true);
      } 

      clearTimeout(timerForDrag.current);
      timeInterval.current = true;

      document.onmouseup = null;
      document.onmousemove = null;
      slidesContainer.current.classList.add('moving');
      return;
    } 
    clearTimeout(timerForDrag.current);
    timeInterval.current = true;
    slidesContainer.current.style.left = (initialPosition.current) + "px";
    console.log('не попал сюда')
    if (finalPosition.current - initialPosition.current < -(thresholdWidth * slideWidth.current)) {
      moveSlide(quantityOfSkippedSlides, true);
    } else if (finalPosition.current - initialPosition.current > thresholdWidth * slideWidth.current) {
      moveSlide(quantityOfSkippedSlides, true);
    } else {
      slidesContainer.current.style.left = (initialPosition.current) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
    slidesContainer.current.classList.add('moving');

  }

  const checkCurrentSlideIndex = () => {

    if (index.current === -1) {
      slidesContainer.current.classList.remove('moving');
      slidesContainer.current.style.left = -(images.length * slideWidth.current) + "px";
      index.current = images.length - 1;
      setTimeout(() => slidesContainer.current.classList.add('moving'), 1)
    }

    if (index.current === images.length) {
      slidesContainer.current.classList.remove('moving');
      slidesContainer.current.style.left = -(1 * slideWidth.current) + "px";
      index.current = 0;
      setTimeout(() => slidesContainer.current.classList.add('moving'), 1)
    }
    
    isMoving.current = false;
  }

  return (
      <div className="carousel">
        <div className="wrapper">
          <div 
            className="slidesContainer moving" 
            ref={slidesContainer} 
            onTransitionEnd={checkCurrentSlideIndex}
            onMouseDown={dragStart}
          >
            {images.map((img, index) => (
              <Slide key={index} image={img} />
            ))}
          </div>
        </div>
        <button className="control prevButton" onClick={moveSlide.bind(null, -1, false)}></button>
        <button className="control nextButton" onClick={moveSlide.bind(null, 1, false)}></button>
      </div>
  )
}

export default Carousel;