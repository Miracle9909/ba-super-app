import React from 'react';
import { Icon } from './Icon';

/* ---- PrimaryBtn: filled rounded button ---- */
interface PrimaryBtnProps {
  children: React.ReactNode;
  icon?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const PrimaryBtn: React.FC<PrimaryBtnProps> = ({ children, icon, onClick, className = '', size = 'md', disabled = false }) => {
  const sizes = { sm: 'h-9 px-3.5 text-[13px]', md: 'h-10 px-4 text-[13.5px]' };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium text-white transition-colors shadow-sm bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:bg-border-color disabled:text-text-disabled ${sizes[size]} ${className}`}
    >
      {icon && <Icon name={icon} size={17} strokeWidth={2} />}
      {children}
    </button>
  );
};

/* ---- GhostBtn: bordered outlined button ---- */
interface GhostBtnProps {
  children: React.ReactNode;
  icon?: string;
  onClick?: () => void;
  className?: string;
  tone?: 'default' | 'primary';
  disabled?: boolean;
}

export const GhostBtn: React.FC<GhostBtnProps> = ({ children, icon, onClick, className = '', tone = 'default', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-full text-[13px] font-medium border border-border-color bg-white transition-colors hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed ${
        tone === 'primary' ? 'text-primary' : 'text-text-secondary'
      } ${className}`}
    >
      {icon && <Icon name={icon} size={16} strokeWidth={2} />}
      {children}
    </button>
  );
};

/* ---- IconBtn: circular icon-only button ---- */
interface IconBtnProps {
  icon: string;
  onClick?: () => void;
  title?: string;
  badge?: boolean;
}

export const IconBtn: React.FC<IconBtnProps> = ({ icon, onClick, title, badge }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary transition-colors hover:bg-bg-hover"
    >
      <Icon name={icon} size={20} />
      {badge && (
        <span
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ background: '#d93025', boxShadow: '0 0 0 2px #fff' }}
        />
      )}
    </button>
  );
};
