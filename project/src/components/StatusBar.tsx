import { useState, useEffect } from 'react';
import EditableField from './EditableField';

export default function StatusBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lcd-title-bar flex items-center justify-between px-3 py-1 gap-2 overflow-hidden" style={{ fontSize: 'clamp(8px, 2vw, 11px)' }}>
      <EditableField
        contentKey="status.title"
        defaultValue="LARK F.F."
        className="font-display tracking-wider whitespace-nowrap flex-shrink-0"
        style={{ fontSize: '1.15em' }}
      />
      <div className="flex items-center gap-1.5 font-mono text-lcd-text-light opacity-80 whitespace-nowrap flex-shrink-0">
        <span>{date}</span>
        <span className="opacity-40">·</span>
        <span className="font-display flex-shrink-0" style={{ fontSize: '1.1em', letterSpacing: '0.04em' }}>{time}</span>
        <BatteryIcon />
      </div>
    </div>
  );
}

function BatteryIcon() {
  return (
    <svg width="2em" height="1.1em" viewBox="0 0 22 12" fill="none" className="opacity-80 flex-shrink-0">
      <rect x="0.5" y="0.5" width="18" height="11" rx="1.5" stroke="#cdd9a4" strokeWidth="1"/>
      <rect x="19" y="3.5" width="2.5" height="5" rx="0.5" fill="#cdd9a4"/>
      <rect x="2" y="2" width="14" height="8" rx="0.5" fill="#cdd9a4"/>
    </svg>
  );
}
