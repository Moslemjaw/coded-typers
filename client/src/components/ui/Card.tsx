import React from 'react';
import { motion } from 'framer-motion';

// ============================================================
// Card — Rounded container with shadow and hover effects
// ============================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', hover = false, padding = 'md', onClick }: CardProps) {
  const Component = hover || onClick ? motion.div : 'div';
  const motionProps = hover || onClick ? {
    whileHover: { y: -4, boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      className={`
        bg-white dark:bg-dark-card rounded-card shadow-card dark:shadow-card-dark
        border border-surface-100 dark:border-dark-border
        ${paddings[padding]} ${onClick ? 'cursor-pointer' : ''} ${className}
      `}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
