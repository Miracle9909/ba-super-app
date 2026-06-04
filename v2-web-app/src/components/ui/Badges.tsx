import React from 'react';
import { Icon } from './Icon';
import { resolveExpert } from '../../lib/ba/domainExpert';

/* ---- IndustryBadge ---- */
interface IndustryBadgeProps {
  domain: string;
  size?: 'sm' | 'md';
}

export const IndustryBadge: React.FC<IndustryBadgeProps> = ({ domain, size = 'sm' }) => {
  const expert = resolveExpert(domain);
  const pad = size === 'sm' ? '3px 10px 3px 8px' : '4px 12px 4px 9px';
  const fs = size === 'sm' ? 12 : 12.5;
  const iconSize = size === 'sm' ? 13 : 14;

  return (
    <span
      className="inline-flex items-center gap-1.5 font-medium rounded-full leading-none whitespace-nowrap"
      style={{ background: expert.bg, color: expert.fg, padding: pad, fontSize: fs }}
    >
      <Icon name={expert.icon} size={iconSize} strokeWidth={2.1} />
      {expert.short || expert.label}
    </span>
  );
};

/* ---- StatusBadge ---- */
interface StatusBadgeProps {
  status: 'done' | 'pending' | 'pass' | 'running';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const good = status === 'done' || status === 'pass';
  const bg = good ? '#e6f4ea' : '#fef7e0';
  const fg = good ? '#137333' : '#b06000';
  const label = status === 'done' ? 'Đã xử lý' : status === 'pending' ? 'Chờ xử lý'
    : status === 'pass' ? 'PASS' : 'Đang chạy';
  const icon = good ? 'check-circle' : 'clock';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium leading-none whitespace-nowrap"
      style={{ background: bg, color: fg }}
    >
      <Icon name={icon} size={13} strokeWidth={2.1} />
      {label}
    </span>
  );
};

/* ---- ProgressBar ---- */
interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color, height = 8 }) => {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: '#e3e7ee', height }}>
      <div
        style={{
          width: `${value}%`,
          background: color || 'var(--primary)',
          height: '100%',
          borderRadius: 999,
          transition: 'width .4s ease',
        }}
      />
    </div>
  );
};

/* ---- SectionTitle ---- */
interface SectionTitleProps {
  children: React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, sub, right }) => {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-[18px] font-semibold leading-tight text-text-primary">{children}</h2>
        {sub && <p className="text-[13px] mt-1 text-text-secondary">{sub}</p>}
      </div>
      {right}
    </div>
  );
};

/* ---- StatCard ---- */
interface StatCardProps {
  stat: {
    value: string;
    label: string;
    icon: string;
    tintBg: string;
    tintFg: string;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="border border-border-color rounded-2xl bg-bg-surface p-4 flex items-center gap-3.5"
      style={{ boxShadow: '0 1px 2px rgba(60,64,67,.06)' }}>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: stat.tintBg, color: stat.tintFg }}
      >
        <Icon name={stat.icon} size={22} strokeWidth={1.85} />
      </div>
      <div>
        <div className="text-[22px] font-semibold text-text-primary leading-tight">{stat.value}</div>
        <div className="text-[12.5px] text-text-secondary mt-0.5">{stat.label}</div>
      </div>
    </div>
  );
};
