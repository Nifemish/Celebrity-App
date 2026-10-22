import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface LuxuryLoaderProps {
  onComplete?: () => void;
  brandName?: string;
}

export const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({
  onComplete,
  brandName = 'AURA PRIVÉ',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        if (onComplete) onComplete();
      },
    });

    tl.to('#monogram-path', {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    })
      .to('#loader-text', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
      .to('#loader-overlay', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 1.0,
        delay: 0.4,
        ease: 'power4.inOut',
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      id="loader-overlay"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080A] text-[#EDE8DF]"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      <div className="flex flex-col items-center">
        {/* Animated Golden SVG Monogram Seal */}
        <svg
          width="110"
          height="110"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4"
        >
          {/* Diamond outer frame */}
          <polygon
            points="50,4 96,50 50,96 4,50"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="400"
            strokeDashoffset="400"
            id="monogram-path"
          />
          {/* Inner crest lines */}
          <path
            d="M32 66 L50 26 L68 66 M40 54 L60 54"
            stroke="#F9E7BA"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div
          id="loader-text"
          className="opacity-0 translate-y-3 transition-all text-center"
        >
          <div className="font-display text-lg font-bold tracking-[0.25em] text-white">
            {brandName}
          </div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#C9A86A] mt-1">
            Private Aviation & Celebrity Concierge
          </div>
        </div>
      </div>
    </div>
  );
};
