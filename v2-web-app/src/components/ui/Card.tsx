import React, { useState } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style, onClick, hover = false }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      className={`border border-border-color rounded-2xl bg-bg-surface ${className}`}
      style={{
        boxShadow: hovered
          ? '0 1px 3px rgba(60,64,67,.18), 0 4px 12px rgba(60,64,67,.10)'
          : '0 1px 2px rgba(60,64,67,.06)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow .18s ease, transform .18s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
