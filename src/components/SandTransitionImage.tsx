import React, { useEffect, useRef, useState } from 'react';
import { usePresence, useReducedMotion } from 'motion/react';

interface SandTransitionImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

let instanceCounter = 0;

export const SandTransitionImage: React.FC<SandTransitionImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
}) => {
  const [isPresent, safeToRemove] = usePresence();
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const filterIdRef = useRef(`sand-filter-${++instanceCounter}`);
  const filterId = filterIdRef.current;

  // Filter SVG node refs
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const offsetRef = useRef<SVGFEOffsetElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const colorMatrixRef = useRef<SVGFEColorMatrixElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const imgContainerRef = useRef<HTMLDivElement | null>(null);

  // Fallback state for mobile or reduced motion
  const [fallbackOpacity, setFallbackOpacity] = useState(1);
  const [fallbackBlur, setFallbackBlur] = useState(0);

  // Check window size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const useFallback = isMobile || prefersReducedMotion;

  useEffect(() => {
    if (useFallback) {
      if (!isPresent) {
        // Exiting with simple fade
        setFallbackOpacity(0);
        setFallbackBlur(4);
        const timer = setTimeout(() => {
          safeToRemove();
        }, 400);
        return () => clearTimeout(timer);
      } else {
        // Entering with simple fade
        setFallbackOpacity(1);
        setFallbackBlur(0);
      }
      return;
    }

    // SVG Sand transition animation via requestAnimationFrame (900ms)
    let animationFrameId: number;
    const duration = 900;
    const startTime = performance.now();
    const isExiting = !isPresent;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);

      if (isExiting) {
        // Exit easing: t^3
        const p = Math.pow(rawProgress, 3);
        const scale = p * 150;
        const dy = p * 120;
        const dx = (Math.sin(rawProgress * Math.PI) * 30);
        const blur = p * 6;
        const opacity = Math.max(0, 1 - p * 1.2);

        if (displacementRef.current) displacementRef.current.setAttribute('scale', scale.toString());
        if (offsetRef.current) {
          offsetRef.current.setAttribute('dy', dy.toString());
          offsetRef.current.setAttribute('dx', dx.toString());
        }
        if (blurRef.current) blurRef.current.setAttribute('stdDeviation', blur.toString());
        if (colorMatrixRef.current) {
          colorMatrixRef.current.setAttribute(
            'values',
            `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${opacity} 0`
          );
        }

        if (rawProgress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          safeToRemove();
        }
      } else {
        // Entrance easing: 1 - (1 - t)^4
        // reverse from full sand dispersion to sharp
        const inverted = 1 - (1 - Math.pow(1 - rawProgress, 4));
        const p = 1 - inverted;
        const scale = p * 150;
        const dy = -(p * 80);
        const dx = (Math.sin(p * Math.PI) * 30);
        const blur = p * 6;
        const opacity = Math.min(1, Math.max(0, 1 - p * 1.2));

        if (displacementRef.current) displacementRef.current.setAttribute('scale', scale.toString());
        if (offsetRef.current) {
          offsetRef.current.setAttribute('dy', dy.toString());
          offsetRef.current.setAttribute('dx', dx.toString());
        }
        if (blurRef.current) blurRef.current.setAttribute('stdDeviation', blur.toString());
        if (colorMatrixRef.current) {
          colorMatrixRef.current.setAttribute(
            'values',
            `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${opacity} 0`
          );
        }

        if (rawProgress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Reset cleanly at end of entrance
          if (displacementRef.current) displacementRef.current.setAttribute('scale', '0');
          if (offsetRef.current) {
            offsetRef.current.setAttribute('dy', '0');
            offsetRef.current.setAttribute('dx', '0');
          }
          if (blurRef.current) blurRef.current.setAttribute('stdDeviation', '0');
          if (colorMatrixRef.current) {
            colorMatrixRef.current.setAttribute(
              'values',
              '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0'
            );
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPresent, useFallback, safeToRemove]);

  return (
    <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
      {!useFallback && (
        <svg
          className="absolute w-0 h-0 pointer-events-none"
          aria-hidden="true"
        >
          <filter
            id={filterId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="1.8"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feOffset
              ref={offsetRef}
              in="displaced"
              dx="0"
              dy="0"
              result="offset"
            />
            <feGaussianBlur
              ref={blurRef}
              in="offset"
              stdDeviation="0"
              result="blurred"
            />
            <feColorMatrix
              ref={colorMatrixRef}
              in="blurred"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>
        </svg>
      )}

      <div
        ref={imgContainerRef}
        style={
          useFallback
            ? {
                opacity: fallbackOpacity,
                filter: `blur(${fallbackBlur}px)`,
                transition: 'opacity 400ms ease, filter 400ms ease',
              }
            : {
                filter: `url(#${filterId})`,
              }
        }
        className="w-full h-full flex items-center justify-center"
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`max-h-[380px] md:max-h-[440px] w-auto object-contain mix-blend-lighten transition-opacity duration-300 ${imgClassName}`}
        />
      </div>
    </div>
  );
};
