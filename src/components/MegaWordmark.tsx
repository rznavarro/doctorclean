import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MegaWordmarkProps {
  className?: string;
  isCutoffBottom?: boolean;
}

export const MegaWordmark: React.FC<MegaWordmarkProps> = ({
  className = '',
  isCutoffBottom = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const prefersReducedMotion = useReducedMotion();

  // ResizeObserver to calculate exact fit without overflow
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current || !textRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;

      if (containerWidth > 0 && textWidth > 0) {
        // Calculate precise scale factor so it fills width
        const ratio = containerWidth / textWidth;
        setScale(ratio);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const characters = [
    { char: 'D', key: 'd' },
    { char: 'R', key: 'r' },
    { char: '.', key: 'dot' },
    { char: '\u00A0', key: 'space' },
    { char: 'C', key: 'c' },
    { char: 'L', key: 'l' },
    { char: 'E', key: 'e' },
    { char: 'A', key: 'a' },
    { char: 'N', key: 'n' },
  ];

  const containerVariants = {
    hidden: { scale: 1.03 },
    visible: {
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.06,
      },
    },
  };

  const letterVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 120, opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden select-none ${
        isCutoffBottom ? 'h-[9vw] max-h-[140px]' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          transformOrigin: 'left top',
          transform: `scale(${scale})`,
        }}
        className="w-fit"
      >
        <div
          ref={textRef}
          className="inline-flex items-baseline font-medium text-mega tracking-[-0.04em] leading-[0.75] text-[#111] whitespace-nowrap will-change-transform"
        >
          {characters.map((item, idx) => (
            <span
              key={`${item.key}-${idx}`}
              className="inline-block overflow-hidden align-baseline"
              style={{ lineHeight: 0.78 }}
            >
              <motion.span
                variants={letterVariants}
                className="inline-block"
              >
                {item.char}
              </motion.span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
