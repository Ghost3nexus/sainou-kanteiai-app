'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTransitionProps {
  children: ReactNode;
  isVisible: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export default function AnimatedTransition({
  children,
  isVisible,
  direction = 'right'
}: AnimatedTransitionProps) {
  const variants = {
    enter: {
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
      opacity: 0
    },
    center: {
      x: 0,
      y: 0,
      opacity: 1
    },
    exit: {
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}