/**
 * Shared BA domain/expert metadata + small helpers, ported from the v3 prototype
 * (ba2-data.jsx BA2_INDUSTRIES / BA2_TPL_TONES, ba2-tasks.jsx complexityColor,
 *  ba3-discovery.jsx BA3_OUTPUT_OPTIONS, ba3-diagrams.jsx BA3_DIAGRAM_TYPES).
 *
 * Single source of truth so Discovery, Tasks editor and Diagrams views stay consistent.
 */

export interface ExpertProfile {
  id: string;
  label: string;
  short: string;
  bg: string;
  fg: string;
  icon: string;
}

/* 7 industries with brand tints + lucide icon name (must exist in Icon.tsx). */
export const INDUSTRIES: ExpertProfile[] = [
  { id: 'banking',    label: 'Banking & Finance', short: 'Banking',    bg: '#e8f0fe', fg: '#1967d2', icon: 'landmark' },
  { id: 'insurance',  label: 'Insurance',         short: 'Insurance',  bg: '#fce8e6', fg: '#c5221f', icon: 'briefcase' },
  { id: 'fintech',    label: 'Fintech',           short: 'Fintech',    bg: '#e6f4ea', fg: '#137333', icon: 'circle-dollar-sign' },
  { id: 'ecommerce',  label: 'E-commerce',        short: 'E-commerce', bg: '#fef7e0', fg: '#b06000', icon: 'shopping-cart' },
  { id: 'saas',       label: 'SaaS',              short: 'SaaS',       bg: '#e8eaff', fg: '#3f51b5', icon: 'cloud' },
  { id: 'healthcare', label: 'Healthcare',        short: 'Healthcare', bg: '#e6f4ea', fg: '#0b8043', icon: 'heart-pulse' },
  { id: 'game',       label: 'Game',              short: 'Game',       bg: '#f3e8fd', fg: '#8430ce', icon: 'gamepad-2'      },
];

const DEFAULT_EXPERT: ExpertProfile = {
  id: 'general', label: 'Tổng quát', short: 'BA', bg: '#e8f0fe', fg: '#1967d2', icon: 'drafting-compass',
};

/**
 * Resolve an expert profile from a project's `domain` field.
 * Domain strings are free-form ('banking', 'Banking & Finance', 'bank'...), so
 * we match by id, label or fuzzy substring before falling back to the default.
 */
export function resolveExpert(domain?: string): ExpertProfile {
  if (!domain) return DEFAULT_EXPERT;
  const d = domain.toLowerCase();
  return (
    INDUSTRIES.find(i => i.id === d) ||
    INDUSTRIES.find(i => d.includes(i.id)) ||
    INDUSTRIES.find(i => i.label.toLowerCase().includes(d) || d.includes(i.short.toLowerCase())) ||
    DEFAULT_EXPERT
  );
}

/* Template/output tone palette. */
export type ToneId = 'indigo' | 'purple' | 'sky' | 'green' | 'amber' | 'rose' | 'slate';
export const TPL_TONES: Record<ToneId, { bg: string; fg: string }> = {
  indigo: { bg: '#e8f0fe', fg: '#1967d2' },
  purple: { bg: '#f3e8fd', fg: '#8430ce' },
  sky:    { bg: '#e0f2fe', fg: '#0369a1' },
  green:  { bg: '#e6f4ea', fg: '#137333' },
  amber:  { bg: '#fef7e0', fg: '#b06000' },
  rose:   { bg: '#fce8e6', fg: '#c5221f' },
  slate:  { bg: '#eef2f7', fg: '#475569' },
};

export function tonePair(t?: string) {
  return TPL_TONES[(t as ToneId)] || TPL_TONES.slate;
}

/* Output picker options (grouped) — drives Discovery "Sinh nháp" + Tasks. */
export interface OutputOption {
  id: string;
  label: string;
  icon: string;
  tone: ToneId;
  group: string;
}
export const OUTPUT_OPTIONS: OutputOption[] = [
  { id: 'brd',      label: 'BRD',             icon: 'file-pen-line', tone: 'indigo', group: 'Đặc tả' },
  { id: 'srs',      label: 'SRS',             icon: 'scroll-text',   tone: 'purple', group: 'Đặc tả' },
  { id: 'user-story', label: 'User Story',    icon: 'book-copy',     tone: 'green',  group: 'Đặc tả' },
  { id: 'usecase',  label: 'Use Case',        icon: 'git-branch',    tone: 'purple', group: 'Đặc tả' },
  { id: 'diagram',  label: 'Sơ đồ nghiệp vụ', icon: 'square-kanban', tone: 'purple', group: 'Đặc tả' },
  { id: 'estimate', label: 'Estimation',      icon: 'calculator',    tone: 'amber',  group: 'Thương mại' },
  { id: 'funcs',    label: 'Function list',   icon: 'list-tree',     tone: 'sky',    group: 'Lập kế hoạch' },
  { id: 'sprint',   label: 'Sprint Plan',     icon: 'square-kanban', tone: 'sky',    group: 'Lập kế hoạch' },
  { id: 'testplan', label: 'Test Plan',       icon: 'badge-check',   tone: 'rose',   group: 'Chất lượng' },
];

/* Diagram types for the Diagrams view. */
export interface DiagramType {
  id: string;
  label: string;
  icon: string;
  tone: ToneId;
  desc: string;
  mermaid: string; // hint for AI generation
}
export const DIAGRAM_TYPES: DiagramType[] = [
  { id: 'flow',     label: 'Process Flow',       icon: 'git-branch',       tone: 'indigo', desc: 'Quy trình tuyến tính',      mermaid: 'flowchart TD' },
  { id: 'bpmn',     label: 'BPMN',               icon: 'square-kanban',    tone: 'purple', desc: 'Swim-lane BPMN 2.0',        mermaid: 'flowchart LR' },
  { id: 'sequence', label: 'Sequence Diagram',   icon: 'list-tree',        tone: 'sky',    desc: 'Tương tác actor/system',    mermaid: 'sequenceDiagram' },
  { id: 'arch',     label: 'Kiến trúc tổng quan', icon: 'layout-dashboard', tone: 'amber',  desc: 'Layered architecture',      mermaid: 'flowchart TB' },
  { id: 'er',       label: 'ER Diagram',         icon: 'database',         tone: 'green',  desc: 'Quan hệ thực thể',          mermaid: 'erDiagram' },
  { id: 'state',    label: 'State Machine',      icon: 'circle-dot',       tone: 'rose',   desc: 'Vòng đời trạng thái',       mermaid: 'stateDiagram-v2' },
];

/* Complexity 1–10 → color band (Estimate view). */
export function complexityColor(n: number): { bg: string; fg: string } {
  if (n <= 2) return { bg: '#d1fae5', fg: '#047857' };
  if (n <= 4) return { bg: '#dbeafe', fg: '#1d4ed8' };
  if (n <= 6) return { bg: '#fef3c7', fg: '#a16207' };
  if (n <= 8) return { bg: '#ffedd5', fg: '#c2410c' };
  return { bg: '#fee2e2', fg: '#b91c1c' };
}
