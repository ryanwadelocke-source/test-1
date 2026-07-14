import { Home, UtensilsCrossed, Info, Music } from 'lucide-react';

type Page = 'home' | 'menu' | 'about' | 'music';

interface NavBarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'HOME', Icon: Home },
  { id: 'menu', label: 'MENU', Icon: UtensilsCrossed },
  { id: 'music', label: 'MUSIC', Icon: Music },
  { id: 'about', label: 'ABOUT', Icon: Info },
];

export default function NavBar({ current, onNavigate }: NavBarProps) {
  return (
    <div className="px-4 py-3 flex items-center justify-around">
      {navItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`pda-button flex flex-col items-center justify-center w-14 h-14 rounded-full gap-1 ${current === id ? 'active' : ''}`}
          aria-label={label}
        >
          <Icon
            size={18}
            strokeWidth={1.5}
            className={current === id ? 'text-lcd-text' : 'text-lcd-text'}
          />
          <span
            className={`font-mono tracking-wider text-lcd-text`}
            style={{ fontSize: '11px' }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
