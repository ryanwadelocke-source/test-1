import { useRef } from 'react';
import { useContent } from '../contexts/ContentContext';

const badgeStyle = {
  background: '#1c2810',
  color: '#cdd9a4',
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: '11px',
  letterSpacing: '0.08em',
  padding: '0px 3px',
  lineHeight: '1.4',
  display: 'inline-block',
} as const;

interface TagEditorProps {
  contentKey: string;
  defaultTag: string;
}

export default function TagEditor({ contentKey, defaultTag }: TagEditorProps) {
  const { getText, updateText, isEditMode } = useContent();
  const tagValue = getText(contentKey, defaultTag);
  const spanRef = useRef<HTMLSpanElement>(null);

  if (!isEditMode) {
    if (!tagValue) return null;
    return (
      <span
        className="font-mono flex-shrink-0"
        style={badgeStyle}
      >
        {tagValue}
      </span>
    );
  }

  if (tagValue) {
    return (
      <span className="inline-flex items-center gap-px flex-shrink-0">
        <span
          ref={spanRef}
          contentEditable
          suppressContentEditableWarning
          data-editable="true"
          className="font-mono flex-shrink-0"
          style={{
            ...badgeStyle,
            outline: 'none',
            minWidth: '0.5em',
          }}
          onClick={(e) => e.stopPropagation()}
          onBlur={(e) => {
            const newVal = (e.currentTarget.textContent || '').trim();
            if (newVal !== tagValue) updateText(contentKey, newVal || tagValue);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
          }}
          dangerouslySetInnerHTML={{ __html: tagValue }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); updateText(contentKey, ''); }}
          title="Remove badge"
          className="flex items-center justify-center flex-shrink-0"
          style={{
            background: '#3d5228',
            color: '#cdd9a4',
            fontSize: '11px',
            width: '14px',
            height: '14px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        updateText(contentKey, defaultTag || 'NEW');
        setTimeout(() => spanRef.current?.focus(), 50);
      }}
      title="Add badge"
      className="inline-flex items-center gap-px flex-shrink-0 font-mono"
      style={{
        border: '1px dashed rgba(28,40,16,0.4)',
        color: '#3d5228',
        fontSize: '9px',
        padding: '1px 3px',
        lineHeight: '1.4',
      }}
    >
      + BADGE
    </button>
  );
}
