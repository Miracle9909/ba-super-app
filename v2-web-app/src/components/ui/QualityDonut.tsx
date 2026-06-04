import React from 'react';

interface QualityDonutProps {
  score: number;
  size?: number;
}

/* Circular progress donut for quality score — ported from prototype v3 (ba-tabs-b.jsx). */
export const QualityDonut: React.FC<QualityDonutProps> = ({ score, size = 140 }) => {
  const r = 52;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const off = c - (clamped / 100) * c;
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label={`Quality score ${clamped}%`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="#e3e7ee" strokeWidth="14" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="14"
        strokeDasharray={c}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dashoffset .6s ease' }}
      />
      <text x="70" y="68" textAnchor="middle" fontSize="30" fontWeight="600" fill="var(--text-primary)">{clamped}%</text>
      <text x="70" y="88" textAnchor="middle" fontSize="11.5" fill="var(--text-secondary)">Quality</text>
    </svg>
  );
};
