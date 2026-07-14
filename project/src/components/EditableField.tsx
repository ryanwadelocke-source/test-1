import React from 'react';
import { useContent } from '../contexts/ContentContext';

interface EditableFieldProps {
  contentKey: string;
  defaultValue: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'div' | 'p';
  multiline?: boolean;
}

export default function EditableField({
  contentKey,
  defaultValue,
  className,
  style,
  as: Tag = 'span',
  multiline = false,
}: EditableFieldProps) {
  const { getText, updateText, isEditMode } = useContent();
  const value = getText(contentKey, defaultValue);
  const El = Tag as React.ElementType;

  if (!isEditMode) {
    return <El className={className} style={style}>{value}</El>;
  }

  return (
    <El
      contentEditable
      suppressContentEditableWarning
      className={className}
      style={style}
      data-editable="true"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const newVal = (e.currentTarget.textContent || '').trim();
        if (newVal !== value) updateText(contentKey, newVal || defaultValue);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
