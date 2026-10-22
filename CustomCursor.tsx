import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (cursorDotRef.current) {
        gsap.to(cursorDotRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.1,
          ease: 'power2.out',
        });
      }

      if (cursorRingRef.current) {
        gsap.to(cursorRingRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.35,
          ease: 'power4.out',
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-[#D4AF37] rounded-full pointer-events-none z-[9999] opacity-80"
      />
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-[#D4AF37]/40 rounded-full pointer-events-none z-[9998] transition-transform duration-100 ease-out"
      />
    </>
  );
};
