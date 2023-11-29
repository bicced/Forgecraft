import { useState, useEffect } from 'react';

function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e: any) {
      setPosition({ 
        x: e.clientX + window.scrollX, 
        y: e.clientY + window.scrollY 
      });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}

function useDelayedValue(value: any, delay: number, isHoveringClickable: boolean) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    if (isHoveringClickable) {
      setDelayedValue(value);
      return;
    }
    else {
      setTimeout(() => {
        setDelayedValue(value);
      }, delay);
    }

  }, [value, delay, isHoveringClickable]);

  return delayedValue;
}

function Dot({ position, opacity, enlarged = false }: any) {
  const scaleValue = enlarged ? 1.5 : 1;
  const size = enlarged ? 45 : 30;
  const offset = enlarged ? -22.5 : -15;
  const borderColor = enlarged ? 'black' : 'transparent'; // Change 'white' to your desired border color
  const borderWidth = enlarged ? '2px' : '0px';

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: '#3AB0FF',
      borderRadius: '50%',
      border: `${borderWidth} solid ${borderColor}`,
      opacity,
      transform: `translate(${position.x}px, ${position.y}px) scale(${scaleValue})`,
      pointerEvents: 'none',
      left: offset,
      top: offset,
      width: size,
      height: size,
      zIndex: 9999,
    }} />
  );
}

export default () => {
  const [isHoveringClickable, setIsHoveringClickable] = useState<boolean>(false);
  
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100, isHoveringClickable);
  const pos3 = useDelayedValue(pos2, 100, isHoveringClickable);
  const pos4 = useDelayedValue(pos3, 100, isHoveringClickable);
  const pos5 = useDelayedValue(pos4, 100, isHoveringClickable);
  const pos6 = useDelayedValue(pos5, 100, isHoveringClickable);


  useEffect(() => {
    function handleMouseEnter(e: any) {
      if (typeof e.target.className === 'string' && e.target.className.includes('clickable')) {
          setIsHoveringClickable(true);
      }
    }

    function handleMouseLeave(e: any) {
      if (typeof e.target.className === 'string' && e.target.className.includes('clickable')) {
          setIsHoveringClickable(false);
      }
    }

    document.body.addEventListener('mouseenter', handleMouseEnter, true);
    document.body.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
        document.body.removeEventListener('mouseenter', handleMouseEnter, true);
        document.body.removeEventListener('mouseleave', handleMouseLeave, true);
    };
}, []);

  return (
    <>
      <Dot position={pos1} opacity={isHoveringClickable ? 0.05 : 1} enlarged={isHoveringClickable} />
      <Dot position={pos2} opacity={isHoveringClickable ? 0.05 : 0.9} enlarged={isHoveringClickable} />
      <Dot position={pos3} opacity={isHoveringClickable ? 0.05 : 0.8} enlarged={isHoveringClickable} />
      <Dot position={pos4} opacity={isHoveringClickable ? 0.05 : 0.7} enlarged={isHoveringClickable} />
      <Dot position={pos5} opacity={isHoveringClickable ? 0.05 : 0.6} enlarged={isHoveringClickable} />
      <Dot position={pos6} opacity={isHoveringClickable ? 0.05 : 0.5} enlarged={isHoveringClickable} />
    </>
  );
}
