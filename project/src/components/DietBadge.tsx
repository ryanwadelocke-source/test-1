import { useContent } from '../contexts/ContentContext';

const activeBadgeStyle = {
  background: '#1c2810',
  color: '#cdd9a4',
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: '11px',
  letterSpacing: '0.08em',
  padding: '0px 3px',
  lineHeight: '1.4',
  display: 'inline-block',
} as const;

const inactiveBadgeStyle = {
  border: '1px dashed rgba(28,40,16,0.35)',
  color: 'rgba(28,40,16,0.35)',
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: '11px',
  letterSpacing: '0.08em',
  padding: '0px 3px',
  lineHeight: '1.4',
  display: 'inline-block',
} as const;

interface DietBadgeProps {
  contentKey: string;
  /** Default on/off state derived from static menu data */
  defaultValue: boolean;
  label: string;
}

export default function DietBadge({ contentKey, defaultValue, label }: DietBadgeProps) {
  const { getText, updateText, isEditMode } = useContent();
  const raw = getText(contentKey, '');
  const isActive = raw === '' ? defaultValue : raw === 'true';

  if (!isEditMode) {
    if (!isActive) return null;
    return <span style={activeBadgeStyle}>{label}</span>;
  }

  return (
    <button
      title={isActive ? `Remove ${label} badge` : `Add ${label} badge`}
      onClick={(e) => {
        e.stopPropagation();
        updateText(contentKey, String(!isActive));
      }}
      style={isActive ? activeBadgeStyle : inactiveBadgeStyle}
    >
      {label}
    </button>
  );
}
