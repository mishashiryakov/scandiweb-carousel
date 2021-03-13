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
  const timerForDrag = useRef();


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
    document.querySelector('.nav-dot').classList.add('active-dot')
  }, [])


  const moveSlide = (direction, isDragged) => {
    if (isMoving.current) { return }

    if (!isDragged) { 
      initialPosition.current = slidesContainer.current.offsetLeft;
    }

    if (direction > 0) {
      slidesContainer.current.style.left = (initialPosition.current - direction * slideWidth.current) + "px";
    } else if (direction < 0) {
      slidesContainer.current.style.left = (initialPosition.current + Math.abs(direction) * slideWidth.current) + "px";
    }

    index.current += direction;  
    isMoving.current = true;
  }

  const dragStart = (event) => {
    if (isMoving.current) { return }
    timerForDrag.current = setTimeout(() => {
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
    if (isMoving.current) { return }
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
    if (isMoving.current) { return }

    finalPosition.current = slidesContainer.current.offsetLeft;
    let quantityOfSkippedSlides = Math.round((initialPosition.current - finalPosition.current) / slideWidth.current);
    const dragOffset = finalPosition.current - initialPosition.current;
    
    clearTimeout(timerForDrag.current);
    
    if (timeInterval.current) {
      (dragOffset < 0) && moveSlide(1, true);
      (dragOffset > 0) && moveSlide(-1, true);
    } else {
      const shouldMove = Math.abs(dragOffset) > (thresholdWidth * slideWidth.current);

      shouldMove 
        ? moveSlide(quantityOfSkippedSlides, true)
        : slidesContainer.current.style.left = (initialPosition.current) + "px";
    }
    
    
    timeInterval.current = true;
    document.onmouseup = null;
    document.onmousemove = null;
    slidesContainer.current.classList.add('moving');
    isMoving.current = false;

  }

  const checkCurrentSlideIndex = () => {
    

    if (index.current < 0 || index.current === images.length) {
      isMoving.current = true;
      slidesContainer.current.classList.remove('moving');
      (index.current < 0) && (slidesContainer.current.style.left = -(slideWidth.current * (images.length + 1 - Math.abs(index.current))) + "px");
      (index.current === images.length) && (slidesContainer.current.style.left = -(1 * slideWidth.current) + "px");
      
      index.current < 0
      ? index.current = images.length - Math.abs(index.current) 
      : index.current = 0;
      setTimeout(() => slidesContainer.current.classList.add('moving'), 1)
    }

    document.querySelectorAll('.nav-dot').forEach(el => el.classList.remove('active-dot'))
    document.getElementById(`${index.current}-dot`).classList.add('active-dot')

    isMoving.current = false;
  }

  const calcDirectionForDots = (indexOfClickedDot) => {
    const indexOfActiveDot = Number(document.querySelector('.active-dot').id[0]);
    return indexOfClickedDot - indexOfActiveDot;
  }

  return (
    <>
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
        <div className="dots">
          {images.map((el, index) => (
            <span
              className="nav-dot" 
              key={index}
              id={`${index}-dot`}
              onClick={() => moveSlide(calcDirectionForDots(index), false)}
            >
            </span>
          ))}
        </div>
      </div>
      
    </>
  )
}

export default Carousel;